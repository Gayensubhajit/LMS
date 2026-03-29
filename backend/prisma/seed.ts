import { PrismaClient, CourseLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── FREE COURSE 1: Frontend Fundamentals ─────────────────────────────
  const fe = await prisma.course.upsert({
    where: { slug: "frontend-fundamentals-free" },
    update: { isFree: true, isPublished: true },
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

  // Upsert sections individually to support re-seeding
  const feSection1 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-1" },
    update: { title: "Getting Started with HTML", position: 1 },
    create: {
      id: "fe-sec-1",
      courseId: fe.id,
      title: "Getting Started with HTML",
      position: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-1" },
    update: {},
    create: {
      id: "fe-l-1",
      sectionId: feSection1.id,
      title: "Welcome to the Course",
      description: "An introduction to what you will learn in this course and how to get the most out of it.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      durationMins: 5,
      position: 1,
      isPreview: true,
      content: {
        transcript: [
          { time: "0:00", text: "Hello and welcome to Frontend Fundamentals! I'm Alex Chen, and I'll be your instructor throughout this course." },
          { time: "0:08", text: "In this first lesson, we'll go over the structure of the course and what you can expect to learn." },
          { time: "0:16", text: "By the end, you'll have a strong grasp of HTML, CSS, and JavaScript — the three pillars of the modern web." },
          { time: "0:28", text: "No prior knowledge is required. Just bring your curiosity and a code editor!" },
        ],
        resources: [
          { label: "Course Syllabus (PDF)", url: "#" },
          { label: "Setup Guide", url: "#" },
        ],
        notes: "This is an introductory video. Focus on understanding the overall course structure before diving into the modules.",
      },
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-2" },
    update: {},
    create: {
      id: "fe-l-2",
      sectionId: feSection1.id,
      title: "What is HTML?",
      description: "Understanding how HTML structures the content of every webpage on the internet.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      durationMins: 9,
      position: 2,
      isPreview: true,
      content: {
        transcript: [
          { time: "0:00", text: "HTML stands for HyperText Markup Language. It is the backbone of every webpage." },
          { time: "0:10", text: "Think of HTML as the skeleton — it gives structure to text, images, and links." },
          { time: "0:22", text: "We use 'tags' like <h1>, <p>, and <div> to define different types of content." },
          { time: "0:35", text: "Let's open our code editor and write our very first HTML file." },
        ],
        resources: [
          { label: "HTML Cheat Sheet (PDF)", url: "#" },
        ],
        notes: "Remember: HTML is not a programming language, it is a markup language. It describes structure, not logic.",
      },
    },
  });

  const feSection2 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-2" },
    update: { title: "Styling with CSS", position: 2 },
    create: {
      id: "fe-sec-2",
      courseId: fe.id,
      title: "Styling with CSS",
      position: 2,
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-3" },
    update: {},
    create: {
      id: "fe-l-3",
      sectionId: feSection2.id,
      title: "Introduction to CSS",
      description: "Learn how CSS breathes color and life into your HTML structure.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      durationMins: 12,
      position: 1,
      isPreview: false,
      content: {
        transcript: [
          { time: "0:00", text: "Now that we have a solid HTML foundation, let's talk about CSS — Cascading Style Sheets." },
          { time: "0:12", text: "CSS controls everything visual: colors, fonts, layout, spacing, and animations." },
          { time: "0:28", text: "We link a CSS file to our HTML using the <link> tag in the <head> section." },
        ],
        resources: [
          { label: "CSS Selectors Reference", url: "#" },
          { label: "Color Palette Guide", url: "#" },
        ],
        notes: "Start by understanding the box model — every HTML element is a rectangular box with padding, border, and margin.",
      },
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-4" },
    update: {},
    create: {
      id: "fe-l-4",
      sectionId: feSection2.id,
      title: "Flexbox & Grid Layouts",
      description: "Master modern CSS layout systems to build responsive, beautiful pages.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      durationMins: 18,
      position: 2,
      isPreview: false,
      content: {
        transcript: [
          { time: "0:00", text: "In this lesson, we tackle one of the most powerful tools in modern CSS: Flexbox." },
          { time: "0:15", text: "Flexbox allows you to align and distribute items in a container with minimal code." },
          { time: "0:40", text: "After Flexbox, we'll explore CSS Grid, which is perfect for two-dimensional layouts." },
        ],
        resources: [
          { label: "Flexbox Cheat Sheet", url: "#" },
          { label: "CSS Grid Guide", url: "#" },
        ],
        notes: null,
      },
    },
  });

  const feSection3 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-3" },
    update: { title: "JavaScript Essentials", position: 3 },
    create: {
      id: "fe-sec-3",
      courseId: fe.id,
      title: "JavaScript Essentials",
      position: 3,
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-5" },
    update: {},
    create: {
      id: "fe-l-5",
      sectionId: feSection3.id,
      title: "Variables, Functions & Loops",
      description: "The core building blocks of any JavaScript program.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      durationMins: 20,
      position: 1,
      isPreview: false,
      content: {
        transcript: [
          { time: "0:00", text: "JavaScript is the programming language of the web. It makes websites interactive." },
          { time: "0:18", text: "We'll start with: variables to store data, functions to reuse code, and loops to repeat tasks." },
        ],
        resources: [
          { label: "JavaScript ES6 Features", url: "#" },
        ],
        notes: "Pay close attention to the difference between `let`, `const`, and `var`.",
      },
    },
  });

  // ─── FREE COURSE 2: Backend Basics ────────────────────────────────────
  const be = await prisma.course.upsert({
    where: { slug: "backend-basics-free" },
    update: { isFree: true, isPublished: true },
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

  const beSection1 = await prisma.courseSection.upsert({
    where: { id: "be-sec-1" },
    update: { title: "Node.js Foundations", position: 1 },
    create: { id: "be-sec-1", courseId: be.id, title: "Node.js Foundations", position: 1 },
  });

  await prisma.lesson.upsert({
    where: { id: "be-l-1" },
    update: {},
    create: {
      id: "be-l-1",
      sectionId: beSection1.id,
      title: "What is Node.js?",
      description: "Understand how Node.js enables JavaScript to run on the server.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      durationMins: 8,
      position: 1,
      isPreview: true,
      content: {
        transcript: [
          { time: "0:00", text: "Node.js is a JavaScript runtime built on Chrome's V8 engine." },
          { time: "0:12", text: "It allows us to run JavaScript outside the browser — on servers, CLIs, and more." },
        ],
        resources: [{ label: "Node.js Official Docs", url: "https://nodejs.org" }],
        notes: "Think of Node.js as the environment that lets your JavaScript code talk to the file system and network.",
      },
    },
  });

  // ─── FREE COURSE 3: Generative AI Essentials ──────────────────────────
  const ai = await prisma.course.upsert({
    where: { slug: "gen-ai-essentials-free" },
    update: { isFree: true, isPublished: true },
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

  const aiSection1 = await prisma.courseSection.upsert({
    where: { id: "ai-sec-1" },
    update: { title: "Understanding Large Language Models", position: 1 },
    create: { id: "ai-sec-1", courseId: ai.id, title: "Understanding Large Language Models", position: 1 },
  });

  await prisma.lesson.upsert({
    where: { id: "ai-l-1" },
    update: {},
    create: {
      id: "ai-l-1",
      sectionId: aiSection1.id,
      title: "What is a Large Language Model?",
      description: "A conceptual introduction to LLMs and how they generate text.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      durationMins: 11,
      position: 1,
      isPreview: true,
      content: {
        transcript: [
          { time: "0:00", text: "Welcome to Generative AI Essentials! I'm Dr. Sarah Park." },
          { time: "0:08", text: "Today we explore Large Language Models — the AI systems behind tools like ChatGPT and Gemini." },
          { time: "0:22", text: "An LLM is trained on massive amounts of text, learning to predict the next word in a sequence." },
        ],
        resources: [
          { label: "Attention Is All You Need (Paper)", url: "#" },
          { label: "Prompt Engineering Guide", url: "#" },
        ],
        notes: "The core concept: LLMs predict the next token. Everything else — reasoning, writing, coding — emerges from this.",
      },
    },
  });

  // ─── PAID COURSE 1: UI/UX Bootcamp ────────────────────────────────────
  const ux = await prisma.course.upsert({
    where: { slug: "complete-ui-ux-design-bootcamp" },
    update: { isFree: false },
    create: {
      slug: "complete-ui-ux-design-bootcamp",
      title: "Complete UI/UX Design Bootcamp",
      shortDescription: "Master the art of designing beautiful and functional user interfaces.",
      longDescription: "This comprehensive bootcamp covers everything from design principles and wireframing to high-fidelity prototyping using Figma and Adobe XD.",
      category: "Design",
      level: CourseLevel.BEGINNER,
      instructorName: "Jessica Willis",
      oneMonthPrice: 999,
      threeMonthPrice: 2499,
      sixMonthPrice: 4499,
      isFree: false,
      isPublished: true,
    },
  });

  const uxSection1 = await prisma.courseSection.upsert({
    where: { id: "ux-sec-1" },
    update: { title: "Introduction to UI Design", position: 1 },
    create: { id: "ux-sec-1", courseId: ux.id, title: "Introduction to UI Design", position: 1 },
  });

  await prisma.lesson.upsert({
    where: { id: "ux-l-1" },
    update: {},
    create: {
      id: "ux-l-1",
      sectionId: uxSection1.id,
      title: "What is UI Design?",
      description: "Learn the fundamentals of user interface design and why it matters.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      durationMins: 10,
      position: 1,
      isPreview: true,
      content: {
        transcript: [
          { time: "0:00", text: "UI Design is about creating the visual and interactive elements of digital products." },
          { time: "0:15", text: "Great UI makes users feel at ease, guides them intuitively, and communicates trust." },
        ],
        resources: [{ label: "Design Principles Reference", url: "#" }],
        notes: "Focus on user needs, not just aesthetics. Good design is invisible.",
      },
    },
  });

  // ─── PAID COURSE 2: React & Next.js ───────────────────────────────────
  const react = await prisma.course.upsert({
    where: { slug: "react-nextjs-mastery-2026" },
    update: { isFree: false },
    create: {
      slug: "react-nextjs-mastery-2026",
      title: "React & Next.js Mastery 2026",
      shortDescription: "Build production-ready full-stack applications with the latest Next.js features.",
      longDescription: "Deep dive into App Router, Server Components, Server Actions, and advanced patterns.",
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

  const reactSec = await prisma.courseSection.upsert({
    where: { id: "react-sec-1" },
    update: { title: "React Foundations", position: 1 },
    create: { id: "react-sec-1", courseId: react.id, title: "React Foundations", position: 1 },
  });

  await prisma.lesson.upsert({
    where: { id: "react-l-1" },
    update: {},
    create: {
      id: "react-l-1",
      sectionId: reactSec.id,
      title: "Why React in 2026?",
      description: "Understanding the React ecosystem and what makes it the top choice for web apps.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      durationMins: 14,
      position: 1,
      isPreview: true,
      content: {
        transcript: [
          { time: "0:00", text: "React has been at the top of the web dev ecosystem for a decade, and for good reason." },
          { time: "0:18", text: "In 2026, React 19 introduces powerful new primitives that change how we build UIs." },
        ],
        resources: [{ label: "React 19 Release Notes", url: "https://react.dev" }],
        notes: "Make sure you understand JavaScript fundamentals before starting this module.",
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
