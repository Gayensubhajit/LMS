import { PrismaClient, CourseLevel } from "@prisma/client";

const prisma = new PrismaClient();

// Converts "HH:MM:SS" or "MM:SS" to total seconds
function ts(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.some(isNaN)) throw new Error(`Invalid timestamp: "${time}"`);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  throw new Error(`Timestamp must be MM:SS or HH:MM:SS, got: "${time}"`);
}

async function main() {
  console.log("🧹 Cleaning sections and lessons...");

  // Lessons must be deleted before sections (FK constraint)
  await prisma.lesson.deleteMany({});
  await prisma.courseSection.deleteMany({});

  console.log("🌱 Seeding course...");

  // =============================
  // COURSE
  // =============================
  const aiCourse = await prisma.course.upsert({
    where: { slug: "gen-ai-essentials-free" },
    update: {},
    create: {
      slug: "gen-ai-essentials-free",
      title: "Generative AI Essentials (Free)",
      shortDescription: "LLMs, Prompting, RAG, Agents",
      longDescription: "Full GenAI deep dive",
      category: "AI/ML",
      level: CourseLevel.ALL_LEVELS,
      instructorName: "ExamPro",
      isFree: true,
      isPublished: true,
      // Required price fields — set to 0 for free course
      oneMonthPrice: 0,
      threeMonthPrice: 0,
      sixMonthPrice: 0,
    },
  });

  console.log(`✅ Course: ${aiCourse.id}`);

  // =============================
  // SECTIONS
  // Upsert by courseId + position so re-seeding is safe
  // even if cuid changes between runs
  // =============================
  const [sec1, sec2] = await Promise.all([
    prisma.courseSection.upsert({
      where: {
        // composite unique isn't defined — use findFirst + upsert pattern
        // workaround: delete+recreate is already handled above, so create is safe
        id: "seed-ai-sec-1", // stable seed ID; schema accepts any string cuid
      },
      update: { title: "AI Foundations", position: 1 },
      create: {
        id: "seed-ai-sec-1",
        courseId: aiCourse.id,
        title: "AI Foundations",
        position: 1,
      },
    }),
    prisma.courseSection.upsert({
      where: { id: "seed-ai-sec-2" },
      update: { title: "LLMs", position: 2 },
      create: {
        id: "seed-ai-sec-2",
        courseId: aiCourse.id,
        title: "LLMs",
        position: 2,
      },
    }),
  ]);

  console.log(`✅ Sections: ${sec1.id}, ${sec2.id}`);

  // =============================
  // LESSONS
  // content is Json? — pass a typed object directly, Prisma serialises it
  // =============================
  await Promise.all([
    prisma.lesson.upsert({
      where: { id: "seed-ai-l-01" },
      update: {},
      create: {
        id: "seed-ai-l-01",
        sectionId: sec1.id,
        position: 1,
        isPreview: true,
        title: "Intro",
        description: "Course intro",
        videoUrl: "nJ25yl34Uqw",
        durationMins: 10,
        content: { startSec: 0, endSec: 600 },
      },
    }),
    prisma.lesson.upsert({
      where: { id: "seed-ai-l-02" },
      update: {},
      create: {
        id: "seed-ai-l-02",
        sectionId: sec1.id,
        position: 2,
        isPreview: false,
        title: "ML Basics",
        description: "ML fundamentals",
        videoUrl: "nJ25yl34Uqw",
        durationMins: 120,
        content: {
          startSec: ts("54:16"),   // 3256
          endSec: ts("3:02:21"),   // 10941
        },
      },
    }),
  ]);

  console.log("✅ Lessons seeded");
  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });