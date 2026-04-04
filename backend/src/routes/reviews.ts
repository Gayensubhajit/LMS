import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";

export const reviewsRouter = Router();

const createReviewSchema = z.object({
  courseSlug: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

reviewsRouter.post("/", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid review payload",
    });
  }

  const { courseSlug, rating, comment } = parsed.data;

  // Check if course exists
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
  });

  if (!course) {
    return res.status(404).json({
      ok: false,
      error: "Course not found",
    });
  }

  // Upsert review (one per user per course)
  const review = await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    update: {
      rating,
      comment,
    },
    create: {
      userId: user.id,
      courseId: course.id,
      rating,
      comment,
    },
  });


  return res.status(200).json({
    ok: true,
    item: review,
  });
});

reviewsRouter.get("/course/:slug", async (req, res) => {
  const { slug } = req.params;

  const reviews = await prisma.review.findMany({
    where: {
      course: { slug },
    },
    include: {
      user: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({
    ok: true,
    items: reviews,
  });
});
