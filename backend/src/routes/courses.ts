import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export const coursesRouter = Router();

const listQuerySchema = z.object({
  category: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]).optional(),
  q: z.string().optional()
});

const slugParamsSchema = z.object({
  slug: z.string().min(1)
});

coursesRouter.get("/", async (req, res) => {
  const parsedQuery = listQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid query parameters"
    });
  }

  const { category, level, q } = parsedQuery.data;

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...(category ? { category } : {}),
      ...(level ? { level } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { shortDescription: { contains: q, mode: "insensitive" } },
              { instructorName: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      category: true,
      level: true,
      instructorName: true,
      previewVideoUrl: true,
      oneMonthPrice: true,
      threeMonthPrice: true,
      sixMonthPrice: true,
      imageUrl: true
    }
  });

  return res.status(200).json({
    ok: true,
    count: courses.length,
    items: courses
  });
});

coursesRouter.get("/:slug", async (req, res) => {
  const parsed = slugParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid course slug"
    });
  }

  const course = await prisma.course.findFirst({
    where: {
      slug: parsed.data.slug,
      isPublished: true
    },
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      longDescription: true,
      category: true,
      level: true,
      instructorName: true,
      previewVideoUrl: true,
      oneMonthPrice: true,
      threeMonthPrice: true,
      sixMonthPrice: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!course) {
    return res.status(404).json({
      ok: false,
      error: "Course not found"
    });
  }

  return res.status(200).json({
    ok: true,
    item: course
  });
});

coursesRouter.get("/:slug/lessons", async (req, res) => {
  const parsed = slugParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid course slug"
    });
  }

  const course = await prisma.course.findFirst({
    where: {
      slug: parsed.data.slug,
      isPublished: true
    },
    select: {
      id: true,
      slug: true,
      title: true,
      sections: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              videoUrl: true,
              content: true,
              durationMins: true,
              position: true,
              isPreview: true
            }
          }
        }
      }
    }
  });

  if (!course) {
    return res.status(404).json({
      ok: false,
      error: "Course not found"
    });
  }

  return res.status(200).json({
    ok: true,
    item: course
  });
});

