import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";

export const recommendationsRouter = Router();

recommendationsRouter.get("/", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  try {
    // 1. Get user's current enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      select: { courseId: true, course: { select: { category: true } } }
    });

    const enrolledCourseIds = enrollments.map(e => e.courseId);
    const userCategories = [...new Set(enrollments.map(e => e.course.category).filter(Boolean))];

    // 2. Find courses in these categories that user hasn't enrolled in
    let recommendations = await prisma.course.findMany({
      where: {
        id: { notIn: enrolledCourseIds },
        category: { in: userCategories as string[] },
        isPublished: true
      },
      select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          imageUrl: true,
          level: true,
          isFree: true
      },
      take: 4
    });

    // 3. Fallback: If not enough, get highest rated/popular courses
    if (recommendations.length < 4) {
        const moreCourses = await prisma.course.findMany({
            where: {
                id: { notIn: [...enrolledCourseIds, ...recommendations.map(r => r.id)] },
                isPublished: true
            },
             select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                imageUrl: true,
                level: true,
                isFree: true
            },
            take: 4 - recommendations.length
        });
        recommendations = [...recommendations, ...moreCourses];
    }

    return res.status(200).json({
      ok: true,
      recommendations
    });
  } catch (err) {
    console.error("Recommendations error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
