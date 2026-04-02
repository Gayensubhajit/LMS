import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireRole, UserRole } from "../lib/auth.js";

export const adminRouter = Router();

const courseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  category: z.string().min(1),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
  instructorName: z.string().min(1),
  oneMonthPrice: z.number().min(0),
  threeMonthPrice: z.number().min(0),
  sixMonthPrice: z.number().min(0),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

const sectionSchema = z.object({
  title: z.string().min(1),
  position: z.number().int().min(0),
});

const lessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  position: z.number().int().min(0),
  isPreview: z.boolean().default(false),
});

// GET /admin/courses - List all courses (for instructors/admins)
adminRouter.get("/courses", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { sections: true } }
    }
  });

  return res.status(200).json({ ok: true, items: courses });
});

// POST /admin/courses - Create new course
adminRouter.post("/courses", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.errors });
  }

  try {
    const course = await prisma.course.create({ data: parsed.data });
    return res.status(201).json({ ok: true, item: course });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Failed to create course. Slug might already exist." });
  }
});

// PATCH /admin/courses/:id - Update course
adminRouter.patch("/courses/:id", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const { id } = req.params;
  const parsed = courseSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.errors });
  }

  const updated = await prisma.course.update({
    where: { id },
    data: parsed.data
  });

  return res.status(200).json({ ok: true, item: updated });
});

// GET /admin/courses/:id/curriculum - Get segments
adminRouter.get("/courses/:id/curriculum", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const { id } = req.params;
  const sections = await prisma.courseSection.findMany({
    where: { courseId: id },
    orderBy: { position: "asc" },
    include: {
      lessons: { orderBy: { position: "asc" } }
    }
  });

  return res.status(200).json({ ok: true, items: sections });
});

// POST /admin/courses/:id/sections - Add section
adminRouter.post("/courses/:id/sections", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const { id } = req.params;
  const parsed = sectionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.errors });

  const section = await prisma.courseSection.create({
    data: { ...parsed.data, courseId: id }
  });

  return res.status(201).json({ ok: true, item: section });
});

// POST /admin/sections/:id/lessons - Add lesson
adminRouter.post("/sections/:id/lessons", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const { id } = req.params;
  const parsed = lessonSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.errors });

  const lesson = await prisma.lesson.create({
    data: { ...parsed.data, sectionId: id }
  });

  return res.status(201).json({ ok: true, item: lesson });
});

// PATCH /admin/sections/:id - Update section
adminRouter.patch("/sections/:id", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const { id } = req.params;
  const parsed = sectionSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.errors });

  const updated = await prisma.courseSection.update({
    where: { id },
    data: parsed.data
  });

  return res.status(200).json({ ok: true, item: updated });
});

// DELETE /admin/sections/:id - Delete section
adminRouter.delete("/sections/:id", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const { id } = req.params;
  await prisma.courseSection.delete({ where: { id } });

  return res.status(200).json({ ok: true, message: "Section deleted" });
});

// PATCH /admin/lessons/:id - Update lesson
adminRouter.patch("/lessons/:id", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const { id } = req.params;
  const parsed = lessonSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.errors });

  const updated = await prisma.lesson.update({
    where: { id },
    data: parsed.data
  });

  return res.status(200).json({ ok: true, item: updated });
});

// DELETE /admin/lessons/:id - Delete lesson
adminRouter.delete("/lessons/:id", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN, UserRole.INSTRUCTOR]);
  if (!user) return;

  const { id } = req.params;
  await prisma.lesson.delete({ where: { id } });

  return res.status(200).json({ ok: true, message: "Lesson deleted" });
});

// GET /admin/users - List all users (protected: Admin ONLY)
adminRouter.get("/users", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN]);
  if (!user) return;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true } }
    }
  });

  return res.status(200).json({ ok: true, items: users });
});

// PATCH /admin/users/:id/role - Update a user's role (protected: Admin ONLY)
adminRouter.patch("/users/:id/role", async (req, res) => {
  const user = await requireRole(req, res, [UserRole.ADMIN]);
  if (!user) return;

  const { id } = req.params;
  const { role } = req.body;

  if (!Object.values(UserRole).includes(role)) {
    return res.status(400).json({ ok: false, error: "Invalid role" });
  }

  // Role hierarchy logic
  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) return res.status(404).json({ ok: false, error: "Target user not found" });

  // 1. Only SUPER_ADMIN can create another SUPER_ADMIN
  if (role === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
    return res.status(403).json({ ok: false, error: "Only Super Admins can assign Super Admin role" });
  }

  // 2. Regular ADMIN cannot modify a SUPER_ADMIN
  if (targetUser.role === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
    return res.status(403).json({ ok: false, error: "Admins cannot modify Super Admins" });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role }
  });

  return res.status(200).json({ ok: true, item: updated });
});
