import { PrismaClient, CourseLevel } from "@prisma/client";

const prisma = new PrismaClient();

// FreeCodeCamp: Full JavaScript Course (10hr) → https://www.youtube.com/watch?v=jS4aFq5-91M
// FreeCodeCamp: Full CSS Course → https://www.youtube.com/watch?v=OXGznpKZ_sA
// FreeCodeCamp: Full HTML Course → https://www.youtube.com/watch?v=kUMe1FH4CHE
// FreeCodeCamp: Node.js Full Course → https://www.youtube.com/watch?v=32M1al-Y6Ag
// FreeCodeCamp: ChatGPT Prompt Engineering → https://www.youtube.com/watch?v=myzLivDsbQY

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

  // Module 1: HTML Basics (FreeCodeCamp Full HTML Course)
  const feSection1 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-1" },
    update: { title: "Module 1: HTML Basics", position: 1 },
    create: { id: "fe-sec-1", courseId: fe.id, title: "Module 1: HTML Basics", position: 1 },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-1" },
    update: {},
    create: {
      id: "fe-l-1", sectionId: feSection1.id,
      title: "Introduction & Course Overview",
      description: "Get a full overview of what HTML is, what you'll build, and how the web works.",
      videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=0",
      durationMins: 6, position: 1, isPreview: true,
      content: {
        startSec: 0, endSec: 360,
        transcript: [
          { time: "0:00", text: "Welcome to the HTML full course from freeCodeCamp.org. I'm Dave Gray, and I'll be your instructor." },
          { time: "0:22", text: "In this course we'll go from the very basics of HTML all the way to advanced concepts like forms, tables, and semantic markup." },
          { time: "0:45", text: "Before we write any code, let's understand what HTML actually is." },
          { time: "1:10", text: "HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages." },
        ],
        resources: [{ label: "freeCodeCamp HTML Reference", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" }],
        notes: "HTML is the skeleton of every webpage. It defines structure, not styling or behavior.",
      },
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-2" },
    update: {},
    create: {
      id: "fe-l-2", sectionId: feSection1.id,
      title: "Your First HTML Page",
      description: "Write your first HTML file, understand the DOCTYPE, head, and body structure.",
      videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=360",
      durationMins: 10, position: 2, isPreview: true,
      content: {
        startSec: 360, endSec: 960,
        transcript: [
          { time: "6:00", text: "Let's open VS Code and create our very first HTML file. Name it index.html." },
          { time: "6:22", text: "Every HTML file starts with <!DOCTYPE html> which tells the browser this is an HTML5 document." },
          { time: "7:10", text: "Inside we have an <html> element, which contains a <head> and a <body>." },
          { time: "8:30", text: "The <head> holds metadata — things like the page title and links to CSS files." },
        ],
        resources: [{ label: "HTML Starter Template", url: "https://www.freecodecamp.org" }],
        notes: "Save your file and open it in a browser to see your first webpage live!",
      },
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-3" },
    update: {},
    create: {
      id: "fe-l-3", sectionId: feSection1.id,
      title: "Headings, Paragraphs & Text Formatting",
      description: "Learn h1–h6 tags, paragraphs, bold, italic, line breaks, and semantic text elements.",
      videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=960",
      durationMins: 12, position: 3, isPreview: false,
      content: {
        startSec: 960, endSec: 1680,
        transcript: [
          { time: "16:00", text: "Headings are defined by tags h1 through h6, with h1 being the most important." },
          { time: "16:45", text: "Use only one h1 per page — it represents the primary topic of the page for SEO." },
          { time: "18:00", text: "The <p> tag defines a paragraph and automatically adds spacing above and below." },
          { time: "19:30", text: "For bold text use <strong>, for italic use <em>. These carry semantic meaning." },
        ],
        resources: [{ label: "HTML Text Elements Cheatsheet (PDF)", url: "#" }],
        notes: "Use semantic HTML tags like <strong> and <em> instead of <b> and <i> for better accessibility.",
      },
    },
  });

  // Module 2: CSS Styling (FreeCodeCamp Full CSS Course)
  const feSection2 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-2" },
    update: { title: "Module 2: CSS Styling", position: 2 },
    create: { id: "fe-sec-2", courseId: fe.id, title: "Module 2: CSS Styling", position: 2 },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-4" },
    update: {},
    create: {
      id: "fe-l-4", sectionId: feSection2.id,
      title: "Introduction to CSS",
      description: "Learn what CSS is, how to link it to HTML, and your first selectors and properties.",
      videoUrl: "https://www.youtube.com/watch?v=OXGznpKZ_sA&t=0",
      durationMins: 10, position: 1, isPreview: false,
      content: {
        startSec: 0, endSec: 600,
        transcript: [
          { time: "0:00", text: "CSS stands for Cascading Style Sheets. It controls the visual presentation of your HTML." },
          { time: "0:30", text: "We link a CSS file to our HTML using a <link> tag inside the <head>." },
          { time: "1:15", text: "A CSS rule has two parts: a selector and a declaration block. Example: h1 { color: red; }" },
          { time: "2:40", text: "The selector targets which HTML elements to style. The declarations describe how." },
        ],
        resources: [{ label: "CSS Selectors Reference", url: "https://www.freecodecamp.org" }],
        notes: "The cascade in CSS means styles can inherit and override each other. Specificity determines which rule wins.",
      },
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-5" },
    update: {},
    create: {
      id: "fe-l-5", sectionId: feSection2.id,
      title: "The Box Model & Spacing",
      description: "Understand margin, padding, border, and how every HTML element is a rectangular box.",
      videoUrl: "https://www.youtube.com/watch?v=OXGznpKZ_sA&t=600",
      durationMins: 11, position: 2, isPreview: false,
      content: {
        startSec: 600, endSec: 1260,
        transcript: [
          { time: "10:00", text: "Every HTML element is essentially a box. This is called the CSS Box Model." },
          { time: "10:40", text: "The box has four areas: content, padding, border, and margin." },
          { time: "11:30", text: "Padding is space inside the border. Margin is space outside the border." },
          { time: "12:50", text: "Use box-sizing: border-box to include padding and border in an element's total size." },
        ],
        resources: [{ label: "Box Model Diagram (PDF)", url: "#" }],
        notes: "Set box-sizing: border-box on everything with * { box-sizing: border-box; } as a global reset.",
      },
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-6" },
    update: {},
    create: {
      id: "fe-l-6", sectionId: feSection2.id,
      title: "Flexbox Layout",
      description: "Build flexible, one-dimensional layouts using Flexbox — the most powerful CSS tool.",
      videoUrl: "https://www.youtube.com/watch?v=OXGznpKZ_sA&t=1260",
      durationMins: 15, position: 3, isPreview: false,
      content: {
        startSec: 1260, endSec: 2160,
        transcript: [
          { time: "21:00", text: "Flexbox allows you to arrange items in a row or column with precise alignment." },
          { time: "21:45", text: "Start with display: flex on the parent container. Children automatically become flex items." },
          { time: "23:00", text: "justify-content aligns items on the main axis. align-items aligns on the cross axis." },
          { time: "25:10", text: "flex-wrap: wrap allows items to wrap onto the next line when they overflow." },
        ],
        resources: [{ label: "Flexbox Cheat Sheet (PDF)", url: "#" }],
        notes: "Flexbox is perfect for navbars, cards in a row, and centering elements vertically and horizontally.",
      },
    },
  });

  // Module 3: JavaScript
  const feSection3 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-3" },
    update: { title: "Module 3: JavaScript Essentials", position: 3 },
    create: { id: "fe-sec-3", courseId: fe.id, title: "Module 3: JavaScript Essentials", position: 3 },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-7" },
    update: {},
    create: {
      id: "fe-l-7", sectionId: feSection3.id,
      title: "Variables, Data Types & Operators",
      description: "Core JavaScript fundamentals — let, const, var, strings, numbers, booleans.",
      videoUrl: "https://www.youtube.com/watch?v=jS4aFq5-91M&t=0",
      durationMins: 14, position: 1, isPreview: false,
      content: {
        startSec: 0, endSec: 840,
        transcript: [
          { time: "0:00", text: "JavaScript is the programming language of the web. It makes pages interactive." },
          { time: "0:35", text: "Variables are containers that store data. We declare them using let, const, or var." },
          { time: "1:20", text: "Use const when the value won't change, let when it might. Avoid var in modern JavaScript." },
          { time: "3:00", text: "JavaScript has several data types: strings, numbers, booleans, null, undefined, and objects." },
        ],
        resources: [{ label: "JavaScript ES6+ Cheatsheet", url: "#" }],
        notes: "Difference between let and const: const cannot be reassigned after initial assignment.",
      },
    },
  });

  await prisma.lesson.upsert({
    where: { id: "fe-l-8" },
    update: {},
    create: {
      id: "fe-l-8", sectionId: feSection3.id,
      title: "Functions & Control Flow",
      description: "Write reusable functions and control execution with if statements and loops.",
      videoUrl: "https://www.youtube.com/watch?v=jS4aFq5-91M&t=840",
      durationMins: 16, position: 2, isPreview: false,
      content: {
        startSec: 840, endSec: 1800,
        transcript: [
          { time: "14:00", text: "Functions let you write reusable blocks of code. Define them once, call them many times." },
          { time: "15:10", text: "Arrow functions are a modern shorthand: const greet = (name) => 'Hello, ' + name;" },
          { time: "17:30", text: "if, else if, and else let you make decisions in your code based on conditions." },
          { time: "20:00", text: "for loops repeat code a set number of times. while loops repeat until a condition is false." },
        ],
        resources: [{ label: "JavaScript Reference - MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" }],
        notes: "Master functions early — almost every JavaScript skill builds on top of them.",
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
      oneMonthPrice: 0, threeMonthPrice: 0, sixMonthPrice: 0,
      isFree: true, isPublished: true,
    },
  });

  const beSection1 = await prisma.courseSection.upsert({
    where: { id: "be-sec-1" },
    update: { title: "Module 1: Node.js Foundations", position: 1 },
    create: { id: "be-sec-1", courseId: be.id, title: "Module 1: Node.js Foundations", position: 1 },
  });

  await prisma.lesson.upsert({
    where: { id: "be-l-1" },
    update: {},
    create: {
      id: "be-l-1", sectionId: beSection1.id,
      title: "What is Node.js?",
      description: "Understand Node.js, its event loop architecture, and why it is used for servers.",
      videoUrl: "https://www.youtube.com/watch?v=32M1al-Y6Ag&t=0",
      durationMins: 9, position: 1, isPreview: true,
      content: {
        startSec: 0, endSec: 540,
        transcript: [
          { time: "0:00", text: "Node.js is a JavaScript runtime built on Chrome's V8 engine, allowing JS to run outside the browser." },
          { time: "0:45", text: "This means you can use JavaScript to write server-side code, command-line tools, and more." },
          { time: "1:30", text: "Node.js is non-blocking and event-driven, making it extremely efficient for I/O operations." },
        ],
        resources: [{ label: "Node.js Official Docs", url: "https://nodejs.org/en/docs/" }],
        notes: "Node.js uses a single-threaded event loop — it handles many requests efficiently without blocking.",
      },
    },
  });

  await prisma.lesson.upsert({
    where: { id: "be-l-2" },
    update: {},
    create: {
      id: "be-l-2", sectionId: beSection1.id,
      title: "Building Your First Express Server",
      description: "Create an Express.js server, set up routes, and send your first HTTP responses.",
      videoUrl: "https://www.youtube.com/watch?v=32M1al-Y6Ag&t=540",
      durationMins: 14, position: 2, isPreview: false,
      content: {
        startSec: 540, endSec: 1380,
        transcript: [
          { time: "9:00", text: "Express.js is a minimal, fast web framework for Node.js. Install it with npm install express." },
          { time: "10:00", text: "Create app.js and import express: const express = require('express'); const app = express();" },
          { time: "11:30", text: "Define a route: app.get('/', (req, res) => { res.send('Hello World'); });" },
          { time: "13:00", text: "Start the server: app.listen(3000, () => console.log('Server running'));" },
        ],
        resources: [{ label: "Express.js Official Guide", url: "https://expressjs.com/en/guide/routing.html" }],
        notes: "Run your file with node app.js and visit http://localhost:3000 to test it.",
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
      oneMonthPrice: 0, threeMonthPrice: 0, sixMonthPrice: 0,
      isFree: true, isPublished: true,
    },
  });

  const aiSection1 = await prisma.courseSection.upsert({
    where: { id: "ai-sec-1" },
    update: { title: "Module 1: Understanding LLMs", position: 1 },
    create: { id: "ai-sec-1", courseId: ai.id, title: "Module 1: Understanding LLMs", position: 1 },
  });

  await prisma.lesson.upsert({
    where: { id: "ai-l-1" },
    update: {},
    create: {
      id: "ai-l-1", sectionId: aiSection1.id,
      title: "What is a Large Language Model?",
      description: "A conceptual introduction to LLMs, transformers, and how they generate text.",
      videoUrl: "https://www.youtube.com/watch?v=myzLivDsbQY&t=0",
      durationMins: 11, position: 1, isPreview: true,
      content: {
        startSec: 0, endSec: 660,
        transcript: [
          { time: "0:00", text: "Welcome! In this course we'll demystify Generative AI and Large Language Models." },
          { time: "0:30", text: "An LLM is a neural network trained on massive text datasets to predict the next token." },
          { time: "1:15", text: "ChatGPT, Gemini, and Claude are all LLMs. They don't 'think' — they predict very well." },
          { time: "2:20", text: "The key breakthrough was the Transformer architecture, introduced in the 2017 paper 'Attention Is All You Need'." },
        ],
        resources: [
          { label: "Attention Is All You Need (Paper)", url: "https://arxiv.org/abs/1706.03762" },
          { label: "Prompt Engineering Guide", url: "https://www.promptingguide.ai" },
        ],
        notes: "The core idea: LLMs are next-token predictors. Everything emergent — reasoning, code, creativity — comes from this.",
      },
    },
  });

  await prisma.lesson.upsert({
    where: { id: "ai-l-2" },
    update: {},
    create: {
      id: "ai-l-2", sectionId: aiSection1.id,
      title: "Prompt Engineering Fundamentals",
      description: "Learn the systematic approach to writing prompts that get the best results from AI models.",
      videoUrl: "https://www.youtube.com/watch?v=myzLivDsbQY&t=660",
      durationMins: 13, position: 2, isPreview: false,
      content: {
        startSec: 660, endSec: 1440,
        transcript: [
          { time: "11:00", text: "Prompt engineering is the practice of designing effective inputs to AI models." },
          { time: "12:00", text: "Techniques include: zero-shot, few-shot, chain-of-thought, and role prompting." },
          { time: "13:30", text: "Zero-shot: ask directly. Few-shot: give examples. Chain-of-thought: ask it to think step by step." },
          { time: "15:20", text: "The most powerful prompt pattern: 'You are an expert in X. Do Y. Format the output as Z.'" },
        ],
        resources: [
          { label: "Prompt Engineering Guide", url: "https://www.promptingguide.ai" },
        ],
        notes: "Chain-of-thought prompting reliably improves quality for complex reasoning tasks.",
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
      longDescription: "This comprehensive bootcamp covers everything from design principles and wireframing to high-fidelity prototyping using Figma.",
      category: "Design",
      level: CourseLevel.BEGINNER,
      instructorName: "Jessica Willis",
      oneMonthPrice: 999, threeMonthPrice: 2499, sixMonthPrice: 4499,
      isFree: false, isPublished: true,
    },
  });

  const uxSection1 = await prisma.courseSection.upsert({
    where: { id: "ux-sec-1" },
    update: { title: "Module 1: Design Foundations", position: 1 },
    create: { id: "ux-sec-1", courseId: ux.id, title: "Module 1: Design Foundations", position: 1 },
  });

  await prisma.lesson.upsert({
    where: { id: "ux-l-1" },
    update: {},
    create: {
      id: "ux-l-1", sectionId: uxSection1.id,
      title: "What is UI Design?",
      description: "Learn the fundamentals of user interface design and why it matters.",
      videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU&t=0",
      durationMins: 10, position: 1, isPreview: true,
      content: {
        startSec: 0, endSec: 600,
        transcript: [
          { time: "0:00", text: "UI Design is about creating the visual elements users interact with — buttons, layouts, icons." },
          { time: "0:40", text: "Great UI makes users feel at ease, guides them intuitively, and communicates trust." },
          { time: "1:30", text: "UX — User Experience — is about the overall feel of using a product, not just how it looks." },
        ],
        resources: [{ label: "Design Principles Reference", url: "#" }],
        notes: "Good design is invisible. Users only notice bad design.",
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
      oneMonthPrice: 1499, threeMonthPrice: 3999, sixMonthPrice: 6999,
      isFree: false, isPublished: true,
    },
  });

  const reactSec = await prisma.courseSection.upsert({
    where: { id: "react-sec-1" },
    update: { title: "Module 1: React Foundations", position: 1 },
    create: { id: "react-sec-1", courseId: react.id, title: "Module 1: React Foundations", position: 1 },
  });

  await prisma.lesson.upsert({
    where: { id: "react-l-1" },
    update: {},
    create: {
      id: "react-l-1", sectionId: reactSec.id,
      title: "Why React in 2026?",
      description: "Understanding the React ecosystem and what makes it the top choice for web apps.",
      videoUrl: "https://www.youtube.com/watch?v=CgkZ7MvWUAA&t=0",
      durationMins: 14, position: 1, isPreview: true,
      content: {
        startSec: 0, endSec: 840,
        transcript: [
          { time: "0:00", text: "React is a JavaScript library for building user interfaces, created by Meta." },
          { time: "0:30", text: "Its component-based architecture means you build small, reusable pieces and compose them together." },
          { time: "1:15", text: "React 19 introduces a new compiler that automatically optimizes re-renders — no more manual memoization." },
        ],
        resources: [{ label: "React 19 Docs", url: "https://react.dev" }],
        notes: "React is just the UI layer. You combine it with Next.js for routing, data fetching, and SSR.",
      },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
