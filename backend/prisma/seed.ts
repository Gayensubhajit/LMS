import { PrismaClient, CourseLevel, PlanDuration } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Sample Courses
  const course1 = await prisma.course.upsert({
    where: { slug: "complete-ui-ux-design-bootcamp" },
    update: {},
    create: {
      slug: "complete-ui-ux-design-bootcamp",
      title: "Complete UI/UX Design Bootcamp",
      shortDescription: "Master the art of designing beautiful and functional user interfaces.",
      longDescription: "This comprehensive bootcamp covers everything from design principles and wireframing to high-fidelity prototyping using Figma and Adobe XD. Perfect for beginners and those looking to switch careers into design.",
      category: "Design",
      level: CourseLevel.BEGINNER,
      instructorName: "Sarah Johnson",
      oneMonthPrice: 999,
      threeMonthPrice: 2499,
      sixMonthPrice: 4499,
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
                {
                  title: "Design Principles: Contrast & Alignment",
                  description: "Master the core principles of good UI design.",
                  durationMins: 15,
                  position: 2,
                },
              ],
            },
          },
          {
            title: "Figma Masterclass",
            position: 2,
            lessons: {
              create: [
                {
                  title: "Getting Started with Figma",
                  description: "Setting up your workspace and understanding basic tools.",
                  durationMins: 20,
                  position: 1,
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
    update: {},
    create: {
      slug: "react-nextjs-mastery-2026",
      title: "React & Next.js Mastery 2026",
      shortDescription: "Build production-ready full-stack applications with the latest Next.js features.",
      longDescription: "Deep dive into App Router, Server Components, Server Actions, and advanced patterns. Learn how to build scalable, high-performance web applications with ease.",
      category: "Development",
      level: CourseLevel.ADVANCED,
      instructorName: "David Chen",
      oneMonthPrice: 1499,
      threeMonthPrice: 3999,
      sixMonthPrice: 6999,
      isPublished: true,
      sections: {
        create: [
          {
            title: "Next.js App Router Fundamentals",
            position: 1,
            lessons: {
              create: [
                {
                  title: "Routing in Next.js",
                  description: "Understanding file-based routing and nested layouts.",
                  durationMins: 25,
                  position: 1,
                  isPreview: true,
                },
                {
                  title: "Server vs Client Components",
                  description: "When to use what for optimal performance.",
                  durationMins: 30,
                  position: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course3 = await prisma.course.upsert({
    where: { slug: "ai-machine-learning-for-designers" },
    update: {},
    create: {
      slug: "ai-machine-learning-for-designers",
      title: "Python for AI and Machine Learning",
      shortDescription: "Start your journey into the world of Artificial Intelligence with Python.",
      longDescription: "Learn Python from scratch and move towards building your first machine learning models. Covers NumPy, Pandas, Scikit-learn, and neural network basics.",
      category: "AI & Data Science",
      level: CourseLevel.INTERMEDIATE,
      instructorName: "Dr. Emily Smith",
      oneMonthPrice: 1999,
      threeMonthPrice: 4999,
      sixMonthPrice: 8999,
      isPublished: true,
      sections: {
        create: [
          {
            title: "Python Basics for Data Science",
            position: 1,
            lessons: {
              create: [
                {
                  title: "Python Data Structures",
                  description: "Lists, dictionaries, and sets for data manipulation.",
                  durationMins: 20,
                  position: 1,
                },
              ],
            },
          },
        ],
      },
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
