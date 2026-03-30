import { PrismaClient, CourseLevel } from "@prisma/client";
const prisma = new PrismaClient();

// Helper: convert HH:MM:SS or MM:SS to seconds
function ts(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
}

async function main() {
  console.log("Seeding database...");

  // ════════════════════════════════════════════════════════════════════════
  // COURSE 1: GENERATIVE AI ESSENTIALS (FREE)
  // Source: "GenAI Essentials – Full Course for Beginners" by ExamPro
  // URL:    https://www.youtube.com/watch?v=nJ25yl34Uqw
  // Total:  ~22 hours, chapters verified from official freeCodeCamp description
  //
  // Chapter timestamps (from YouTube description):
  //  00:00:00  Introduction
  //  00:54:16  AI and ML Fundamentals
  //  03:02:21  Gen AI Primer
  //  03:32:55  Data and ML
  //  03:47:56  LLM Basics
  //  04:12:22  AI Powered Assistants
  //  04:24:42  Env Setup
  //  06:12:17  Prompt Engineering
  //  07:00:25  WorkBenches and Playgrounds
  //  07:44:09  Model as a Service
  //  08:36:26  LLM DevTools and Workflow
  //  11:52:07  AI Code Assistants
  //  14:04:37  App Prototyping
  //  17:21:06  Containers
  //  18:12:43  Serving
  //  18:19:51  AI Delivery Platform
  //  19:40:45  GenAI Hardware
  //  19:50:21  Framework
  //  19:51:49  LLM Customization
  //  19:52:35  SFT
  //  19:56:25  Size Optimization
  //  20:26:04  RAGS
  //  22:21:19  Agents
  // ════════════════════════════════════════════════════════════════════════
  const AI_VIDEO = "https://www.youtube.com/watch?v=nJ25yl34Uqw";

  const aiCourse = await prisma.course.upsert({
    where: { slug: "gen-ai-essentials-free" },
    update: { isFree: true, isPublished: true },
    create: {
      slug: "gen-ai-essentials-free",
      title: "Generative AI Essentials (Free)",
      shortDescription: "Understand LLMs, prompt engineering, RAG & AI Agents. Completely free.",
      longDescription:
        "A comprehensive 22-hour deep dive into Generative AI — from AI/ML fundamentals and LLM internals, to practical prompt engineering, AI-powered dev tools, RAG pipelines, and autonomous agents. Taught by ExamPro on freeCodeCamp.",
      category: "AI/ML",
      level: CourseLevel.ALL_LEVELS,
      instructorName: "ExamPro / freeCodeCamp",
      oneMonthPrice: 0, threeMonthPrice: 0, sixMonthPrice: 0,
      isFree: true, isPublished: true,
    },
  });

  // ── Module 1: AI Foundations ──────────────────────────────────────────
  const aiS1 = await prisma.courseSection.upsert({
    where: { id: "ai-sec-1" },
    update: { title: "Module 1: AI & ML Foundations", position: 1 },
    create: { id: "ai-sec-1", courseId: aiCourse.id, title: "Module 1: AI & ML Foundations", position: 1 },
  });

  await prisma.lesson.upsert({ where: { id: "ai-l-01" }, update: {}, create: {
    id: "ai-l-01", sectionId: aiS1.id, position: 1, isPreview: true,
    title: "Introduction to Generative AI",
    description: "What generative AI is, why it matters now, and an overview of the full course roadmap.",
    title: "Course Introduction & Goals",
    description: "A quick overview of what you will learn in this 22-hour Generative AI masterclass and the course roadmap.",
    videoUrl: AI_VIDEO, durationMins: 10,
    content: {
      startSec: 0, endSec: 600,
      notes: "Welcome to the world of GenAI. We will cover the entire lifecycle from prompting to agent deployment.",
      transcript: [
        { time: "0:00", text: "Learn the essentials of working with AI in the cloud from ExamPro." },
        { time: "2:30", text: "This course covers the complete generative AI development lifecycle — from fundamentals to deployment." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-01-deep" }, update: {}, create: {
    id: "ai-l-01-deep", sectionId: aiS1.id, position: 2, isPreview: false,
    title: "GenAI Industry Overview",
    description: "Deep dive into the current AI landscape, cloud providers, and the architecture of large language models.",
    videoUrl: AI_VIDEO, durationMins: 44,
    content: {
      startSec: 600, endSec: 3256,
      notes: "The AI lifecycle involves data preparation, model selection, and iterative prompting.",
      transcript: [
        { time: "10:00", text: "We'll look at how LLMs work, how to prompt them effectively, and how to build AI-powered applications." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-02" }, update: {}, create: {
    id: "ai-l-02", sectionId: aiS1.id, position: 3, isPreview: false,
    title: "AI and ML Fundamentals",
    description: "Supervised vs unsupervised learning, neural network basics, training pipelines, and where generative AI fits in the ML landscape.",
    videoUrl: AI_VIDEO, durationMins: 128,
    content: {
      startSec: 3256, endSec: 10941,
      notes: "Neural networks and transformers are the engines behind modern GenAI systems.",
      transcript: [
        { time: "54:16", text: "Artificial Intelligence is a broad field. Machine learning is a way to achieve AI through data-driven models." },
        { time: "1:10:00", text: "Supervised learning requires labeled data — the model learns from input/output pairs." },
        { time: "2:00:00", text: "Neural networks are inspired by the brain. Deep learning stacks many layers to learn complex representations." },
      ],
    },
  }});

  // ── Module 2: Working with LLMs ───────────────────────────────────────
  const aiS2 = await prisma.courseSection.upsert({
    where: { id: "ai-sec-2" },
    update: { title: "Module 2: Working with LLMs", position: 2 },
    create: { id: "ai-sec-2", courseId: aiCourse.id, title: "Module 2: Working with LLMs", position: 2 },
  });

  await prisma.lesson.upsert({ where: { id: "ai-l-04" }, update: {}, create: {
    id: "ai-l-04", sectionId: aiS2.id, position: 1, isPreview: false,
    title: "LLM Basics",
    description: "Tokens, context windows, temperature, top-p sampling — how large language models actually generate output.",
    videoUrl: AI_VIDEO, durationMins: 25,
    content: {
      startSec: ts("3:47:56"), endSec: ts("4:12:22"),
      notes: "LLMs predict the next token. Temperature controls randomness. Context window limits how much the model can 'see' at once.",
      transcript: [
        { time: "3:47:56", text: "A Large Language Model is trained on billions of tokens — chunks of text — to predict what comes next." },
        { time: "3:55:00", text: "The context window is the maximum amount of text the model processes in a single call." },
        { time: "4:05:00", text: "Temperature: 0 = deterministic, 1 = balanced, 2 = highly random. Top-p limits the vocabulary sample pool." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-05" }, update: {}, create: {
    id: "ai-l-05", sectionId: aiS2.id, position: 2, isPreview: false,
    title: "AI Powered Assistants & Env Setup",
    description: "Overview of AI assistant products (ChatGPT, Gemini, Claude), their APIs, and setting up your development environment.",
    videoUrl: AI_VIDEO, durationMins: 108,
    content: {
      startSec: ts("4:12:22"), endSec: ts("6:12:17"),
      notes: "Different AI assistants are built on different base models. API access is how developers build applications on top of these models.",
      transcript: [
        { time: "4:12:22", text: "AI-powered assistants like ChatGPT, Gemini, and Claude are built on top of large language models." },
        { time: "4:24:42", text: "Setting up your environment: install Python, configure API keys, set up virtual environments." },
        { time: "5:00:00", text: "The OpenAI Python SDK lets you call GPT-4 with a simple API call and get structured responses." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-06" }, update: {}, create: {
    id: "ai-l-06", sectionId: aiS2.id, position: 3, isPreview: false,
    title: "Prompt Engineering",
    description: "Zero-shot, few-shot, chain-of-thought, role prompting, and structured output — all the core techniques with real examples.",
    videoUrl: AI_VIDEO, durationMins: 104,
    content: {
      startSec: ts("6:12:17"), endSec: ts("7:44:09"),
      notes: "Prompt engineering is the skill of crafting inputs that reliably produce the output you want. Chain-of-thought is one of the most impactful techniques.",
      transcript: [
        { time: "6:12:17", text: "Prompt engineering means crafting your input carefully to reliably get the output you want from an LLM." },
        { time: "6:30:00", text: "Zero-shot: ask without examples. Few-shot: give 2–5 examples to guide format and style." },
        { time: "7:00:00", text: "Chain-of-thought: add 'think step by step' to dramatically improve reasoning on complex tasks." },
      ],
    },
  }});

  // ── Module 3: AI Development Tools ───────────────────────────────────
  const aiS3 = await prisma.courseSection.upsert({
    where: { id: "ai-sec-3" },
    update: { title: "Module 3: AI Development Tools", position: 3 },
    create: { id: "ai-sec-3", courseId: aiCourse.id, title: "Module 3: AI Development Tools", position: 3 },
  });

  await prisma.lesson.upsert({ where: { id: "ai-l-07" }, update: {}, create: {
    id: "ai-l-07", sectionId: aiS3.id, position: 1, isPreview: false,
    title: "Workbenches, Playgrounds & Model-as-a-Service",
    description: "Using OpenAI Playground, Google AI Studio, Amazon Bedrock, and other platforms to experiment with and deploy LLMs.",
    videoUrl: AI_VIDEO, durationMins: 116,
    content: {
      startSec: ts("7:00:25"), endSec: ts("8:36:26"),
      notes: "Model-as-a-Service lets you use powerful LLMs via API without managing infrastructure. AWS Bedrock, Google Vertex AI, and Azure OpenAI Service are the top providers.",
      transcript: [
        { time: "7:00:25", text: "Workbenches and playgrounds let you experiment with models interactively before writing code." },
        { time: "7:44:09", text: "Model-as-a-Service means you call a hosted model via API — no GPUs, no training, just inference." },
        { time: "8:00:00", text: "AWS Bedrock, Google Vertex AI, and Azure OpenAI Service all offer enterprise-grade LLM APIs." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-08" }, update: {}, create: {
    id: "ai-l-08", sectionId: aiS3.id, position: 2, isPreview: false,
    title: "LLM DevTools, Workflow & AI Code Assistants",
    description: "LangChain, LlamaIndex, GitHub Copilot, Cursor, and how AI coding tools work under the hood.",
    videoUrl: AI_VIDEO, durationMins: 252,
    content: {
      startSec: ts("8:36:26"), endSec: ts("14:04:37"),
      notes: "LangChain and LlamaIndex are frameworks for building LLM-powered pipelines. AI code assistants like Copilot use the same LLM APIs under the hood.",
      transcript: [
        { time: "8:36:26", text: "LangChain is a framework for building LLM-powered applications — chains, agents, and memory." },
        { time: "11:52:07", text: "AI code assistants like GitHub Copilot send your code context to an LLM and return completions." },
        { time: "13:00:00", text: "These tools use the same API you've been learning — they just automate the prompt construction." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-09" }, update: {}, create: {
    id: "ai-l-09", sectionId: aiS3.id, position: 3, isPreview: false,
    title: "App Prototyping with AI",
    description: "Building full AI-powered application prototypes, from chat interfaces to AI pipelines, using modern tooling.",
    videoUrl: AI_VIDEO, durationMins: 196,
    content: {
      startSec: ts("14:04:37"), endSec: ts("17:21:06"),
      notes: "Rapid prototyping with AI tools can compress weeks of work into hours. The key is understanding which LLM capabilities to leverage for each use case.",
      transcript: [
        { time: "14:04:37", text: "We'll build real application prototypes using AI APIs — going from idea to working demo quickly." },
        { time: "15:00:00", text: "A chat interface needs: a message history array, an API call per message, and streaming responses." },
        { time: "16:30:00", text: "Tool use / function calling lets LLMs execute real code and interact with external services." },
      ],
    },
  }});

  // ── Module 4: Advanced GenAI ──────────────────────────────────────────
  const aiS4 = await prisma.courseSection.upsert({
    where: { id: "ai-sec-4" },
    update: { title: "Module 4: Advanced GenAI — RAG & Agents", position: 4 },
    create: { id: "ai-sec-4", courseId: aiCourse.id, title: "Module 4: Advanced GenAI — RAG & Agents", position: 4 },
  });

  await prisma.lesson.upsert({ where: { id: "ai-l-10" }, update: {}, create: {
    id: "ai-l-10", sectionId: aiS4.id, position: 1, isPreview: false,
    title: "LLM Customization: Fine-tuning & SFT",
    description: "When to fine-tune vs prompt, supervised fine-tuning (SFT), data preparation, and size optimization techniques like quantization.",
    videoUrl: AI_VIDEO, durationMins: 33,
    content: {
      startSec: ts("19:51:49"), endSec: ts("20:26:04"),
      notes: "Fine-tuning adjusts model weights on your own data. Quantization reduces model size for cheaper inference. Usually prompting + RAG is enough before needing fine-tuning.",
      transcript: [
        { time: "19:51:49", text: "LLM customization means adapting a pre-trained model to your specific domain or task." },
        { time: "19:52:35", text: "SFT (Supervised Fine-Tuning) trains the model on your own labeled input-output examples." },
        { time: "19:56:25", text: "Size optimization: quantization reduces model weights from 32-bit to 4-bit floats, dramatically cutting memory usage." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-11" }, update: {}, create: {
    id: "ai-l-11", sectionId: aiS4.id, position: 2, isPreview: false,
    title: "RAG — Retrieval Augmented Generation",
    description: "Build a RAG pipeline: embeddings, vector stores, semantic search, and grounding LLM responses in your own knowledge base.",
    videoUrl: AI_VIDEO, durationMins: 115,
    content: {
      startSec: ts("20:26:04"), endSec: ts("22:21:19"),
      notes: "RAG = Retrieval + Generation. Rather than fine-tuning, you retrieve relevant documents and inject them into the prompt context at inference time.",
      transcript: [
        { time: "20:26:04", text: "RAG solves the hallucination problem by grounding the LLM in your own verified knowledge base." },
        { time: "20:45:00", text: "Step 1: Chunk your documents. Step 2: Embed them as vectors. Step 3: Store in a vector database." },
        { time: "21:30:00", text: "At query time, embed the user's question, find similar chunks, and inject them into the LLM prompt." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "ai-l-12" }, update: {}, create: {
    id: "ai-l-12", sectionId: aiS4.id, position: 3, isPreview: false,
    title: "AI Agents",
    description: "Build autonomous AI agents that plan, use tools, and complete multi-step tasks without human intervention.",
    videoUrl: AI_VIDEO, durationMins: 8,
    content: {
      startSec: ts("22:21:19"), endSec: ts("22:28:47"),
      notes: "Agents use LLMs as a reasoning engine to decide which tools to call, in what order, to complete a goal. ReAct (Reason + Act) is the foundational pattern.",
      transcript: [
        { time: "22:21:19", text: "An agent reasons about a goal and autonomously decides which tools to call to accomplish it." },
        { time: "22:24:00", text: "The ReAct pattern: Reason about the situation, then Act by calling a tool, observe the output, and repeat." },
        { time: "22:27:00", text: "Agents can browse the web, write and run code, and interact with APIs — all without human intervention." },
      ],
    },
  }});

  // ════════════════════════════════════════════════════════════════════════
  // COURSE 2: FRONTEND FUNDAMENTALS (FREE)
  // Source: freeCodeCamp "Front End Developer Learning Path" playlist
  // Playlist: https://www.youtube.com/playlist?list=PLWKjhJtqVAbmMuZ3saqRIBimAKIMYkt0E
  // ════════════════════════════════════════════════════════════════════════
  const feCourse = await prisma.course.upsert({
    where: { slug: "frontend-fundamentals-free" },
    update: { isFree: true, isPublished: true },
    create: {
      slug: "frontend-fundamentals-free",
      title: "Frontend Fundamentals (Free)",
      shortDescription: "The complete freeCodeCamp Frontend Learning Path — HTML, CSS, JavaScript, React, Git & more.",
      longDescription:
        "22 full-length tutorials from freeCodeCamp covering everything a front-end developer needs: HTML, CSS, JavaScript, VS Code, Git, React, TypeScript, Next.js, and more. Each lesson is a complete, standalone video course.",
      category: "Development",
      level: CourseLevel.BEGINNER,
      instructorName: "freeCodeCamp",
      oneMonthPrice: 0, threeMonthPrice: 0, sixMonthPrice: 0,
      isFree: true, isPublished: true,
    },
  });

  // ── Module 1: The Web Foundations ─────────────────────────────────────
  const feS1 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-1" },
    update: { title: "Module 1: Web Foundations", position: 1 },
    create: { id: "fe-sec-1", courseId: feCourse.id, title: "Module 1: Web Foundations", position: 1 },
  });

  const feVideos = [
    {
      id: "fe-l-01", pos: 1, sec: "fe-sec-1", preview: true,
      title: "Front End Developer Roadmap",
      desc: "An overview of all the technologies you need to learn to become a front-end developer, and in what order to tackle them.",
      vid: "9He4UBLyk8Y", mins: 12,
      notes: "This video is your roadmap. Bookmark it and return to it as you progress through the course.",
    },
    {
      id: "fe-l-02", pos: 2, sec: "fe-sec-1", preview: false,
      title: "HTML Tutorial – Website Crash Course for Beginners",
      desc: "A complete HTML crash course: document structure, semantic elements, forms, tables, links, images, and more.",
      vid: "916GWv2Qs08", mins: 45,
      notes: "HTML is the skeleton of every webpage. Focus on semantic elements — they matter for SEO and accessibility.",
    },
    {
      id: "fe-l-03", pos: 3, sec: "fe-sec-1", preview: false,
      title: "CSS Tutorial – Full Course for Beginners",
      desc: "An 11-hour complete CSS course: from selectors and colors to Flexbox, Grid, animations, and responsive design.",
      vid: "OXGznpKZ_sA", mins: 668,
      notes: "CSS is vast. Master the box model, Flexbox, and Grid first — these cover 90% of real-world front-end work.",
    },
    {
      id: "fe-l-04", pos: 4, sec: "fe-sec-1", preview: false,
      title: "Visual Studio Code Crash Course",
      desc: "Master VS Code: keyboard shortcuts, extensions, integrated terminal, debugging, and Git integration.",
      vid: "WPqXP_kLzpo", mins: 92,
      notes: "A good editor setup dramatically speeds up development. Learn these shortcuts now and save thousands of hours.",
    },
  ];

  // ── Module 2: JavaScript & Logic ─────────────────────────────────────
  const feS2 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-2" },
    update: { title: "Module 2: JavaScript & Logic", position: 2 },
    create: { id: "fe-sec-2", courseId: feCourse.id, title: "Module 2: JavaScript & Logic", position: 2 },
  });

  const feVideos2 = [
    {
      id: "fe-l-05", pos: 1, sec: "fe-sec-2", preview: false,
      title: "JavaScript Programming – Full Course",
      desc: "A 7.5-hour comprehensive JavaScript course: variables, functions, DOM, async/await, fetch API, and projects.",
      vid: "jS4aFq5-91M", mins: 464,
      notes: "JavaScript makes pages interactive. Focus on understanding the event loop, closures, and async programming.",
    },
    {
      id: "fe-l-06", pos: 2, sec: "fe-sec-2", preview: false,
      title: "Prompt Engineering Tutorial – Master ChatGPT and LLMs",
      desc: "Learn to write effective prompts for ChatGPT, Claude, and other LLMs to boost your dev productivity.",
      vid: "_ZvnD73m40o", mins: 41,
      notes: "As a developer, using AI tools effectively is a multiplier on your productivity. Master prompts to write better code faster.",
    },
    {
      id: "fe-l-07", pos: 3, sec: "fe-sec-2", preview: false,
      title: "Build a Simple Website with HTML, CSS, JavaScript",
      desc: "End-to-end project: build a complete real-world website applying everything from Modules 1 and 2 together.",
      vid: "krfUjg0S2uI", mins: 432,
      notes: "Project-based learning cements concepts. Build this fully before moving to frameworks.",
    },
    {
      id: "fe-l-08", pos: 4, sec: "fe-sec-2", preview: false,
      title: "Web App Tutorial – JavaScript, Mobile First, Accessibility",
      desc: "Build an accessible, mobile-first web app using vanilla JavaScript — no frameworks needed.",
      vid: "y51Cv4wnsPw", mins: 121,
      notes: "Mobile-first means designing for small screens first, then scaling up. Accessibility benefits all users.",
    },
  ];

  // ── Module 3: Tooling & Frameworks ────────────────────────────────────
  const feS3 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-3" },
    update: { title: "Module 3: Tools, Git & CSS Frameworks", position: 3 },
    create: { id: "fe-sec-3", courseId: feCourse.id, title: "Module 3: Tools, Git & CSS Frameworks", position: 3 },
  });

  const feVideos3 = [
    {
      id: "fe-l-09", pos: 1, sec: "fe-sec-3", preview: false,
      title: "Git and GitHub for Beginners – Crash Course",
      desc: "Learn version control with Git: commit, branch, merge, pull requests, and collaborating on GitHub.",
      vid: "RGOj5yH7evk", mins: 68,
      notes: "Git is non-negotiable for every developer. Branching and pull requests are the heart of team collaboration.",
    },
    {
      id: "fe-l-10", pos: 2, sec: "fe-sec-3", preview: false,
      title: "Learn Bootstrap 5 and SASS",
      desc: "Build responsive sites faster with Bootstrap 5 and write maintainable CSS with SASS variables and mixins.",
      vid: "iJKCj8uAHz8", mins: 302,
      notes: "Bootstrap lets you prototype quickly. SASS makes CSS maintainable at scale — especially useful in large teams.",
    },
    {
      id: "fe-l-11", pos: 3, sec: "fe-sec-3", preview: false,
      title: "Learn Tailwind CSS – Course for Beginners",
      desc: "Utility-first CSS with Tailwind: apply styles directly in HTML without writing custom CSS files.",
      vid: "ft30zcMlFao", mins: 252,
      notes: "Tailwind is utility-first — every class does one thing. It enforces consistency and speeds up UI development dramatically.",
    },
    {
      id: "fe-l-12", pos: 4, sec: "fe-sec-3", preview: false,
      title: "Learn Vite – Frontend Build Tool Course",
      desc: "Use Vite to set up fast, modern front-end development environments with Hot Module Replacement and bundling.",
      vid: "VAeRhmpcWEQ", mins: 91,
      notes: "Vite is the new standard for front-end tooling. It's dramatically faster than webpack for development builds.",
    },
  ];

  // ── Module 4: React, Testing & Advanced ──────────────────────────────
  const feS4 = await prisma.courseSection.upsert({
    where: { id: "fe-sec-4" },
    update: { title: "Module 4: React, TypeScript & Beyond", position: 4 },
    create: { id: "fe-sec-4", courseId: feCourse.id, title: "Module 4: React, TypeScript & Beyond", position: 4 },
  });

  const feVideos4 = [
    {
      id: "fe-l-13", pos: 1, sec: "fe-sec-4", preview: false,
      title: "Learn React 18 with Redux Toolkit",
      desc: "A mastery-level 14-hour React course: hooks, context, Redux Toolkit, and building production-quality apps.",
      vid: "2-crBg6wpp0", mins: 851,
      notes: "React is the most in-demand front-end skill. Hooks (useState, useEffect, useCallback) are the foundation of modern React.",
    },
    {
      id: "fe-l-14", pos: 2, sec: "fe-sec-4", preview: false,
      title: "Testing JavaScript with Cypress – Full Course",
      desc: "Write end-to-end tests for web apps using Cypress: selectors, assertions, and CI integration.",
      vid: "u8vMu7viCm8", mins: 159,
      notes: "Testing prevents regressions. E2E tests simulate real user flows — the most valuable kind of automated test.",
    },
    {
      id: "fe-l-15", pos: 3, sec: "fe-sec-4", preview: false,
      title: "React Testing Course for Beginners",
      desc: "Unit and integration testing for React components with React Testing Library and Jest.",
      vid: "8vfQ6SWBZ-U", mins: 124,
      notes: "Test behavior, not implementation. React Testing Library encourages testing the way users actually use your app.",
    },
    {
      id: "fe-l-16", pos: 4, sec: "fe-sec-4", preview: false,
      title: "Learn TypeScript – Full Tutorial",
      desc: "A complete TypeScript course: types, interfaces, generics, enums, and integrating TypeScript into React projects.",
      vid: "30LWjhZzg50", mins: 286,
      notes: "TypeScript catches bugs at compile time. In large codebases, it is essentially mandatory for maintainability.",
    },
    {
      id: "fe-l-17", pos: 5, sec: "fe-sec-4", preview: false,
      title: "GraphQL Course for Beginners",
      desc: "Learn the query language for APIs: schemas, resolvers, queries, mutations, and using GraphQL with React.",
      vid: "5199E50O7SI", mins: 89,
      notes: "GraphQL lets clients request exactly the data they need — no over-fetching, no under-fetching.",
    },
    {
      id: "fe-l-18", pos: 6, sec: "fe-sec-4", preview: false,
      title: "Next.js React Framework Course",
      desc: "Build full-stack apps with Next.js: App Router, Server Components, Server Actions, SSR, and deployment.",
      vid: "KjY94sAKLlw", mins: 287,
      notes: "Next.js is the most popular React framework. Server Components reduce client JavaScript and improve performance.",
    },
    {
      id: "fe-l-19", pos: 7, sec: "fe-sec-4", preview: false,
      title: "React Native Course",
      desc: "Build cross-platform iOS and Android apps with React Native using the same React skills you already have.",
      vid: "obH0Po_RdWk", mins: 280,
      notes: "React Native code shares ~80% logic with web React. Learning it multiplies your value as a developer.",
    },
    {
      id: "fe-l-20", pos: 8, sec: "fe-sec-4", preview: false,
      title: "Astro Web Framework Crash Course",
      desc: "Build ultra-fast content sites with Astro: islands architecture, Markdown, MDX, and static site generation.",
      vid: "e-hTm5VmofI", mins: 76,
      notes: "Astro ships zero JavaScript by default. Perfect for blogs, docs, and marketing sites where performance matters most.",
    },
    {
      id: "fe-l-21", pos: 9, sec: "fe-sec-4", preview: false,
      title: "OWASP API Security Top 10 Course",
      desc: "Learn the most critical API security vulnerabilities and how to protect your apps against them.",
      vid: "YYe0FdfdgDU", mins: 87,
      notes: "Security is every developer's responsibility. The OWASP Top 10 is the standard reference for web vulnerabilities.",
    },
    {
      id: "fe-l-22", pos: 10, sec: "fe-sec-4", preview: false,
      title: "How does the Internet Work?",
      desc: "Understand the full internet stack: DNS, HTTP, TCP/IP, HTTPS, browsers, and how your code gets to users.",
      vid: "zN8YNNHcaZc", mins: 102,
      notes: "Every front-end developer should understand what happens when a user types a URL and presses Enter.",
    },
  ];

  // Create all frontend lessons
  const allFeLessons = [
    ...feVideos.map(v => ({ ...v, sectionKey: "fe-sec-1" })),
    ...feVideos2.map(v => ({ ...v, sectionKey: "fe-sec-2" })),
    ...feVideos3.map(v => ({ ...v, sectionKey: "fe-sec-3" })),
    ...feVideos4.map(v => ({ ...v, sectionKey: "fe-sec-4" })),
  ];

  const sectionMap: Record<string, string> = {
    "fe-sec-1": feS1.id,
    "fe-sec-2": feS2.id,
    "fe-sec-3": feS3.id,
    "fe-sec-4": feS4.id,
  };

  for (const l of allFeLessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: {},
      create: {
        id: l.id,
        sectionId: sectionMap[l.sec],
        position: l.pos,
        isPreview: l.preview,
        title: l.title,
        description: l.desc,
        videoUrl: `https://www.youtube.com/watch?v=${l.vid}`,
        durationMins: l.mins,
        content: {
          startSec: 0,
          notes: l.notes,
          transcript: [],
        },
      },
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // COURSE 3: BACKEND BASICS WITH NODE.JS (FREE)
  // Source: "Intro to Backend Web Development – Node.js & Express Tutorial"
  // URL:    https://www.youtube.com/watch?v=KOutPbKc9UM
  // Total:  ~1 hour 11 minutes (4,303 seconds)
  // Divided based on logical content progression
  // ════════════════════════════════════════════════════════════════════════
  const BE_VIDEO = "https://www.youtube.com/watch?v=KOutPbKc9UM";

  const beCourse = await prisma.course.upsert({
    where: { slug: "backend-basics-free" },
    update: { isFree: true, isPublished: true },
    create: {
      slug: "backend-basics-free",
      title: "Backend Basics with Node.js (Free)",
      shortDescription: "Build a real backend with Node.js, Express & MongoDB. Completely free.",
      longDescription:
        "Build a production-style backend from scratch using Node.js, Express.js, and MongoDB. This course by freeCodeCamp covers server setup, REST API design, routing, middleware, and full CRUD database operations.",
      category: "Development",
      level: CourseLevel.BEGINNER,
      instructorName: "freeCodeCamp",
      oneMonthPrice: 0, threeMonthPrice: 0, sixMonthPrice: 0,
      isFree: true, isPublished: true,
    },
  });

  // ── Module 1: Introduction & Setup ────────────────────────────────────
  const beS1 = await prisma.courseSection.upsert({
    where: { id: "be-sec-1" },
    update: { title: "Module 1: Introduction & Setup", position: 1 },
    create: { id: "be-sec-1", courseId: beCourse.id, title: "Module 1: Introduction & Setup", position: 1 },
  });

  await prisma.lesson.upsert({ where: { id: "be-l-01" }, update: {}, create: {
    id: "be-l-01", sectionId: beS1.id, position: 1, isPreview: true,
    title: "What is Backend Development?",
    description: "Frontend vs backend explained, what a server does, and the role of Node.js, Express, and MongoDB in a modern web stack.",
    videoUrl: BE_VIDEO, durationMins: 8,
    content: {
      startSec: 0, endSec: 480,
      notes: "Backend = the server-side logic that handles data, authentication, and business rules. The frontend is what users see; the backend is what makes it work.",
      transcript: [
        { time: "0:00", text: "In this course we'll build a backend using Node.js, Express, and MongoDB." },
        { time: "1:30", text: "The backend handles requests from the browser, processes business logic, and talks to the database." },
        { time: "4:00", text: "Node.js runs JavaScript on the server. Express is a framework that makes building APIs fast." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "be-l-02" }, update: {}, create: {
    id: "be-l-02", sectionId: beS1.id, position: 2, isPreview: false,
    title: "Setting Up Node.js & Your Project",
    description: "Install Node.js, initialize an NPM project, install Express, and create your first server file.",
    videoUrl: BE_VIDEO, durationMins: 7,
    content: {
      startSec: 480, endSec: 900,
      notes: "Run 'node -v' and 'npm -v' to verify installation. Always add node_modules to .gitignore.",
      transcript: [
        { time: "8:00", text: "Download Node.js from nodejs.org. The LTS version is recommended for stability." },
        { time: "9:30", text: "Create a new folder, open your terminal, and run 'npm init -y' to create package.json." },
        { time: "11:00", text: "Install Express with 'npm install express'. Create index.js and require Express." },
      ],
    },
  }});

  // ── Module 2: Building with Express ──────────────────────────────────
  const beS2 = await prisma.courseSection.upsert({
    where: { id: "be-sec-2" },
    update: { title: "Module 2: Express.js & REST APIs", position: 2 },
    create: { id: "be-sec-2", courseId: beCourse.id, title: "Module 2: Express.js & REST APIs", position: 2 },
  });

  await prisma.lesson.upsert({ where: { id: "be-l-03" }, update: {}, create: {
    id: "be-l-03", sectionId: beS2.id, position: 1, isPreview: false,
    title: "HTTP & Building Your First Server",
    description: "How HTTP requests and responses work, creating an Express server, and handling GET routes.",
    videoUrl: BE_VIDEO, durationMins: 10,
    content: {
      startSec: 900, endSec: 1500,
      notes: "HTTP is stateless — each request is independent. REST APIs use HTTP verbs (GET, POST, PUT, DELETE) to map to CRUD operations.",
      transcript: [
        { time: "15:00", text: "HTTP is the protocol browsers use to talk to servers. Every request has a method, URL, headers, and body." },
        { time: "17:00", text: "app.get('/api', (req, res) => { res.json({ message: 'Hello World' }); }) — your first API endpoint." },
        { time: "19:00", text: "app.listen(3000) starts the server. Visit localhost:3000 in your browser to test it." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "be-l-04" }, update: {}, create: {
    id: "be-l-04", sectionId: beS2.id, position: 2, isPreview: false,
    title: "Express Routing & Middleware",
    description: "Route parameters, query strings, POST requests with body parsing, and the request-response middleware pipeline.",
    videoUrl: BE_VIDEO, durationMins: 15,
    content: {
      startSec: 1500, endSec: 2400,
      notes: "Middleware is a function that runs between request and response. Order matters — place middleware BEFORE route handlers.",
      transcript: [
        { time: "25:00", text: "Route parameters: app.get('/users/:id', ...) captures the :id from the URL as req.params.id." },
        { time: "28:00", text: "Use express.json() middleware to parse JSON request bodies: app.use(express.json())." },
        { time: "32:00", text: "Middleware chain: each function calls next() to pass control to the next handler." },
      ],
    },
  }});

  // ── Module 3: MongoDB & CRUD Operations ──────────────────────────────
  const beS3 = await prisma.courseSection.upsert({
    where: { id: "be-sec-3" },
    update: { title: "Module 3: MongoDB & Database CRUD", position: 3 },
    create: { id: "be-sec-3", courseId: beCourse.id, title: "Module 3: MongoDB & Database CRUD", position: 3 },
  });

  await prisma.lesson.upsert({ where: { id: "be-l-05" }, update: {}, create: {
    id: "be-l-05", sectionId: beS3.id, position: 1, isPreview: false,
    title: "Introduction to MongoDB & Mongoose",
    description: "NoSQL vs SQL, setting up MongoDB Atlas, connecting from Express with Mongoose, and defining schemas.",
    videoUrl: BE_VIDEO, durationMins: 15,
    content: {
      startSec: 2400, endSec: 3300,
      notes: "MongoDB stores data as JSON-like documents, not rows and tables. Mongoose adds schemas and validation on top of the raw MongoDB driver.",
      transcript: [
        { time: "40:00", text: "MongoDB is a NoSQL database that stores data as flexible JSON documents instead of fixed rows and columns." },
        { time: "43:00", text: "Create a free MongoDB Atlas cluster. Copy the connection string and store it in a .env file." },
        { time: "46:00", text: "Mongoose.connect() establishes the connection. Define a Schema to enforce the shape of your documents." },
      ],
    },
  }});

  await prisma.lesson.upsert({ where: { id: "be-l-06" }, update: {}, create: {
    id: "be-l-06", sectionId: beS3.id, position: 2, isPreview: false,
    title: "Full CRUD Operations",
    description: "Create, Read, Update, and Delete data in MongoDB through Express API routes from start to finish.",
    videoUrl: BE_VIDEO, durationMins: 17,
    content: {
      startSec: 3300, endSec: 4303,
      notes: "CRUD = Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE). These four operations are the foundation of every data-driven API.",
      transcript: [
        { time: "55:00", text: "POST /users — create a new user: const user = new User(req.body); await user.save();" },
        { time: "58:00", text: "GET /users/:id — read one user: const user = await User.findById(req.params.id);" },
        { time: "1:01:00", text: "PUT /users/:id — update: await User.findByIdAndUpdate(id, req.body, { new: true });" },
        { time: "1:05:00", text: "DELETE /users/:id — remove: await User.findByIdAndDelete(req.params.id);" },
      ],
    },
  }});

  // ════════════════════════════════════════════════════════════════════════
  // PAID COURSES (keep existing structure)
  // ════════════════════════════════════════════════════════════════════════
  await prisma.course.upsert({
    where: { slug: "complete-ui-ux-design-bootcamp" },
    update: {},
    create: {
      slug: "complete-ui-ux-design-bootcamp",
      title: "Complete UI/UX Design Bootcamp",
      shortDescription: "Master the art of designing beautiful and functional user interfaces.",
      longDescription: "Covers design principles, wireframing, and high-fidelity prototyping in Figma.",
      category: "Design",
      level: CourseLevel.BEGINNER,
      instructorName: "Jessica Willis",
      oneMonthPrice: 999, threeMonthPrice: 2499, sixMonthPrice: 4499,
      isFree: false, isPublished: true,
    },
  });

  await prisma.course.upsert({
    where: { slug: "react-nextjs-mastery-2026" },
    update: {},
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

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
