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
const ROADMAP_CONFIG = {
    dev: [
        { no: 1, courseSlugs: ["full-stack-development-accelerator"] },
        { no: 2, courseSlugs: ["react-nextjs-mastery-2026"] },
        { no: 3, courseSlugs: ["react-nextjs-mastery-2026"] }, // Stage 3 focus: Next.js focus
        { no: 4, courseSlugs: ["full-stack-development-accelerator"] }, // Stage 4 focus: Backend/Databases
        { no: 5, courseSlugs: ["system-design-for-frontend-engineers"] },
        { no: 6, courseSlugs: ["full-stack-development-accelerator"] }, // Stage 6 focus: Deployment
    ],
    design: [
        { no: 1, courseSlugs: ["complete-ui-ux-design-bootcamp"] },
        { no: 2, courseSlugs: ["complete-ui-ux-design-bootcamp"] },
        { no: 3, courseSlugs: ["ux-research-interview-lab"] },
        { no: 4, courseSlugs: ["mobile-app-design-with-figma"] },
        { no: 5, courseSlugs: ["advanced-motion-design-framer"] },
        { no: 6, courseSlugs: ["complete-ui-ux-design-bootcamp"] },
    ],
    ai: [
        { no: 1, courseSlugs: ["python-for-data-analysis"] },
        { no: 2, courseSlugs: ["ai-machine-learning-for-designers"] },
        { no: 3, courseSlugs: ["no-code-ai-automation"] },
        { no: 4, courseSlugs: ["ai-machine-learning-for-designers"] },
        { no: 5, courseSlugs: ["full-stack-development-accelerator"] },
    ],
    biz: [
        { no: 1, courseSlugs: ["product-management-fundamentals"] },
        { no: 2, courseSlugs: ["growth-marketing-playbook"] },
        { no: 3, courseSlugs: ["python-for-data-analysis"] },
        { no: 4, courseSlugs: ["product-management-fundamentals"] },
    ],
};
dashboardRouter.get("/roadmap", async (req, res) => {
    const user = await getUserFromHeader(req, res);
    if (!user)
        return;
    const pathId = req.query.pathId;
    if (!pathId || !ROADMAP_CONFIG[pathId]) {
        return res.status(400).json({ ok: false, error: "Invalid pathId" });
    }
    const stages = ROADMAP_CONFIG[pathId];
    const results = [];
    // Get all user enrollments for comparison
    const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id },
        select: {
            course: { select: { slug: true, id: true } },
            status: true
        }
    });
    const enrolledSlugs = new Set(enrollments.map(e => e.course.slug));
    const enrollmentMap = new Map(enrollments.map(e => [e.course.slug, e]));
    let previousStageDone = true;
    for (const stage of stages) {
        let status = "locked";
        let progressPercent = 0;
        const stageCourses = stage.courseSlugs;
        const isEnrolled = stageCourses.some(slug => enrolledSlugs.has(slug));
        if (isEnrolled) {
            // Check if all lessons in all courses for this stage are completed
            let allCompleted = true;
            let totalLessonsInStage = 0;
            let completedLessonsInStage = 0;
            for (const slug of stageCourses) {
                const enrollment = enrollmentMap.get(slug);
                if (!enrollment) {
                    allCompleted = false;
                    continue;
                }
                const course = await prisma.course.findUnique({
                    where: { slug },
                    include: {
                        sections: { include: { lessons: true } }
                    }
                });
                if (!course)
                    continue;
                const lessons = course.sections.flatMap(s => s.lessons);
                totalLessonsInStage += lessons.length;
                const progress = await prisma.progress.findMany({
                    where: {
                        userId: user.id,
                        lessonId: { in: lessons.map(l => l.id) },
                        isCompleted: true
                    }
                });
                completedLessonsInStage += progress.length;
                if (progress.length < lessons.length) {
                    allCompleted = false;
                }
            }
            progressPercent = totalLessonsInStage > 0 ? Math.round((completedLessonsInStage / totalLessonsInStage) * 100) : 0;
            if (allCompleted && totalLessonsInStage > 0) {
                status = "done";
            }
            else {
                status = "current";
            }
        }
        else {
            // Not enrolled
            if (previousStageDone) {
                // We could mark it as 'unlockable' if we wanted, but for now 'locked'
                status = "locked";
            }
            else {
                status = "locked";
            }
        }
        results.push({
            no: stage.no,
            status,
            progressPercent
        });
        previousStageDone = status === "done";
    }
    return res.status(200).json({
        ok: true,
        pathId,
        stages: results
    });
});
dashboardRouter.get("/stats", async (req, res) => {
    const user = await getUserFromHeader(req, res);
    if (!user)
        return;
    try {
        const [enrollments, certificates, progress] = await Promise.all([
            prisma.enrollment.findMany({
                where: { userId: user.id },
                select: { status: true, courseId: true }
            }),
            prisma.certificate.count({
                where: { userId: user.id }
            }),
            prisma.progress.findMany({
                where: { userId: user.id, isCompleted: true },
                orderBy: { completedAt: "desc" },
                take: 1
            })
        ]);
        const activeEnrollments = enrollments.filter(e => e.status === EnrollmentStatus.ACTIVE);
        return res.status(200).json({
            ok: true,
            stats: {
                xp: user.xp,
                streak: user.streakCount,
                certificates,
                activeCourses: activeEnrollments.length,
                lastActivity: user.lastActivityAt
            }
        });
    }
    catch (err) {
        console.error("Dashboard stats error:", err);
        return res.status(500).json({ ok: false, error: "Internal server error" });
    }
});
