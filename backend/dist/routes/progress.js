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
async function hasActiveEnrollment(userId, courseId) {
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
progressRouter.post("/lessons/:lessonId", async (req, res) => {
    const user = await getUserFromHeader(req, res);
    if (!user)
        return;
    const params = lessonParamsSchema.safeParse(req.params);
    if (!params.success) {
        return res.status(400).json({ ok: false, error: "Invalid lesson id" });
    }
    const body = markLessonBodySchema.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({ ok: false, error: "Invalid body payload" });
    }
    const lesson = await prisma.lesson.findUnique({
        where: { id: params.data.lessonId },
        select: {
            id: true,
            isPreview: true,
            section: {
                select: {
                    course: {
                        select: {
                            id: true,
                            slug: true,
                            isPublished: true
                        }
                    }
                }
            }
        }
    });
    if (!lesson || !lesson.section.course.isPublished) {
        return res.status(404).json({ ok: false, error: "Lesson not found" });
    }
    const enrollment = lesson.isPreview
        ? null
        : await hasActiveEnrollment(user.id, lesson.section.course.id);
    if (!lesson.isPreview && !enrollment) {
        return res.status(403).json({
            ok: false,
            error: "No active enrollment for this lesson"
        });
    }
    const isCompleted = body.data.isCompleted ?? true;
    const progress = await prisma.progress.upsert({
        where: {
            userId_lessonId: {
                userId: user.id,
                lessonId: lesson.id
            }
        },
        create: {
            userId: user.id,
            lessonId: lesson.id,
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
            completedAt: true
        }
    });
    return res.status(200).json({
        ok: true,
        item: {
            ...progress,
            courseSlug: lesson.section.course.slug
        }
    });
});
progressRouter.get("/courses/:slug", async (req, res) => {
    const user = await getUserFromHeader(req, res);
    if (!user)
        return;
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
    const completedCount = await prisma.progress.count({
        where: {
            userId: user.id,
            lessonId: { in: lessonIds },
            isCompleted: true
        }
    });
    const totalLessons = lessonIds.length;
    const progressPercent = Math.round((completedCount / totalLessons) * 100);
    return res.status(200).json({
        ok: true,
        item: {
            courseSlug: course.slug,
            completedLessons: completedCount,
            totalLessons,
            progressPercent,
            hasActiveEnrollment: Boolean(activeEnrollment)
        }
    });
});
progressRouter.get("/courses/:slug/continue", async (req, res) => {
    const user = await getUserFromHeader(req, res);
    if (!user)
        return;
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
    const orderedLessons = course.sections.flatMap((section) => section.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        position: lesson.position,
        isPreview: lesson.isPreview,
        sectionTitle: section.title
    })));
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
            isCompleted: true
        }
    });
    const completedSet = new Set(progress.filter((p) => p.isCompleted).map((p) => p.lessonId));
    const nextLesson = allowedLessons.find((lesson) => !completedSet.has(lesson.id)) ??
        allowedLessons[allowedLessons.length - 1];
    return res.status(200).json({
        ok: true,
        item: {
            courseSlug: course.slug,
            nextLesson,
            hasActiveEnrollment: Boolean(activeEnrollment)
        }
    });
});
