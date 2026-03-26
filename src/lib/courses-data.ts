export type Course = {
  slug: string;
  title: string;
  category: "Design" | "Development" | "AI/ML" | "Business" | "Marketing";
  instructor: string;
  duration: string;
  lessons: number;
  students: string;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  emoji: string;
  previewVideoUrl: string;
  shortDescription: string;
  longDescription: string;
  skills: string[];
  isFree?: boolean;
  price: {
    oneMonth: number;
    threeMonth: number;
    sixMonth: number;
  };
};

export const coursesData: Course[] = [
  // ── FREE COURSES ──────────────────────────────────────────────────────────
  {
    slug: "frontend-fundamentals-free",
    title: "Frontend Fundamentals (Free)",
    category: "Development",
    instructor: "Alex Chen",
    duration: "18h",
    lessons: 42,
    students: "23.1K",
    rating: 4.9,
    level: "Beginner",
    emoji: "🌐",
    isFree: true,
    previewVideoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU",
    shortDescription: "Learn HTML, CSS & JavaScript from scratch. Completely free.",
    longDescription:
      "Build a solid foundation with semantic HTML5, modern CSS layouts (Flexbox, Grid), and JavaScript ES6+. By the end, you'll create responsive websites from scratch with no prior experience needed.",
    skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    price: { oneMonth: 0, threeMonth: 0, sixMonth: 0 },
  },
  {
    slug: "backend-basics-free",
    title: "Backend Basics with Node.js (Free)",
    category: "Development",
    instructor: "Ryan Torres",
    duration: "14h",
    lessons: 35,
    students: "18.6K",
    rating: 4.8,
    level: "Beginner",
    emoji: "⚙️",
    isFree: true,
    previewVideoUrl: "https://www.youtube.com/embed/Oe421EPjeBE",
    shortDescription: "Build REST APIs with Node.js and Express. No cost, no catch.",
    longDescription:
      "Understand the server side: HTTP fundamentals, REST API design, Express.js routing, middleware, database connections with MongoDB, and basic authentication. Learn what powers every web application.",
    skills: ["Node.js", "Express", "REST APIs", "MongoDB"],
    price: { oneMonth: 0, threeMonth: 0, sixMonth: 0 },
  },
  {
    slug: "gen-ai-essentials-free",
    title: "Generative AI Essentials (Free)",
    category: "AI/ML",
    instructor: "Dr. Sarah Park",
    duration: "10h",
    lessons: 24,
    students: "31.4K",
    rating: 4.9,
    level: "All Levels",
    emoji: "🤖",
    isFree: true,
    previewVideoUrl: "https://www.youtube.com/embed/aircAruvnKk",
    shortDescription: "Understand LLMs, prompt engineering & AI tools. Completely free.",
    longDescription:
      "Demystify generative AI: how LLMs work, prompt engineering patterns, RAG pipelines, AI agents, and practical tools like ChatGPT, Claude, and Gemini. Build real AI-powered mini-projects by the end.",
    skills: ["Prompt Engineering", "LLMs", "AI Agents", "RAG"],
    price: { oneMonth: 0, threeMonth: 0, sixMonth: 0 },
  },
  // ── PAID COURSES ──────────────────────────────────────────────────────────
  {
    slug: "complete-ui-ux-design-bootcamp",
    title: "Complete UI/UX Design Bootcamp",
    category: "Design",
    instructor: "Jessica Willis",
    duration: "48h",
    lessons: 120,
    students: "12.4K",
    rating: 4.9,
    level: "Beginner",
    emoji: "🎨",
    previewVideoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
    shortDescription: "Master UI/UX from fundamentals to portfolio-ready projects.",
    longDescription:
      "Learn wireframing, visual systems, user flows, prototyping, usability testing, and complete end-to-end case studies. Build portfolio projects reviewed by industry mentors.",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    price: { oneMonth: 89, threeMonth: 229, sixMonth: 419 },
  },
  {
    slug: "react-nextjs-mastery-2026",
    title: "React & Next.js Mastery 2026",
    category: "Development",
    instructor: "Alex Chen",
    duration: "62h",
    lessons: 155,
    students: "9.8K",
    rating: 4.8,
    level: "Intermediate",
    emoji: "⚛️",
    previewVideoUrl: "https://www.youtube.com/embed/37vxWr0WgQk",
    shortDescription: "Build production-grade React and Next.js apps with TypeScript.",
    longDescription:
      "Cover React architecture, App Router, server components, API routes, performance optimization, and deployment workflows for real-world production apps.",
    skills: ["React", "Next.js", "TypeScript", "API Design"],
    price: { oneMonth: 99, threeMonth: 259, sixMonth: 479 },
  },
  {
    slug: "ai-machine-learning-for-designers",
    title: "AI & Machine Learning for Designers",
    category: "AI/ML",
    instructor: "Dr. Sarah Park",
    duration: "40h",
    lessons: 96,
    students: "7.2K",
    rating: 4.9,
    level: "All Levels",
    emoji: "🤖",
    previewVideoUrl: "https://www.youtube.com/embed/aircAruvnKk",
    shortDescription: "Use modern AI workflows to improve design outcomes.",
    longDescription:
      "Understand practical ML concepts, prompt engineering, AI-assisted UX research, content generation pipelines, and prototyping with LLM-powered interfaces.",
    skills: ["Prompt Design", "AI Workflows", "LLMs", "Automation"],
    price: { oneMonth: 119, threeMonth: 309, sixMonth: 569 },
  },
  {
    slug: "mobile-app-design-with-figma",
    title: "Mobile App Design with Figma",
    category: "Design",
    instructor: "Marcus Lee",
    duration: "32h",
    lessons: 80,
    students: "6.1K",
    rating: 4.7,
    level: "Beginner",
    emoji: "📱",
    previewVideoUrl: "https://www.youtube.com/embed/FTFaQWZBqQ8",
    shortDescription: "Design polished mobile interfaces and interactions in Figma.",
    longDescription:
      "Design iOS and Android app flows, create reusable components, build interactive prototypes, and validate UI decisions with rapid usability feedback.",
    skills: ["Mobile UI", "Figma", "Interaction Design", "Design Tokens"],
    price: { oneMonth: 79, threeMonth: 199, sixMonth: 359 },
  },
  {
    slug: "full-stack-development-accelerator",
    title: "Full-Stack Development Accelerator",
    category: "Development",
    instructor: "Ryan Torres",
    duration: "80h",
    lessons: 200,
    students: "11.3K",
    rating: 4.8,
    level: "Advanced",
    emoji: "🔥",
    previewVideoUrl: "https://www.youtube.com/embed/2OHbjep_WjQ",
    shortDescription: "Build and deploy full-stack applications from scratch.",
    longDescription:
      "Create scalable systems with backend APIs, databases, auth, CI/CD, cloud deployment, and monitoring. Ship real projects suitable for hiring pipelines.",
    skills: ["Node.js", "Databases", "Cloud Deploy", "System Design"],
    price: { oneMonth: 149, threeMonth: 389, sixMonth: 719 },
  },
  {
    slug: "product-management-fundamentals",
    title: "Product Management Fundamentals",
    category: "Business",
    instructor: "Emily Watson",
    duration: "28h",
    lessons: 70,
    students: "4.8K",
    rating: 4.6,
    level: "Beginner",
    emoji: "📊",
    previewVideoUrl: "https://www.youtube.com/embed/4vA-_8x3r8U",
    shortDescription: "Learn product strategy, roadmapping, and execution basics.",
    longDescription:
      "Master problem discovery, opportunity sizing, roadmap prioritization, stakeholder communication, and measuring product impact with practical templates.",
    skills: ["Product Strategy", "Roadmapping", "Agile", "Metrics"],
    price: { oneMonth: 69, threeMonth: 179, sixMonth: 319 },
  },
  {
    slug: "advanced-motion-design-framer",
    title: "Advanced Motion Design with Framer",
    category: "Design",
    instructor: "Nina Kaur",
    duration: "24h",
    lessons: 58,
    students: "3.6K",
    rating: 4.7,
    level: "Intermediate",
    emoji: "✨",
    previewVideoUrl: "https://www.youtube.com/embed/1vX4QX0nYlM",
    shortDescription: "Create immersive UI motion with Framer and modern principles.",
    longDescription:
      "Design smooth, performant motion systems for web interfaces, build reusable animation components, and craft premium interaction patterns.",
    skills: ["Framer Motion", "Micro-interactions", "Animation Systems", "UX Motion"],
    price: { oneMonth: 74, threeMonth: 189, sixMonth: 339 },
  },
  {
    slug: "python-for-data-analysis",
    title: "Python for Data Analysis",
    category: "AI/ML",
    instructor: "Arjun Patel",
    duration: "36h",
    lessons: 92,
    students: "8.1K",
    rating: 4.8,
    level: "Beginner",
    emoji: "🐍",
    previewVideoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8",
    shortDescription: "Analyze, visualize, and model real datasets with Python.",
    longDescription:
      "Work through practical data analysis workflows including preprocessing, visualization, exploratory analysis, and basic predictive modeling.",
    skills: ["Python", "Pandas", "Data Visualization", "Statistics"],
    price: { oneMonth: 84, threeMonth: 219, sixMonth: 399 },
  },
  {
    slug: "growth-marketing-playbook",
    title: "Growth Marketing Playbook",
    category: "Marketing",
    instructor: "Leah Kim",
    duration: "22h",
    lessons: 54,
    students: "5.2K",
    rating: 4.6,
    level: "All Levels",
    emoji: "📈",
    previewVideoUrl: "https://www.youtube.com/embed/zMIt7w6QW7s",
    shortDescription: "Build repeatable growth loops across channels and funnels.",
    longDescription:
      "Plan acquisition campaigns, optimize conversion funnels, run experiments, and track ROI with structured growth frameworks used by top startups.",
    skills: ["Performance Marketing", "Funnel Design", "A/B Testing", "Analytics"],
    price: { oneMonth: 72, threeMonth: 185, sixMonth: 329 },
  },
  {
    slug: "system-design-for-frontend-engineers",
    title: "System Design for Frontend Engineers",
    category: "Development",
    instructor: "Diego Martins",
    duration: "30h",
    lessons: 76,
    students: "4.4K",
    rating: 4.7,
    level: "Advanced",
    emoji: "🧩",
    previewVideoUrl: "https://www.youtube.com/embed/bUHFg8CZFws",
    shortDescription: "Architect scalable, maintainable frontend systems.",
    longDescription:
      "Learn architecture decisions, state modeling, caching, rendering strategies, and performance trade-offs for complex frontend applications.",
    skills: ["Frontend Architecture", "Performance", "State Management", "Scalability"],
    price: { oneMonth: 94, threeMonth: 245, sixMonth: 449 },
  },
  {
    slug: "ux-research-interview-lab",
    title: "UX Research Interview Lab",
    category: "Design",
    instructor: "Olivia Harper",
    duration: "18h",
    lessons: 42,
    students: "2.9K",
    rating: 4.8,
    level: "Intermediate",
    emoji: "🧠",
    previewVideoUrl: "https://www.youtube.com/embed/3Qz7x2M8y0E",
    shortDescription: "Run user interviews and convert insights into product actions.",
    longDescription:
      "Design research plans, conduct high-quality interviews, synthesize findings, and create actionable reports to influence roadmap decisions.",
    skills: ["User Interviews", "Research Ops", "Insight Synthesis", "UX Strategy"],
    price: { oneMonth: 68, threeMonth: 169, sixMonth: 299 },
  },
  {
    slug: "no-code-ai-automation",
    title: "No-Code AI Automation",
    category: "AI/ML",
    instructor: "Kevin Roy",
    duration: "20h",
    lessons: 48,
    students: "6.8K",
    rating: 4.7,
    level: "All Levels",
    emoji: "⚙️",
    previewVideoUrl: "https://www.youtube.com/embed/4M9YQ8jX6gA",
    shortDescription: "Automate workflows with no-code tools and AI integrations.",
    longDescription:
      "Build practical AI automations using popular no-code platforms, connect APIs, create agents, and deploy reusable productivity systems.",
    skills: ["No-Code", "AI Agents", "Automation", "API Integrations"],
    price: { oneMonth: 77, threeMonth: 199, sixMonth: 359 },
  },
];

export function getCourseBySlug(slug: string) {
  return coursesData.find((course) => course.slug === slug);
}

