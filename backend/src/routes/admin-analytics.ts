import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader, requireRole, UserRole } from "../lib/auth.js";
import { EnrollmentStatus } from "@prisma/client";

export const adminAnalyticsRouter = Router();

adminAnalyticsRouter.get("/overview", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const admin = await requireRole(req, res, [UserRole.ADMIN]);
  if (!admin) return;

  try {
    const [totalUsers, totalEnrollments, totalRevenue, topCourses] = await Promise.all([
      prisma.user.count(),
      prisma.enrollment.count({ where: { status: EnrollmentStatus.ACTIVE } }),
      prisma.enrollment.aggregate({
        _sum: { amountPaid: true }
      }),
      prisma.course.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: {
          enrollments: { _count: "desc" }
        },
        take: 5
      })
    ]);

    // Fetch last 30 days of sales
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSales = await prisma.enrollment.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: EnrollmentStatus.ACTIVE
      },
      select: {
        id: true,
        amountPaid: true,
        createdAt: true,
        user: {
          select: { fullName: true, avatarUrl: true }
        },
        course: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    return res.status(200).json({
      ok: true,
      stats: {
        totalUsers,
        totalEnrollments,
        totalRevenue: (totalRevenue._sum.amountPaid || 0) / 100,
        topCourses: topCourses.map(c => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
          category: c.category,
          enrollments: c._count.enrollments
        }))
      },
      recentSales
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
