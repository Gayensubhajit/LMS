import { EnrollmentStatus, PlanDuration } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";

export const enrollmentsRouter = Router();

const createEnrollmentSchema = z.object({
  courseSlug: z.string().min(1),
  plan: z.enum(["1month", "3month", "6month"]).optional()
});

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function planToEnumAndMonths(plan: "1month" | "3month" | "6month" | undefined, isFree: boolean) {
  if (isFree) {
    return { planEnum: PlanDuration.ONE_MONTH, months: 12 }; // Free courses get 1 year for now
  }
  if (plan === "3month") {
    return { planEnum: PlanDuration.THREE_MONTH, months: 3 };
  }
  if (plan === "6month") {
    return { planEnum: PlanDuration.SIX_MONTH, months: 6 };
  }
  return { planEnum: PlanDuration.ONE_MONTH, months: 1 };
}

function getAmountForPlan(plan: "1month" | "3month" | "6month" | undefined, isFree: boolean, prices: {
  oneMonthPrice: number;
  threeMonthPrice: number;
  sixMonthPrice: number;
}) {
  if (isFree) return 0;
  if (plan === "3month") return prices.threeMonthPrice;
  if (plan === "6month") return prices.sixMonthPrice;
  return prices.oneMonthPrice;
}

enrollmentsRouter.post("/", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = createEnrollmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid request payload"
    });
  }

  const { courseSlug, plan } = parsed.data;

  const course = await prisma.course.findFirst({
    where: {
      slug: courseSlug,
      isPublished: true
    },
    select: {
      id: true,
      slug: true,
      title: true,
      isFree: true,
      oneMonthPrice: true,
      threeMonthPrice: true,
      sixMonthPrice: true
    }
  });

  if (!course) {
    return res.status(404).json({
      ok: false,
      error: "Published course not found"
    });
  }

  const { planEnum, months } = planToEnumAndMonths(plan, course.isFree);
  const startsAt = new Date();
  const expiresAt = addMonths(startsAt, months);
  const amountPaid = getAmountForPlan(plan, course.isFree, course);

  const status = course.isFree ? EnrollmentStatus.ACTIVE : EnrollmentStatus.PENDING;

  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id
      }
    },
    create: {
      userId: user.id,
      courseId: course.id,
      plan: planEnum,
      amountPaid,
      status,
      startsAt,
      expiresAt
    },
    update: {
      plan: planEnum,
      amountPaid,
      status,
      startsAt,
      expiresAt
    },
    select: {
      id: true,
      plan: true,
      amountPaid: true,
      status: true,
      startsAt: true,
      expiresAt: true
    }
  });

  return res.status(200).json({
    ok: true,
    item: {
      ...enrollment,
      course: {
        slug: course.slug,
        title: course.title
      }
    }
  });
});

enrollmentsRouter.get("/me", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.id
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      plan: true,
      amountPaid: true,
      status: true,
      startsAt: true,
      expiresAt: true,
      course: {
        select: {
          slug: true,
          title: true,
          category: true
        }
      }
    }
  });

  return res.status(200).json({
    ok: true,
    count: enrollments.length,
    items: enrollments
  });
});

enrollmentsRouter.get("/check/:slug", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return res.status(401).json({ ok: false, enrolled: false });

  const { slug } = req.params;

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      course: { slug },
      status: EnrollmentStatus.ACTIVE
    }
  });

  return res.status(200).json({
    ok: true,
    enrolled: !!enrollment
  });
});

enrollmentsRouter.delete("/:id", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const { id } = req.params;

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!enrollment) {
      return res.status(404).json({ ok: false, error: "Enrollment not found" });
    }

    if (enrollment.userId !== user.id) {
      return res.status(403).json({ ok: false, error: "Unauthorized" });
    }

    await prisma.enrollment.delete({
      where: { id },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});


