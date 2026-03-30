import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { handleClerkWebhook } from "./routes/clerk-webhook.js";
import { coursesRouter } from "./routes/courses.js";
import { enrollmentsRouter } from "./routes/enrollments.js";
import { accessRouter } from "./routes/access.js";
import {
  handleRazorpayWebhook,
  handleStripeWebhook,
  paymentsRouter,
} from "./routes/payments.js";
import { progressRouter } from "./routes/progress.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { historyRouter } from "./routes/history.js";
import { accomplishmentsRouter } from "./routes/accomplishments.js";
import settingsRouter from "./routes/settings.js";
import { adminRouter } from "./routes/admin.js";
import { CourseLevel } from "@prisma/client";
import { execSync } from "child_process";
import { prisma } from "./lib/prisma.js";
import { usersRouter } from "./routes/users.js";

async function autoSeed() {
  console.log("Starting self-healing database sync...");
  try {
    // Force push the schema to ensure tables exist
    console.log("Executing prisma db push...");
    // Use a short timeout and pipe output to avoid hanging
    execSync("npx prisma db push --accept-data-loss", { 
      stdio: "pipe",
      timeout: 30000 // 30s timeout
    });
    console.log("Database schema synced successfully.");
  } catch (err) {
    console.warn("Prisma db push encountered an issue (it might already be synced):", err instanceof Error ? err.message : String(err));
  }

  try {
    const count = await prisma.course.count();
    if (count > 0) {
      console.log("Database already has courses. Skipping seed.");
      return;
    }
  } catch (err) {
    console.error("Could not count courses. Database might not be ready yet.", err);
    return;
  }

  console.log("Seeding initial courses into the database...");
  const courses = [
    {
      slug: "complete-ui-ux-design-bootcamp",
      title: "Complete UI/UX Design Bootcamp",
      shortDescription: "Master the art of designing beautiful and functional user interfaces.",
      longDescription: "Compelling design bootcamp...",
      category: "Design",
      level: CourseLevel.BEGINNER,
      instructorName: "Jessica Willis",
      oneMonthPrice: 999,
      threeMonthPrice: 2499,
      sixMonthPrice: 4499,
      isFree: false,
      isPublished: true,
    },
    {
      slug: "react-nextjs-mastery-2026",
      title: "React & Next.js Mastery 2026",
      shortDescription: "Build production-ready full-stack applications with the latest Next.js features.",
      longDescription: "Deep dive into App Router...",
      category: "Development",
      level: CourseLevel.INTERMEDIATE,
      instructorName: "Alex Chen",
      oneMonthPrice: 1499,
      threeMonthPrice: 3999,
      sixMonthPrice: 6999,
      isFree: false,
      isPublished: true,
    },
    {
      slug: "frontend-fundamentals-free",
      title: "Frontend Fundamentals (Free)",
      shortDescription: "Learn HTML, CSS & JavaScript from scratch.",
      longDescription: "Solid foundation...",
      category: "Development",
      level: CourseLevel.BEGINNER,
      instructorName: "Alex Chen",
      oneMonthPrice: 0,
      threeMonthPrice: 0,
      sixMonthPrice: 0,
      isFree: true,
      isPublished: true,
    },
    {
      slug: "backend-basics-free",
      title: "Backend Basics with Node.js (Free)",
      shortDescription: "Build REST APIs with Node.js and Express.",
      longDescription: "Understand the server side...",
      category: "Development",
      level: CourseLevel.BEGINNER,
      instructorName: "Ryan Torres",
      oneMonthPrice: 0,
      threeMonthPrice: 0,
      sixMonthPrice: 0,
      isFree: true,
      isPublished: true,
    },
    {
      slug: "gen-ai-essentials-free",
      title: "Generative AI Essentials (Free)",
      shortDescription: "Understand LLMs, prompt engineering & AI tools.",
      longDescription: "Demystify generative AI...",
      category: "AI/ML",
      level: CourseLevel.ALL_LEVELS,
      instructorName: "Dr. Sarah Park",
      oneMonthPrice: 0,
      threeMonthPrice: 0,
      sixMonthPrice: 0,
      isFree: true,
      isPublished: true,
    }
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  // Create a sample certificate if a user exists
  const firstUser = await prisma.user.findFirst();
  if (firstUser) {
    const firstCourse = await prisma.course.findFirst();
    if (firstCourse) {
      await prisma.certificate.upsert({
        where: {
          userId_courseId: {
            userId: firstUser.id,
            courseId: firstCourse.id,
          },
        },
        update: {},
        create: {
          userId: firstUser.id,
          courseId: firstCourse.id,
          issuedAt: new Date(),
        },
      });
      console.log("Seeded a sample certificate for the first user.");
    }
  }

  console.log("Auto-seed complete.");
}

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));

// Clerk requires raw body for Svix signature verification.
app.post(
  "/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook,
);
app.post(
  "/payments/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  handleRazorpayWebhook,
);
app.post(
  "/payments/webhooks/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "lms-backend",
    env: env.NODE_ENV,
  });
});

app.use("/courses", coursesRouter);
app.use("/enrollments", enrollmentsRouter);
app.use("/access", accessRouter);
app.use("/payments", paymentsRouter);
app.use("/progress", progressRouter);
app.use("/dashboard", dashboardRouter);
app.use("/users", usersRouter);
app.use("/history", historyRouter);
app.use("/accomplishments", accomplishmentsRouter);
app.use("/settings", settingsRouter);
app.use("/admin", adminRouter);

autoSeed().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
  });
}).catch(err => {
  console.error("Auto-seed failed, starting anyway:", err);
  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
  });
});
