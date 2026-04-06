import { EnrollmentStatus, PlanDuration } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";

export const enrollmentsRouter = Router();

const createEnrollmentSchema = z.object({
  courseSlug: z.string().min(1),
  plan: z.enum(["1month", "3month", "6month", "plus", "annual", "teams"]).optional()
});

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function planToEnumAndMonths(plan: string | undefined, isFree: boolean) {
  if (isFree) {
    return { planEnum: PlanDuration.ONE_MONTH, months: 12 };
  }
  if (plan === "plus" || plan === "teams" || plan === "teams-pro") return { planEnum: PlanDuration.ONE_MONTH, months: 1 };
  if (plan === "3month") return { planEnum: PlanDuration.THREE_MONTH, months: 3 };
  if (plan === "6month" || plan === "annual") return { planEnum: PlanDuration.SIX_MONTH, months: (plan === "annual" ? 12 : 6) };
  return { planEnum: PlanDuration.ONE_MONTH, months: 1 };
}

function getAmountForPlan(plan: string | undefined, isFree: boolean, prices: any) {
  if (isFree) return 0;
  
  // Specific Subscription Tier logic (converted to USD for backend calculation)
  // These USD values will be multiplied by 94 in payments.ts to get the exact INR
  if (plan === "plus") return 22.33;       // ₹2,099 / 94
  if (plan === "annual") return 212.75;    // ₹19,999 / 94
  if (plan === "teams") return 21.27;      // ₹1,999 / 94
  if (plan === "teams-pro") return 15.95;  // ₹1,499 / 94

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

  // 2. FIND OR AUTO-CREATE THE COURSE RECORD
  let course = await prisma.course.findUnique({
    where: { slug: courseSlug }
  });

  if (!course) {
    console.log(`[Enrollments] Course ${courseSlug} not in DB. Auto-creating from request...`);
    // Create a simplified placeholder from the slug to allow enrollment to proceed without 404
    const humanTitle = courseSlug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    course = await prisma.course.create({
      data: {
        slug: courseSlug,
        title: humanTitle,
        shortDescription: "Enrollment initialized via Plus/Purchase flow.",
        longDescription: "Detailed content available in the learning dashboard.",
        category: "Development",
        instructorName: "EduNova Instructor",
        oneMonthPrice: 9.99, // default placeholder
        threeMonthPrice: 24.99,
        sixMonthPrice: 44.99,
        isPublished: true,
        // If it was a free course, mark it as such (based on typical naming if no plan passed)
        isFree: courseSlug.includes("-free")
      }
    });
  }

  // GLOBAL ACCESS CHECK: If user has a Plus Membership, they can enroll for FREE
  const activeMembership = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      course: { slug: "plus-membership" },
      status: EnrollmentStatus.ACTIVE,
      expiresAt: { gt: new Date() }
    },
    select: { expiresAt: true }
  });

  const { planEnum, months } = planToEnumAndMonths(plan, course.isFree);
  const startsAt = new Date();
  const expiresAt = activeMembership ? activeMembership.expiresAt : addMonths(startsAt, months);
  const amountPaid = activeMembership && courseSlug !== "plus-membership" ? 0 : getAmountForPlan(plan, course.isFree, course);

  // If they have a membership, the enrollment is ACTIVE immediately
  const status = (course.isFree || (activeMembership && courseSlug !== "plus-membership")) 
    ? EnrollmentStatus.ACTIVE 
    : EnrollmentStatus.PENDING;

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

  // 1. Check direct enrollment
  const directEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      course: { slug },
      expiresAt: { gt: new Date() }
    },
    select: { status: true }
  });

  // 2. Check for global Plus Membership
  const plusMembership = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      course: { slug: "plus-membership" },
      expiresAt: { gt: new Date() }
    },
    select: { status: true }
  });

  const isActiveDirect = directEnrollment?.status === EnrollmentStatus.ACTIVE;
  const isActivePlus = plusMembership?.status === EnrollmentStatus.ACTIVE;
  const isPendingPlus = plusMembership?.status === EnrollmentStatus.PENDING;
  const isPendingDirect = directEnrollment?.status === EnrollmentStatus.PENDING;

  return res.status(200).json({
    ok: true,
    enrolled: isActiveDirect || (isActivePlus && slug !== "plus-membership"),
    isDirectEnrolled: isActiveDirect,
    isPlusMember: isActivePlus,
    isPendingPlus: isPendingPlus || (isPendingDirect && slug === "plus-membership"),
    isPendingDirect: isPendingDirect && slug !== "plus-membership"
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


