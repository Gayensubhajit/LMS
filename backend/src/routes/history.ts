import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";

export const historyRouter = Router();

const historyPostSchema = z.object({
  courseSlug: z.string().min(1),
});

// POST /history
// Upsert a recent view record for the authenticated user
historyRouter.post("/", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = historyPostSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid courseSlug" });
  }

  const { courseSlug } = parsed.data;

  try {
    // Find the course first to get its ID
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true }
    });

    if (!course) {
      return res.status(404).json({ ok: false, error: "Course not found" });
    }

    const recentView = await prisma.recentView.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      update: {
        lastViewedAt: new Date(),
      },
      create: {
        userId: user.id,
        courseId: course.id,
      },
    });

    return res.status(200).json({ ok: true, item: recentView });
  } catch (err) {
    console.error("Failed to sync history:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// GET /history
// Fetch the top 4 most recently viewed courses for the authenticated user
historyRouter.get("/", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  try {
    const history = await prisma.recentView.findMany({
      where: { userId: user.id },
      orderBy: { lastViewedAt: "desc" },
      take: 4,
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            shortDescription: true,
            category: true,
            level: true,
            instructorName: true,
          },
        },
      },
    });

    return res.status(200).json({
      ok: true,
      items: history.map((h) => h.course),
    });
  } catch (err) {
    console.error("Failed to fetch history:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
