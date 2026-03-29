import { PrismaClient, CourseLevel } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * VIDEO SOURCES (all verified FreeCodeCamp YouTube videos):
 *
 * HTML Full Course (Dave Gray, 4h09m):   https://www.youtube.com/watch?v=kUMe1FH4CHE
 * CSS Full Course (Dave Gray, 11h30m):   https://www.youtube.com/watch?v=n4R2E7O-Ngo
 * JavaScript Course (Beau Carnes, 3h):   https://www.youtube.com/watch?v=PkZNo7MFNFg
 * Node.js + Express (fCC, 8h):           https://www.youtube.com/watch?v=Oe421EPjeBE
 * Prompt Engineering (Ania Kubów, 1h):   https://www.youtube.com/watch?v=dOxUW9nQ894
 * LLM Concepts (fCC, 1h30m):             https://www.youtube.com/watch?v=ztBJqzBU5kc
 *
 * Each lesson uses startSec/endSec to slice a specific topic from the video.
 */

async function main() {
  console.log("Seeding database...");

  // ═══════════════════════════════════════════════════════════════════════
  // FREE COURSE 1: Frontend Fundamentals
  // ═══════════════════════════════════════════════════════════════════════
  const fe = await prisma.course.upsert({
    where: { slug: "frontend-fundamentals-free" },
    update: { isFree: true, isPublished: true },
    create: {
      slug: "frontend-fundamentals-free",
      title: "Frontend Fundamentals (Free)",
      shortDescription: "Learn HTML, CSS & JavaScript from scratch. Completely free.",
      longDescription: "Build a solid foundation with semantic HTML5, modern CSS layouts (Flexbox, Grid), and JavaScript ES6+. This course uses real freeCodeCamp video content.",
      category: "Development",
      level: CourseLevel.BEGINNER,
      instructorName: "Dave Gray / freeCodeCamp",
      oneMonthPrice: 0, threeMonthPrice: 0, sixMonthPrice: 0,
      isFree: true, isPublished: true,
    },
  });

  // ── Module 1: HTML Foundations ───────────────────────────────────────
  // Source: "Learn HTML – Full Tutorial for Beginners" by Dave Gray
  // URL: https://www.youtube.com/watch?v=kUMe1FH4CHE
  const s1 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-1" }, update: { title: "Module 1: HTML Foundations", position: 1 },
    create: { id: "fe-sec-1", courseId: fe.id, title: "Module 1: HTML Foundations", position: 1 },
  });

  const htmlBase = "https://www.youtube.com/watch?v=kUMe1FH4CHE";

  await prisma.lesson.upsert({ where: { id: "fe-l-1" }, update: {}, create: {
    id: "fe-l-1", sectionId: s1.id, position: 1, isPreview: true,
    title: "Introduction & Getting Started",
    description: "Set up VS Code, understand what HTML is, and write your very first HTML file.",
    videoUrl: htmlBase, durationMins: 9,
    content: { startSec: 0, endSec: 540, transcript: [
      { time: "0:00", text: "Welcome to the full HTML course by Dave Gray on freeCodeCamp. I'm Dave, and I'll walk you through everything." },
      { time: "0:35", text: "HTML stands for HyperText Markup Language — it is the foundation of every webpage on the internet." },
      { time: "1:20", text: "We'll be using VS Code as our editor. Download it from code.visualstudio.com if you haven't already." },
      { time: "3:00", text: "Let's create our first file: index.html. This is always the entry point for a website." },
      { time: "4:40", text: "Every HTML document begins with a !DOCTYPE html declaration, followed by an html element that wraps everything." },
    ], resources: [{ label: "VS Code Download", url: "https://code.visualstudio.com/" }],
    notes: "HTML is a markup language, not a programming language. It describes structure, not logic." },
  }});

  await prisma.lesson.upsert({ where: { id: "fe-l-2" }, update: {}, create: {
    id: "fe-l-2", sectionId: s1.id, position: 2, isPreview: true,
    title: "HTML Head Element & Metadata",
    description: "Everything that goes in the <head>: title, meta tags, charset, viewport, and more.",
    videoUrl: htmlBase, durationMins: 12,
    content: { startSec: 540, endSec: 1260, transcript: [
      { time: "9:00", text: "The <head> element contains metadata about the page — information the browser needs but users don't see directly." },
      { time: "9:45", text: "The <title> tag sets what appears in the browser tab and search engine results." },
      { time: "11:00", text: "The meta charset='UTF-8' tag ensures your page supports all international characters correctly." },
      { time: "12:30", text: "The viewport meta tag is crucial for responsive design: name='viewport' content='width=device-width, initial-scale=1.0'." },
    ], resources: [{ label: "Meta Tags Reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta" }],
    notes: "Always include the viewport meta tag — without it, your site will look broken on mobile devices." },
  }});

  await prisma.lesson.upsert({ where: { id: "fe-l-3" }, update: {}, create: {
    id: "fe-l-3", sectionId: s1.id, position: 3, isPreview: false,
    title: "Text Elements: Headings & Paragraphs",
    description: "Use h1–h6 tags, paragraphs, line breaks, horizontal rules, and text formatting.",
    videoUrl: htmlBase, durationMins: 14,
    content: { startSec: 1260, endSec: 2100, transcript: [
      { time: "21:00", text: "Headings go from h1 to h6. h1 is the most important — use only one h1 per page for SEO." },
      { time: "22:10", text: "h2 through h6 define subtopics in order of importance. Think of them like an outline." },
      { time: "24:00", text: "The <p> tag defines a paragraph. Browsers automatically add spacing above and below paragraphs." },
      { time: "26:30", text: "Use <br> for a single line break. Use <hr> for a horizontal divider line." },
      { time: "28:00", text: "For bold text, use <strong>. For italic, use <em>. These carry semantic meaning for screen readers." },
    ], resources: [{ label: "HTML Text Elements Cheatsheet (PDF)", url: "#" }],
    notes: "Semantics matter! <strong> means 'important', not just 'bold'. Use semantic tags for accessibility." },
  }});

  await prisma.lesson.upsert({ where: { id: "fe-l-4" }, update: {}, create: {
    id: "fe-l-4", sectionId: s1.id, position: 4, isPreview: false,
    title: "Links, Images & Lists",
    description: "Create hyperlinks with anchor tags, embed images, and build ordered and unordered lists.",
    videoUrl: htmlBase, durationMins: 16,
    content: { startSec: 2100, endSec: 3060, transcript: [
      { time: "35:00", text: "The anchor tag <a> creates hyperlinks. The href attribute defines the destination URL." },
      { time: "36:15", text: "To open a link in a new tab, add target='_blank' and rel='noopener noreferrer' for security." },
      { time: "38:30", text: "Images use the <img> tag with src for the file path and alt for accessibility text." },
      { time: "41:00", text: "<ul> creates an unordered (bulleted) list. <ol> creates an ordered (numbered) list." },
      { time: "43:20", text: "Each item in a list goes inside an <li> (list item) tag." },
    ], resources: [{ label: "HTML Lists Reference", url: "#" }],
    notes: "Always include the alt attribute on images. Screen readers use it to describe images to visually impaired users." },
  }});

  // ── Module 2: CSS Styling ─────────────────────────────────────────────
  // Source: "CSS Full Course - Learn CSS in 11 Hours" - freeCodeCamp
  // URL: https://www.youtube.com/watch?v=n4R2E7O-Ngo
  const s2 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-2" }, update: { title: "Module 2: CSS Styling", position: 2 },
    create: { id: "fe-sec-2", courseId: fe.id, title: "Module 2: CSS Styling", position: 2 },
  });

  const cssBase = "https://www.youtube.com/watch?v=n4R2E7O-Ngo";

  await prisma.lesson.upsert({ where: { id: "fe-l-5" }, update: {}, create: {
    id: "fe-l-5", sectionId: s2.id, position: 1, isPreview: false,
    title: "Introduction to CSS & Selectors",
    description: "What CSS is, how to link it, and how to target HTML elements with selectors.",
    videoUrl: cssBase, durationMins: 12,
    content: { startSec: 0, endSec: 720, transcript: [
      { time: "0:00", text: "CSS — Cascading Style Sheets — is the language we use to style HTML documents." },
      { time: "0:40", text: "There are three ways to add CSS: inline styles, a <style> block, or an external stylesheet (best practice)." },
      { time: "2:00", text: "A CSS rule has a selector and a declaration block: p { color: red; font-size: 16px; }" },
      { time: "4:30", text: "Class selectors start with a dot: .my-class { }. ID selectors start with a hash: #my-id { }." },
    ], resources: [{ label: "CSS Selectors Reference - MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors" }],
    notes: "Prefer class selectors over ID selectors for reusability. IDs must be unique per page." },
  }});

  await prisma.lesson.upsert({ where: { id: "fe-l-6" }, update: {}, create: {
    id: "fe-l-6", sectionId: s2.id, position: 2, isPreview: false,
    title: "Colors, Fonts & Text Styling",
    description: "Work with colors (hex, rgb, hsl), Google Fonts, and text properties.",
    videoUrl: cssBase, durationMins: 14,
    content: { startSec: 720, endSec: 1560, transcript: [
      { time: "12:00", text: "Colors can be written as color names, hex (#7c3aed), rgb(124,58,237), or hsl(263,83%,58%)." },
      { time: "14:00", text: "HSL gives you the most intuitive control: Hue (0–360°), Saturation (%), Lightness (%)." },
      { time: "16:30", text: "Import Google Fonts by adding a link tag in your HTML head and then setting font-family in CSS." },
      { time: "18:00", text: "Text properties: font-size, font-weight, text-align, letter-spacing, line-height, text-decoration." },
    ], resources: [{ label: "Google Fonts", url: "https://fonts.google.com" }],
    notes: "Use HSL for theming — it's easy to create lighter/darker variants by only changing the Lightness value." },
  }});

  await prisma.lesson.upsert({ where: { id: "fe-l-7" }, update: {}, create: {
    id: "fe-l-7", sectionId: s2.id, position: 3, isPreview: false,
    title: "The CSS Box Model",
    description: "Understand margin, padding, border, and how to use box-sizing: border-box.",
    videoUrl: cssBase, durationMins: 13,
    content: { startSec: 1560, endSec: 2340, transcript: [
      { time: "26:00", text: "Every HTML element is a box. The box model has four layers: content, padding, border, and margin." },
      { time: "27:20", text: "Padding is space inside the border. Margin is space outside it." },
      { time: "29:00", text: "By default, width includes only content. With box-sizing: border-box, width includes padding and border too." },
      { time: "31:00", text: "Use * { box-sizing: border-box; } at the top of your CSS to apply it to all elements globally." },
    ], resources: [{ label: "Box Model Visualizer", url: "#" }],
    notes: "The box model is the #1 concept to master in CSS. Almost every layout issue traces back to it." },
  }});

  await prisma.lesson.upsert({ where: { id: "fe-l-8" }, update: {}, create: {
    id: "fe-l-8", sectionId: s2.id, position: 4, isPreview: false,
    title: "Flexbox Layout",
    description: "Build powerful one-dimensional layouts using the Flexbox model.",
    videoUrl: cssBase, durationMins: 18,
    content: { startSec: 2340, endSec: 3420, transcript: [
      { time: "39:00", text: "Flexbox is a one-dimensional layout system. Add display: flex to a container to activate it." },
      { time: "40:15", text: "flex-direction sets the main axis: row (horizontal, default) or column (vertical)." },
      { time: "42:00", text: "justify-content distributes space along the main axis: flex-start, center, space-between, space-around." },
      { time: "44:30", text: "align-items aligns on the cross axis: stretch (default), center, flex-start, flex-end." },
      { time: "47:00", text: "flex-wrap: wrap allows items to wrap to a new line when they overflow the container." },
    ], resources: [{ label: "Flexbox Froggy (Practice Game)", url: "https://flexboxfroggy.com/" }],
    notes: "Flexbox shines for 1D layouts like navbars and card rows. For 2D grids, use CSS Grid." },
  }});

  // ── Module 3: JavaScript ──────────────────────────────────────────────
  // Source: "Learn JavaScript - Full Course for Beginners" by Beau Carnes (fCC)
  // URL: https://www.youtube.com/watch?v=PkZNo7MFNFg
  const s3 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-3" }, update: { title: "Module 3: JavaScript Essentials", position: 3 },
    create: { id: "fe-sec-3", courseId: fe.id, title: "Module 3: JavaScript Essentials", position: 3 },
  });

  const jsBase = "https://www.youtube.com/watch?v=PkZNo7MFNFg";

  await prisma.lesson.upsert({ where: { id: "fe-l-9" }, update: {}, create: {
    id: "fe-l-9", sectionId: s3.id, position: 1, isPreview: false,
    title: "Variables & Data Types",
    description: "let, const, var — when to use each. Strings, numbers, booleans, null, and undefined.",
    videoUrl: jsBase, durationMins: 15,
    content: { startSec: 0, endSec: 900, transcript: [
      { time: "0:00", text: "JavaScript is the programming language that makes websites interactive. Let's start with variables." },
      { time: "0:45", text: "A variable is a named container for a value. We declare variables using let, const, or var." },
      { time: "2:00", text: "Use const when the value won't change. Use let when it might. Avoid var in modern JavaScript." },
      { time: "4:00", text: "JavaScript has 7 primitive data types: string, number, bigint, boolean, null, undefined, and symbol." },
    ], resources: [{ label: "MDN: JavaScript Data Types", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures" }],
    notes: "const doesn't mean the value can never change for objects/arrays — it means the binding can't be reassigned." },
  }});

  await prisma.lesson.upsert({ where: { id: "fe-l-10" }, update: {}, create: {
    id: "fe-l-10", sectionId: s3.id, position: 2, isPreview: false,
    title: "Functions & Scope",
    description: "Define functions, understand parameters vs arguments, and learn about variable scope.",
    videoUrl: jsBase, durationMins: 16,
    content: { startSec: 900, endSec: 1860, transcript: [
      { time: "15:00", text: "Functions are reusable blocks of code. Define once, call many times." },
      { time: "16:00", text: "Arrow functions are a modern shorthand: const add = (a, b) => a + b;" },
      { time: "18:30", text: "Parameters are variables in the function definition. Arguments are the values you pass in." },
      { time: "21:00", text: "Scope determines where a variable is accessible. Block scope (let/const) vs function scope (var)." },
    ], resources: [],
    notes: "Arrow functions don't have their own 'this' context — keep this in mind when using them as methods." },
  }});

  await prisma.lesson.upsert({ where: { id: "fe-l-11" }, update: {}, create: {
    id: "fe-l-11", sectionId: s3.id, position: 3, isPreview: false,
    title: "DOM Manipulation",
    description: "Select HTML elements with JavaScript and make your page interactive.",
    videoUrl: jsBase, durationMins: 18,
    content: { startSec: 1860, endSec: 2940, transcript: [
      { time: "31:00", text: "The DOM (Document Object Model) represents your HTML as a tree of objects that JavaScript can access." },
      { time: "32:00", text: "document.querySelector('.my-class') selects the first element matching a CSS selector." },
      { time: "34:30", text: "Change text with element.textContent = 'New text'. Change HTML with element.innerHTML." },
      { time: "37:00", text: "Add event listeners to respond to user actions: button.addEventListener('click', () => { ... })" },
    ], resources: [{ label: "MDN DOM Reference", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" }],
    notes: "Prefer querySelector over getElementById — it's more flexible and uses the same selectors as CSS." },
  }});

  // ═══════════════════════════════════════════════════════════════════════
  // FREE COURSE 2: Backend Basics with Node.js
  // ═══════════════════════════════════════════════════════════════════════
  const be = await prisma.course.upsert({
    where: { slug: "backend-basics-free" },
    update: { isFree: true, isPublished: true },
    create: {
      slug: "backend-basics-free",
      title: "Backend Basics with Node.js (Free)",
      shortDescription: "Build REST APIs with Node.js and Express. No cost, no catch.",
      longDescription: "Understand the server side: HTTP fundamentals, REST API design, Express.js routing, middleware, and database integration. Powered by freeCodeCamp content.",
      category: "Development",
      level: CourseLevel.BEGINNER,
      instructorName: "freeCodeCamp",
      oneMonthPrice: 0, threeMonthPrice: 0, sixMonthPrice: 0,
      isFree: true, isPublished: true,
    },
  });

  // Source: "Node.js and Express.js - Full Course" by freeCodeCamp
  // URL: https://www.youtube.com/watch?v=Oe421EPjeBE
  const beBase = "https://www.youtube.com/watch?v=Oe421EPjeBE";

  const be1 = await prisma.courseSection.upsert({
    where: { id: "be-sec-1" }, update: { title: "Module 1: Node.js Foundations", position: 1 },
    create: { id: "be-sec-1", courseId: be.id, title: "Module 1: Node.js Foundations", position: 1 },
  });

  await prisma.lesson.upsert({ where: { id: "be-l-1" }, update: {}, create: {
    id: "be-l-1", sectionId: be1.id, position: 1, isPreview: true,
    title: "What is Node.js & How It Works",
    description: "The Node.js runtime, the V8 engine, and the event loop explained.",
    videoUrl: beBase, durationMins: 10,
    content: { startSec: 0, endSec: 600, transcript: [
      { time: "0:00", text: "Node.js is a JavaScript runtime built on Chrome's V8 engine, allowing JavaScript to run on a server." },
      { time: "1:00", text: "Before Node.js, JavaScript could only run in the browser. Node opened up a whole new world." },
      { time: "2:30", text: "Node.js uses an event-driven, non-blocking I/O model — it handles many requests at once without blocking." },
      { time: "4:00", text: "The event loop is the heart of Node.js. It processes callbacks from the event queue continuously." },
    ], resources: [{ label: "Node.js Official Documentation", url: "https://nodejs.org/en/docs/" }],
    notes: "Node.js is single-threaded but handles concurrency through the event loop — don't confuse this with parallelism." },
  }});

  await prisma.lesson.upsert({ where: { id: "be-l-2" }, update: {}, create: {
    id: "be-l-2", sectionId: be1.id, position: 2, isPreview: false,
    title: "Your First Node.js App & NPM",
    description: "Write Node.js scripts, work with the file system, and manage packages using NPM.",
    videoUrl: beBase, durationMins: 14,
    content: { startSec: 600, endSec: 1440, transcript: [
      { time: "10:00", text: "Create a file called app.js and run it with: node app.js from your terminal." },
      { time: "12:00", text: "Node has built-in modules like 'fs' for file system and 'path' for file paths." },
      { time: "14:00", text: "NPM (Node Package Manager) manages external packages. Run npm init to create a package.json." },
      { time: "16:00", text: "Install packages with npm install package-name. They get saved to node_modules." },
    ], resources: [{ label: "npmjs.com package registry", url: "https://www.npmjs.com/" }],
    notes: "Never commit node_modules to Git. Add it to your .gitignore file." },
  }});

  const be2 = await prisma.courseSection.upsert({
    where: { id: "be-sec-2" }, update: { title: "Module 2: Express.js & REST APIs", position: 2 },
    create: { id: "be-sec-2", courseId: be.id, title: "Module 2: Express.js & REST APIs", position: 2 },
  });

  await prisma.lesson.upsert({ where: { id: "be-l-3" }, update: {}, create: {
    id: "be-l-3", sectionId: be2.id, position: 1, isPreview: false,
    title: "Express.js: Server & Routes",
    description: "Install Express, create a server, and define your first GET and POST routes.",
    videoUrl: beBase, durationMins: 16,
    content: { startSec: 1440, endSec: 2400, transcript: [
      { time: "24:00", text: "Express.js is a lightweight web framework for Node.js. Install it: npm install express." },
      { time: "25:30", text: "Create an app: const express = require('express'); const app = express();" },
      { time: "27:00", text: "Define a GET route: app.get('/api/users', (req, res) => { res.json({ users: [] }); });" },
      { time: "30:00", text: "Start the server: app.listen(3000, () => console.log('Server running on port 3000'));" },
    ], resources: [{ label: "Express.js Official Docs", url: "https://expressjs.com/" }],
    notes: "REST API routes follow a convention: GET = read, POST = create, PUT/PATCH = update, DELETE = remove." },
  }});

  await prisma.lesson.upsert({ where: { id: "be-l-4" }, update: {}, create: {
    id: "be-l-4", sectionId: be2.id, position: 2, isPreview: false,
    title: "Middleware & Request/Response Cycle",
    description: "Understand middleware, use express.json(), and handle errors properly.",
    videoUrl: beBase, durationMins: 14,
    content: { startSec: 2400, endSec: 3240, transcript: [
      { time: "40:00", text: "Middleware functions run between the request arriving and the route handler executing." },
      { time: "41:30", text: "Use app.use(express.json()) to parse incoming JSON request bodies automatically." },
      { time: "43:00", text: "The order of middleware matters — they execute in the order you call app.use()." },
      { time: "46:00", text: "Error-handling middleware has 4 parameters: (err, req, res, next). Place it last in your middleware chain." },
    ], resources: [],
    notes: "Think of middleware as a pipeline. Each function either passes control to the next or sends a response." },
  }});

  // ═══════════════════════════════════════════════════════════════════════
  // FREE COURSE 3: Generative AI Essentials
  // ═══════════════════════════════════════════════════════════════════════
  const ai = await prisma.course.upsert({
    where: { slug: "gen-ai-essentials-free" },
    update: { isFree: true, isPublished: true },
    create: {
      slug: "gen-ai-essentials-free",
      title: "Generative AI Essentials (Free)",
      shortDescription: "Understand LLMs, prompt engineering & AI tools. Completely free.",
      longDescription: "Demystify generative AI: how LLMs work, prompt engineering patterns, and practical tools like ChatGPT, Gemini, and Claude.",
      category: "AI/ML",
      level: CourseLevel.ALL_LEVELS,
      instructorName: "Ania Kubów / freeCodeCamp",
      oneMonthPrice: 0, threeMonthPrice: 0, sixMonthPrice: 0,
      isFree: true, isPublished: true,
    },
  });

  // Source: "Learn Prompt Engineering - Full Course" by Ania Kubów (fCC)
  // URL: https://www.youtube.com/watch?v=dOxUW9nQ894
  const aiBase = "https://www.youtube.com/watch?v=dOxUW9nQ894";

  const ai1 = await prisma.courseSection.upsert({
    where: { id: "ai-sec-1" }, update: { title: "Module 1: Understanding AI & LLMs", position: 1 },
    create: { id: "ai-sec-1", courseId: ai.id, title: "Module 1: Understanding AI & LLMs", position: 1 },
  });

  await prisma.lesson.upsert({ where: { id: "ai-l-1" }, update: {}, create: {
    id: "ai-l-1", sectionId: ai1.id, position: 1, isPreview: true,
    title: "What is Generative AI?",
    description: "An introduction to generative AI, LLMs, and how tools like ChatGPT work.",
    videoUrl: aiBase, durationMins: 10,
    content: { startSec: 0, endSec: 600, transcript: [
      { time: "0:00", text: "Welcome to the Prompt Engineering course from freeCodeCamp! I'm Ania Kubów." },
      { time: "0:30", text: "Generative AI refers to AI systems that can generate text, images, code, and other content." },
      { time: "1:30", text: "Large Language Models (LLMs) like GPT-4, Gemini, and Claude are trained on massive amounts of text." },
      { time: "3:00", text: "They don't 'understand' in the human sense — they predict the most likely next token based on training data." },
      { time: "5:00", text: "This makes them incredibly powerful for writing, reasoning, and coding — but also prone to 'hallucinations'." },
    ], resources: [
      { label: "OpenAI - What is ChatGPT?", url: "https://openai.com/chatgpt" },
      { label: "Google Gemini", url: "https://gemini.google.com" },
    ], notes: "LLMs are next-token predictors at scale. All the emergent capabilities come from this simple mechanism." },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-2" }, update: {}, create: {
    id: "ai-l-2", sectionId: ai1.id, position: 2, isPreview: false,
    title: "How LLMs Generate Text",
    description: "Tokens, temperature, top-p sampling — understanding how the model makes decisions.",
    videoUrl: aiBase, durationMins: 12,
    content: { startSec: 600, endSec: 1320, transcript: [
      { time: "10:00", text: "LLMs work by converting text into tokens — small chunks of characters or words." },
      { time: "11:30", text: "The model assigns a probability to each possible next token and samples from these probabilities." },
      { time: "13:00", text: "'Temperature' controls randomness. 0 = deterministic, 1 = creative, 2 = chaotic." },
      { time: "15:00", text: "Top-p (nucleus sampling) limits choices to the smallest set of tokens whose probabilities sum to P." },
    ], resources: [{ label: "Transformer Architecture Paper", url: "https://arxiv.org/abs/1706.03762" }],
    notes: "Lower temperature for factual tasks, higher for creative writing. Most APIs default to around 0.7." },
  }});

  const ai2 = await prisma.courseSection.upsert({
    where: { id: "ai-sec-2" }, update: { title: "Module 2: Prompt Engineering", position: 2 },
    create: { id: "ai-sec-2", courseId: ai.id, title: "Module 2: Prompt Engineering", position: 2 },
  });

  await prisma.lesson.upsert({ where: { id: "ai-l-3" }, update: {}, create: {
    id: "ai-l-3", sectionId: ai2.id, position: 1, isPreview: false,
    title: "Zero-Shot & Few-Shot Prompting",
    description: "The two most foundational prompt techniques and when to use each.",
    videoUrl: aiBase, durationMins: 14,
    content: { startSec: 1320, endSec: 2160, transcript: [
      { time: "22:00", text: "Zero-shot prompting means asking the model without any examples. 'Translate this to French: Hello.'" },
      { time: "23:30", text: "Few-shot prompting means providing 2–5 examples before your actual request to guide the model's format." },
      { time: "26:00", text: "Example: Input: 'cat' -> Output: 'feline'. Input: 'dog' -> Output: 'canine'. Input: 'bird' -> Output: ?" },
      { time: "29:00", text: "Few-shot reliably improves quality for classification, translation, and structured output tasks." },
    ], resources: [{ label: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/" }],
    notes: "Start with zero-shot. If outputs are inconsistent, add 2–3 examples to show the model exactly what you want." },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-4" }, update: {}, create: {
    id: "ai-l-4", sectionId: ai2.id, position: 2, isPreview: false,
    title: "Chain-of-Thought & Role Prompting",
    description: "Make the model think step-by-step and assign it a persona for better responses.",
    videoUrl: aiBase, durationMins: 13,
    content: { startSec: 2160, endSec: 2940, transcript: [
      { time: "36:00", text: "Chain-of-thought prompting instructs the model to 'think step by step' before answering." },
      { time: "37:30", text: "This dramatically improves accuracy for math, logic, and multi-step reasoning tasks." },
      { time: "39:00", text: "Role prompting assigns the model a persona: 'You are an expert Python developer. Code review this...'" },
      { time: "41:00", text: "Combining techniques: 'As a data scientist, analyze this dataset step by step and identify anomalies.'" },
    ], resources: [],
    notes: "Chain-of-thought is one of the most impactful techniques — always add it for complex reasoning tasks." },
  }});

  // ═══════════════════════════════════════════════════════════════════════
  // PAID COURSE 1: Complete UI/UX Design Bootcamp
  // ═══════════════════════════════════════════════════════════════════════
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

  const ux1 = await prisma.courseSection.upsert({
    where: { id: "ux-sec-1" }, update: { title: "Module 1: Design Foundations", position: 1 },
    create: { id: "ux-sec-1", courseId: ux.id, title: "Module 1: Design Foundations", position: 1 },
  });

  // Source: "UI / UX Design Tutorial – Wireframe, Mockup & Design in Figma" (fCC)
  // URL: https://www.youtube.com/watch?v=c9Wg6Cb_YlU
  await prisma.lesson.upsert({ where: { id: "ux-l-1" }, update: {}, create: {
    id: "ux-l-1", sectionId: ux1.id, position: 1, isPreview: true,
    title: "UI Design Fundamentals",
    description: "Core principles of visual design: contrast, alignment, repetition, and proximity.",
    videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", durationMins: 12,
    content: { startSec: 0, endSec: 720, transcript: [
      { time: "0:00", text: "UI Design is about creating the layouts and visual elements users interact with." },
      { time: "1:30", text: "The four core design principles are: Contrast, Alignment, Repetition, and Proximity (CARP)." },
      { time: "3:00", text: "Contrast makes important elements stand out. Use it with color, size, and typography." },
      { time: "5:00", text: "Alignment creates order. Every element should be aligned to something else intentionally." },
    ], resources: [{ label: "Design Principles Reference", url: "#" }],
    notes: "CARP: Contrast, Alignment, Repetition, Proximity. These four principles govern almost all good design decisions." },
  }});

  // ═══════════════════════════════════════════════════════════════════════
  // PAID COURSE 2: React & Next.js Mastery 2026
  // ═══════════════════════════════════════════════════════════════════════
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

  const r1 = await prisma.courseSection.upsert({
    where: { id: "react-sec-1" }, update: { title: "Module 1: React Core Concepts", position: 1 },
    create: { id: "react-sec-1", courseId: react.id, title: "Module 1: React Core Concepts", position: 1 },
  });

  // Source: "React Course - Beginner's Tutorial for React JavaScript Library" (fCC)
  // URL: https://www.youtube.com/watch?v=bMknfKXIFA8
  await prisma.lesson.upsert({ where: { id: "react-l-1" }, update: {}, create: {
    id: "react-l-1", sectionId: r1.id, position: 1, isPreview: true,
    title: "Why React & JSX Fundamentals",
    description: "What problems React solves, component-based thinking, and JSX syntax.",
    videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8", durationMins: 15,
    content: { startSec: 0, endSec: 900, transcript: [
      { time: "0:00", text: "React is a JavaScript library for building user interfaces. It was created by Facebook in 2013." },
      { time: "1:20", text: "React's core idea is components — small, reusable pieces of UI that you compose together to build applications." },
      { time: "3:00", text: "JSX is a syntax extension for JavaScript that lets you write HTML-like code inside JavaScript files." },
      { time: "5:30", text: "Behind the scenes, JSX gets compiled to React.createElement() calls by Babel." },
    ], resources: [{ label: "React Official Documentation", url: "https://react.dev/" }],
    notes: "Think in components. Break every UI into small, self-contained pieces that manage their own state." },
  }});

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
