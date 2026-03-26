import { PrismaClient, CourseLevel, PlanDuration } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Sample Courses
  const course1 = await prisma.course.upsert({
    where: { slug: "complete-ui-ux-design-bootcamp" },
    update: { isFree: false },
    create: {
      slug: "complete-ui-ux-design-bootcamp",
      title: "Complete UI/UX Design Bootcamp",
      shortDescription: "Master the art of designing beautiful and functional user interfaces.",
      longDescription: "This comprehensive bootcamp covers everything from design principles and wireframing to high-fidelity prototyping using Figma and Adobe XD. Perfect for beginners and those looking to switch careers into design.",
      category: "Design",
      level: CourseLevel.BEGINNER,
      instructorName: "Jessica Willis",
      oneMonthPrice: 999,
      threeMonthPrice: 2499,
      sixMonthPrice: 4499,
      isFree: false,
      isPublished: true,
      sections: {
        create: [
          {
            title: "Introduction to UI Design",
            position: 1,
            lessons: {
              create: [
                {
                  title: "What is UI Design?",
                  description: "Learn the fundamentals of user interface design and why it matters.",
                  durationMins: 10,
                  position: 1,
                  isPreview: true,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: "react-nextjs-mastery-2026" },
    update: { isFree: false },
    create: {
      slug: "react-nextjs-mastery-2026",
      title: "React & Next.js Mastery 2026",
      shortDescription: "Build production-ready full-stack applications with the latest Next.js features.",
      longDescription: "Deep dive into App Router, Server Components, Server Actions, and advanced patterns. Learn how to build scalable, high-performance web applications with ease.",
      category: "Development",
      level: CourseLevel.INTERMEDIATE,
      instructorName: "Alex Chen",
      oneMonthPrice: 1499,
      threeMonthPrice: 3999,
      sixMonthPrice: 6999,
      isFree: false,
      isPublished: true,
    },
  });

  // FREE COURSES
  await prisma.course.upsert({
    where: { slug: "frontend-fundamentals-free" },
    update: { isFree: true },
    create: {
      slug: "frontend-fundamentals-free",
      title: "Frontend Fundamentals (Free)",
      shortDescription: "Learn HTML, CSS & JavaScript from scratch. Completely free.",
      longDescription: "Build a solid foundation with semantic HTML5, modern CSS layouts (Flexbox, Grid), and JavaScript ES6+.",
      category: "Development",
      level: CourseLevel.BEGINNER,
      instructorName: "Alex Chen",
      oneMonthPrice: 0,
      threeMonthPrice: 0,
      sixMonthPrice: 0,
      isFree: true,
      isPublished: true,
    },
  });

  await prisma.course.upsert({
    where: { slug: "backend-basics-free" },
    update: { isFree: true },
    create: {
      slug: "backend-basics-free",
      title: "Backend Basics with Node.js (Free)",
      shortDescription: "Build REST APIs with Node.js and Express. No cost, no catch.",
      longDescription: "Understand the server side: HTTP fundamentals, REST API design, Express.js routing, and more.",
      category: "Development",
      level: CourseLevel.BEGINNER,
      instructorName: "Ryan Torres",
      oneMonthPrice: 0,
      threeMonthPrice: 0,
      sixMonthPrice: 0,
      isFree: true,
      isPublished: true,
    },
  });

  await prisma.course.upsert({
    where: { slug: "gen-ai-essentials-free" },
    update: { isFree: true },
    create: {
      slug: "gen-ai-essentials-free",
      title: "Generative AI Essentials (Free)",
      shortDescription: "Understand LLMs, prompt engineering & AI tools. Completely free.",
      longDescription: "Demystify generative AI: how LLMs work, prompt engineering patterns, and practical tools.",
      category: "AI/ML",
      level: CourseLevel.ALL_LEVELS,
      instructorName: "Dr. Sarah Park",
      oneMonthPrice: 0,
      threeMonthPrice: 0,
      sixMonthPrice: 0,
      isFree: true,
      isPublished: true,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
