import { EnrollmentStatus } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";

export const accessRouter = Router();

const courseSlugSchema = z.object({
  slug: z.string().min(1)
});

const lessonIdSchema = z.object({
  lessonId: z.string().min(1)
});

async function hasActiveEnrollment(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
      status: EnrollmentStatus.ACTIVE,
      expiresAt: { gt: new Date() }
    },
    select: {
      id: true,
      expiresAt: true
    }
  });
  return enrollment;
}

accessRouter.get("/courses/:slug", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = courseSlugSchema.safeParse(req.params);
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
      title: true
    }
  });

  if (!course) {
    return res.status(404).json({
      ok: false,
      error: "Course not found"
    });
  }

  const enrollment = await hasActiveEnrollment(user.id, course.id);
  const canAccess = Boolean(enrollment);

  return res.status(200).json({
    ok: true,
    item: {
      courseSlug: course.slug,
      canAccess,
      reason: canAccess ? "active_enrollment" : "no_active_enrollment",
      expiresAt: enrollment?.expiresAt ?? null
    }
  });
});

accessRouter.get("/lessons/:lessonId", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = lessonIdSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid lesson id"
    });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: parsed.data.lessonId },
    select: {
      id: true,
      isPreview: true,
      section: {
        select: {
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              isPublished: true
            }
          }
        }
      }
    }
  });

  if (!lesson || !lesson.section.course.isPublished) {
    return res.status(404).json({
      ok: false,
      error: "Lesson not found"
    });
  }

  if (lesson.isPreview) {
    return res.status(200).json({
      ok: true,
      item: {
        lessonId: lesson.id,
        canAccess: true,
        reason: "preview_lesson",
        courseSlug: lesson.section.course.slug
      }
    });
  }

  const enrollment = await hasActiveEnrollment(user.id, lesson.section.course.id);
  const canAccess = Boolean(enrollment);

  return res.status(200).json({
    ok: true,
    item: {
      lessonId: lesson.id,
      canAccess,
      reason: canAccess ? "active_enrollment" : "no_active_enrollment",
      courseSlug: lesson.section.course.slug,
      expiresAt: enrollment?.expiresAt ?? null
    }
  });
});

