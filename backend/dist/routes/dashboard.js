import { EnrollmentStatus } from "@prisma/client";
import { Router } from "express";
import { getUserFromHeader } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
export const dashboardRouter = Router();
function getNextLesson(lessons, completedSet) {
    return lessons.find((lesson) => !completedSet.has(lesson.id)) ?? lessons[lessons.length - 1] ?? null;
}
dashboardRouter.get("/my-courses", async (req, res) => {
    const user = await getUserFromHeader(req, res);
    if (!user)
        return;
    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId: user.id,
            status: EnrollmentStatus.ACTIVE
        },
        orderBy: { updatedAt: "desc" },
        select: {
            id: true,
            plan: true,
            amountPaid: true,
            startsAt: true,
            expiresAt: true,
            course: {
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    category: true,
                    previewVideoUrl: true,
                    sections: {
                        orderBy: { position: "asc" },
                        select: {
                            title: true,
                            lessons: {
                                orderBy: { position: "asc" },
                                select: {
                                    id: true,
                                    title: true,
                                    isPreview: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    const items = await Promise.all(enrollments.map(async (enrollment) => {
        const lessons = enrollment.course.sections.flatMap((section) => section.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            isPreview: lesson.isPreview,
            sectionTitle: section.title
        })));
        const lessonIds = lessons.map((lesson) => lesson.id);
        const progress = await prisma.progress.findMany({
            where: {
                userId: user.id,
                lessonId: { in: lessonIds }
            },
            select: {
                lessonId: true,
                isCompleted: true
            }
        });
        const completedSet = new Set(progress.filter((p) => p.isCompleted).map((p) => p.lessonId));
        const totalLessons = lessonIds.length;
        const completedLessons = completedSet.size;
        const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        const nextLesson = getNextLesson(lessons, completedSet);
        return {
            enrollmentId: enrollment.id,
            plan: enrollment.plan,
            amountPaid: enrollment.amountPaid,
            startsAt: enrollment.startsAt,
            expiresAt: enrollment.expiresAt,
            course: {
                slug: enrollment.course.slug,
                title: enrollment.course.title,
                category: enrollment.course.category,
                previewVideoUrl: enrollment.course.previewVideoUrl
            },
            progress: {
                completedLessons,
                totalLessons,
                progressPercent,
                nextLesson
            }
        };
    }));
    return res.status(200).json({
        ok: true,
        count: items.length,
        items
    });
});
dashboardRouter.get("/overview", async (req, res) => {
    const user = await getUserFromHeader(req, res);
    if (!user)
        return;
    const activeEnrollmentCount = await prisma.enrollment.count({
        where: {
            userId: user.id,
            status: EnrollmentStatus.ACTIVE,
            expiresAt: { gt: new Date() }
        }
    });
    const completedLessons = await prisma.progress.count({
        where: {
            userId: user.id,
            isCompleted: true
        }
    });
    const nextExpiringEnrollment = await prisma.enrollment.findFirst({
        where: {
            userId: user.id,
            status: EnrollmentStatus.ACTIVE,
            expiresAt: { gt: new Date() }
        },
        orderBy: { expiresAt: "asc" },
        select: {
            expiresAt: true,
            course: { select: { slug: true, title: true } }
        }
    });
    return res.status(200).json({
        ok: true,
        item: {
            activeEnrollmentCount,
            completedLessons,
            nextExpiringEnrollment
        }
    });
});
