import { EnrollmentStatus } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { getUserFromHeader } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

export const progressRouter = Router();

const lessonParamsSchema = z.object({
  lessonId: z.string().min(1)
});

const courseSlugParamsSchema = z.object({
  slug: z.string().min(1)
});

const markLessonBodySchema = z.object({
  isCompleted: z.boolean().optional()
});

async function hasActiveEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findFirst({
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
}

// PATCH /progress/lessons/:lessonId/watch - Sync current playhead
progressRouter.patch("/lessons/:lessonId/watch", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const params = lessonParamsSchema.safeParse(req.params);
  if (!params.success) return res.status(400).json({ ok: false, error: "Invalid lesson id" });

  const body = z.object({ seconds: z.number().int().min(0) }).safeParse(req.body);
  if (!body.success) return res.status(400).json({ ok: false, error: "Invalid watch time" });

  const progress = await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: params.data.lessonId
      }
    },
    create: {
      userId: user.id,
      lessonId: params.data.lessonId,
      lastPlayedSeconds: body.data.seconds
    },
    update: {
      lastPlayedSeconds: body.data.seconds
    }
  });

  return res.status(200).json({ ok: true, item: progress });
});

progressRouter.post("/lessons/:lessonId", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const params = lessonParamsSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ ok: false, error: "Invalid lesson id" });
  }

  const body = markLessonBodySchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ ok: false, error: "Invalid body payload" });
  }

  const isCompleted = body.data.isCompleted ?? true;

  const progress = await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: params.data.lessonId
      }
    },
    create: {
      userId: user.id,
      lessonId: params.data.lessonId,
      isCompleted,
      completedAt: isCompleted ? new Date() : null
    },
    update: {
      isCompleted,
      completedAt: isCompleted ? new Date() : null
    },
    select: {
      lessonId: true,
      isCompleted: true,
      completedAt: true,
      lesson: {
        select: {
          section: {
            select: {
              courseId: true
            }
          }
        }
      }
    }
  });

  // Check for course completion
  if (isCompleted) {
    const courseId = progress.lesson.section.courseId;
    const allCourseLessons = await prisma.lesson.findMany({
      where: { section: { courseId } },
      select: { id: true }
    });
    const completedCount = await prisma.progress.count({
      where: {
        userId: user.id,
        lessonId: { in: allCourseLessons.map(l => l.id) },
        isCompleted: true
      }
    });

    if (completedCount === allCourseLessons.length) {
      // 100% Complete! Issue certificate.
      await prisma.certificate.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId
          }
        },
        create: {
          userId: user.id,
          courseId: courseId
        },
        update: {} // already exists, just keep it
      });
    }

    // Award 50 XP for completing a lesson
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 50 } }
    });
  }

  return res.status(200).json({ 
    ok: true, 
    item: progress,
    xpAwarded: isCompleted ? 50 : 0
  });
});

progressRouter.get("/courses/:slug", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const params = courseSlugParamsSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ ok: false, error: "Invalid course slug" });
  }

  const course = await prisma.course.findFirst({
    where: {
      slug: params.data.slug,
      isPublished: true
    },
    select: {
      id: true,
      slug: true,
      sections: {
        select: {
          lessons: {
            select: {
              id: true,
              isPreview: true
            }
          }
        }
      }
    }
  });

  if (!course) {
    return res.status(404).json({ ok: false, error: "Course not found" });
  }

  const activeEnrollment = await hasActiveEnrollment(user.id, course.id);
  const allLessons = course.sections.flatMap((s) => s.lessons);
  const trackableLessons = activeEnrollment
    ? allLessons
    : allLessons.filter((l) => l.isPreview);

  const lessonIds = trackableLessons.map((l) => l.id);

  if (lessonIds.length === 0) {
    return res.status(200).json({
      ok: true,
      item: {
        courseSlug: course.slug,
        completedLessons: 0,
        totalLessons: 0,
        progressPercent: 0,
        hasActiveEnrollment: Boolean(activeEnrollment)
      }
    });
  }

  const completedLessons = await prisma.progress.findMany({
    where: {
      userId: user.id,
      lessonId: { in: lessonIds },
      isCompleted: true
    },
    select: { lessonId: true }
  });

  const totalLessons = lessonIds.length;
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  return res.status(200).json({
    ok: true,
    item: {
      courseSlug: course.slug,
      completedLessons: completedLessons.length,
      completedLessonIds: completedLessons.map(cl => cl.lessonId),
      totalLessons,
      progressPercent,
      hasActiveEnrollment: Boolean(activeEnrollment)
    }
  });
});

progressRouter.get("/courses/:slug/continue", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const params = courseSlugParamsSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ ok: false, error: "Invalid course slug" });
  }

  const course = await prisma.course.findFirst({
    where: {
      slug: params.data.slug,
      isPublished: true
    },
    select: {
      id: true,
      slug: true,
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
              position: true,
              isPreview: true
            }
          }
        }
      }
    }
  });

  if (!course) {
    return res.status(404).json({ ok: false, error: "Course not found" });
  }

  const activeEnrollment = await hasActiveEnrollment(user.id, course.id);
  const orderedLessons = course.sections.flatMap((section) =>
    section.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      position: lesson.position,
      isPreview: lesson.isPreview,
      sectionTitle: section.title
    }))
  );

  const allowedLessons = activeEnrollment
    ? orderedLessons
    : orderedLessons.filter((l) => l.isPreview);

  if (allowedLessons.length === 0) {
    return res.status(200).json({
      ok: true,
      item: {
        courseSlug: course.slug,
        nextLesson: null,
        hasActiveEnrollment: Boolean(activeEnrollment)
      }
    });
  }

  const progress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      lessonId: { in: allowedLessons.map((l) => l.id) }
    },
    select: {
      lessonId: true,
      isCompleted: true,
      lastPlayedSeconds: true
    }
  });

  const progressMap = new Map(progress.map(p => [p.lessonId, p]));

  const nextLessonCandidate =
    allowedLessons.find((lesson) => !progressMap.get(lesson.id)?.isCompleted) ??
    allowedLessons[allowedLessons.length - 1];

  const lastPlayedSeconds = progressMap.get(nextLessonCandidate?.id)?.lastPlayedSeconds ?? 0;

  return res.status(200).json({
    ok: true,
    item: {
      courseSlug: course.slug,
      nextLesson: nextLessonCandidate ? {
        ...nextLessonCandidate,
        lastPlayedSeconds
      } : null,
      hasActiveEnrollment: Boolean(activeEnrollment)
    }
  });
});

