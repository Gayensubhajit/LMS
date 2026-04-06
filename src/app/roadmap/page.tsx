"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Lock,
  CheckCircle,
  Circle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Zap,
  Star as StarIcon,
  PlayCircle,
  X,
  Loader2,
  Search,
} from "lucide-react";
import { Montserrat } from "next/font/google";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import { backendRequest } from "@/lib/backend-client";

const montserrat = Montserrat({ subsets: ["latin"] });

export type RoadmapStepStatus = "locked" | "current" | "done";

interface BackendRoadmapResponse {
  [pathId: string]: {
    stages: {
      stepNo: number;
      courseSlug: string;
      status: RoadmapStepStatus;
      progressPercent: number;
    }[];
  };
}

// ── Data ──────────────────────────────────────────────────────────────────
const PATHS = [
  {
    id: "design",
    emoji: "🎨",
    label: "UI/UX Designer",
    description: "From sketch to pixel-perfect product designer",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.25)",
    border: "rgba(244,114,182,0.35)",
    bg: "rgba(244,114,182,0.08)",
    duration: "6 months",
    jobs: "Product Designer · UX Lead · Design Systems",
    steps: [
      {
        no: 1,
        title: "Design Foundations",
        status: "done",
        weeks: "Weeks 1–2",
        desc: "Visual hierarchy, typography, colour theory, and Gestalt principles.",
        skills: ["Typography", "Colour Theory", "Layout"],
        courseSlug: "complete-ui-ux-design-bootcamp",
      },
      {
        no: 2,
        title: "Figma & Wireframing",
        status: "done",
        weeks: "Weeks 3–5",
        desc: "Master Figma components, auto-layout, and rapid low-fidelity wireframing.",
        skills: ["Figma", "Wireframing", "Components"],
        courseSlug: "complete-ui-ux-design-bootcamp",
      },
      {
        no: 3,
        title: "UX Research",
        status: "current",
        weeks: "Weeks 6–8",
        desc: "User interviews, affinity mapping, and insight-driven design decisions.",
        skills: ["User Interviews", "Research Ops", "Synthesis"],
        courseSlug: "ux-research-interview-lab",
      },
      {
        no: 4,
        title: "Prototyping & Mobile UI",
        status: "locked",
        weeks: "Weeks 9–11",
        desc: "Interactive prototypes, mobile-first design patterns, and design tokens.",
        skills: ["Prototyping", "Mobile UI", "Design Tokens"],
        courseSlug: "mobile-app-design-with-figma",
      },
      {
        no: 5,
        title: "Motion & Advanced Framer",
        status: "locked",
        weeks: "Weeks 12–16",
        desc: "Micro-interactions, transition systems, and deploying with Framer.",
        skills: ["Framer Motion", "Micro-interactions", "Animation"],
        courseSlug: "advanced-motion-design-framer",
      },
      {
        no: 6,
        title: "Portfolio & Job Ready",
        status: "locked",
        weeks: "Weeks 17–24",
        desc: "Case studies, portfolio site, mock interviews, and offer negotiation.",
        skills: ["Case Studies", "Portfolio", "Interview Prep"],
        courseSlug: "complete-ui-ux-design-bootcamp",
      },
    ],
  },
  {
    id: "dev",
    emoji: "⚛️",
    label: "Full-Stack Developer",
    description: "From zero to shipping production-grade apps",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.25)",
    border: "rgba(96,165,250,0.35)",
    bg: "rgba(96,165,250,0.08)",
    duration: "8 months",
    jobs: "Frontend Engineer · Fullstack Dev · Tech Lead",
    steps: [
      {
        no: 1,
        title: "Web Fundamentals",
        status: "done",
        weeks: "Weeks 1–3",
        desc: "HTML, CSS, JavaScript ES6+, DOM manipulation, and async programming.",
        skills: ["HTML/CSS", "JavaScript", "Async JS"],
        courseSlug: "full-stack-development-accelerator",
      },
      {
        no: 2,
        title: "React & Ecosystem",
        status: "current",
        weeks: "Weeks 4–7",
        desc: "Components, hooks, state management, routing, and testing.",
        skills: ["React", "Hooks", "State Management"],
        courseSlug: "react-nextjs-mastery-2026",
      },
      {
        no: 3,
        title: "Next.js & TypeScript",
        status: "locked",
        weeks: "Weeks 8–12",
        desc: "App router, server components, API routes, and type-safe patterns.",
        skills: ["Next.js", "TypeScript", "API Design"],
        courseSlug: "react-nextjs-mastery-2026",
      },
      {
        no: 4,
        title: "Backend & Databases",
        status: "locked",
        weeks: "Weeks 13–18",
        desc: "REST/GraphQL APIs, PostgreSQL, Prisma ORM, auth, and security.",
        skills: ["Node.js", "PostgreSQL", "REST APIs"],
        courseSlug: "full-stack-development-accelerator",
      },
      {
        no: 5,
        title: "System Design",
        status: "locked",
        weeks: "Weeks 19–24",
        desc: "Scalable architecture, caching, rendering strategies, and trade-offs.",
        skills: ["Architecture", "Performance", "Scalability"],
        courseSlug: "system-design-for-frontend-engineers",
      },
      {
        no: 6,
        title: "Cloud & Deployment",
        status: "locked",
        weeks: "Weeks 25–32",
        desc: "CI/CD pipelines, Docker, cloud hosting, monitoring, and launch.",
        skills: ["Docker", "CI/CD", "Cloud Deploy"],
        courseSlug: "full-stack-development-accelerator",
      },
    ],
  },
  {
    id: "ai",
    emoji: "🤖",
    label: "AI / ML Engineer",
    description: "Build intelligent systems powered by modern AI",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.25)",
    border: "rgba(167,139,250,0.35)",
    bg: "rgba(167,139,250,0.08)",
    duration: "7 months",
    jobs: "ML Engineer · AI Researcher · Prompt Engineer",
    steps: [
      {
        no: 1,
        title: "Python & Data Analysis",
        status: "done",
        weeks: "Weeks 1–4",
        desc: "Python, NumPy, Pandas, and real-world data wrangling.",
        skills: ["Python", "Pandas", "Statistics"],
        courseSlug: "python-for-data-analysis",
      },
      {
        no: 2,
        title: "AI for Designers",
        status: "current",
        weeks: "Weeks 5–8",
        desc: "Practical ML concepts, LLM APIs, and AI-assisted workflows.",
        skills: ["LLMs", "Prompt Design", "AI Workflows"],
        courseSlug: "ai-machine-learning-for-designers",
      },
      {
        no: 3,
        title: "No-Code AI Automation",
        status: "locked",
        weeks: "Weeks 9–12",
        desc: "Build agents, connect APIs, and automate with no-code platforms.",
        skills: ["AI Agents", "Automation", "No-Code"],
        courseSlug: "no-code-ai-automation",
      },
      {
        no: 4,
        title: "Deep Learning Foundations",
        status: "locked",
        weeks: "Weeks 13–18",
        desc: "Neural networks, CNNs, transformers, and fine-tuning open models.",
        skills: ["PyTorch", "Transformers", "Fine-tuning"],
        courseSlug: "ai-machine-learning-for-designers",
      },
      {
        no: 5,
        title: "Production ML Systems",
        status: "locked",
        weeks: "Weeks 19–28",
        desc: "MLOps, model serving, monitoring, and real-world deployment.",
        skills: ["MLOps", "Model Serving", "Monitoring"],
        courseSlug: "full-stack-development-accelerator",
      },
    ],
  },
  {
    id: "biz",
    emoji: "📊",
    label: "Growth & Product",
    description: "Strategy, product thinking, and growth systems",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.2)",
    border: "rgba(251,191,36,0.3)",
    bg: "rgba(251,191,36,0.07)",
    duration: "5 months",
    jobs: "Product Manager · Growth Lead · Founder",
    steps: [
      {
        no: 1,
        title: "Product Fundamentals",
        status: "done",
        weeks: "Weeks 1–3",
        desc: "Problem discovery, OKR frameworks, roadmapping, and prioritisation.",
        skills: ["Product Strategy", "Roadmapping", "OKRs"],
        courseSlug: "product-management-fundamentals",
      },
      {
        no: 2,
        title: "Growth Marketing",
        status: "current",
        weeks: "Weeks 4–7",
        desc: "Acquisition, funnel optimisation, A/B testing, and growth loops.",
        skills: ["Growth Loops", "A/B Testing", "Funnels"],
        courseSlug: "growth-marketing-playbook",
      },
      {
        no: 3,
        title: "Data-Driven Decisions",
        status: "locked",
        weeks: "Weeks 8–12",
        desc: "Analytics setup, cohort analysis, and revenue attribution.",
        skills: ["Analytics", "Cohorts", "Attribution"],
        courseSlug: "python-for-data-analysis",
      },
      {
        no: 4,
        title: "Execution & Leadership",
        status: "locked",
        weeks: "Weeks 13–20",
        desc: "Stakeholder management, sprint ceremonies, and launch playbooks.",
        skills: ["Leadership", "Agile", "Launch"],
        courseSlug: "product-management-fundamentals",
      },
    ],
  },
];

// ── Status helpers ──────────────────────────────────────────────────────────
function StepIcon({ status, color }: { status: string; color: string }) {
  if (status === "done") return <CheckCircle size={18} style={{ color }} />;
  if (status === "current")
    return <Circle size={18} style={{ color, fill: `${color}30` }} />;
  return <Lock size={16} className="text-gray-700" />;
}

// Maps sidebar category → which ROADMAP_CATEGORIES title(s) it highlights
const SIDEBAR_CATS: { label: string; match: string | null }[] = [
  { label: "All Roadmaps", match: null },
  { label: "Role Based", match: "Role Based Roadmaps" },
  { label: "Skill Based", match: "Skill Based Roadmaps" },
  { label: "Frameworks & Tools", match: "Frameworks & Tools Roadmap" },
  { label: "Best Practices", match: "Best Practices" },
];

const ROADMAP_CATEGORIES = [
  {
    title: "Role Based Roadmaps",
    items: [
      { id: "frontend", label: "Frontend", status: "coming_soon" },
      { id: "backend", label: "Backend", status: "coming_soon" },
      { id: "dev", label: "Full Stack", status: "ready" },
      { id: "devops", label: "DevOps", status: "coming_soon" },
      { id: "design", label: "UI/UX Design", status: "ready" },
      { id: "data_analyst", label: "Data Analyst", status: "coming_soon" },
      { id: "ai", label: "AI Engineer", status: "ready" },
      { id: "biz", label: "Product Manager", status: "ready" },
      { id: "android", label: "Android", status: "coming_soon" },
      { id: "ios", label: "iOS", status: "coming_soon" },
      { id: "blockchain", label: "Blockchain", status: "coming_soon" },
      { id: "qa", label: "QA Engineer", status: "coming_soon" },
      {
        id: "cloud_architect",
        label: "Cloud Architect",
        status: "coming_soon",
      },
      { id: "game_dev", label: "Game Developer", status: "coming_soon" },
      { id: "tech_writer", label: "Technical Writer", status: "coming_soon" },
      {
        id: "machine_learning",
        label: "Machine Learning",
        status: "coming_soon",
      },
      { id: "devsecops", label: "DevSecOps", status: "coming_soon" },
      { id: "sre", label: "Site Reliability", status: "coming_soon" },
      {
        id: "engineering_manager",
        label: "Engineering Manager",
        status: "coming_soon",
      },
      { id: "dev_rel", label: "Developer Relations", status: "coming_soon" },
      { id: "cyber_sec", label: "Cyber Security", status: "coming_soon" },
      { id: "data_scientist", label: "Data Scientist", status: "coming_soon" },
      { id: "data_engineer", label: "Data Engineer", status: "coming_soon" },
      {
        id: "software_architect",
        label: "Software Architect",
        status: "coming_soon",
      },
    ],
  },
  {
    title: "Skill Based Roadmaps",
    items: [
      { id: "react", label: "React", status: "coming_soon" },
      { id: "vue", label: "Vue", status: "coming_soon" },
      { id: "javascript", label: "JavaScript", status: "coming_soon" },
      { id: "nodejs", label: "Node.js", status: "coming_soon" },
      { id: "typescript", label: "TypeScript", status: "coming_soon" },
      { id: "python", label: "Python", status: "coming_soon" },
      { id: "postgresql", label: "PostgreSQL", status: "coming_soon" },
      { id: "java", label: "Java", status: "coming_soon" },
      { id: "cplusplus", label: "C++", status: "coming_soon" },
      { id: "csharp", label: "C#", status: "coming_soon" },
      { id: "go", label: "Go", status: "coming_soon" },
      { id: "rust", label: "Rust", status: "coming_soon" },
      { id: "ruby", label: "Ruby", status: "coming_soon" },
      { id: "php", label: "PHP", status: "coming_soon" },
      { id: "sql", label: "SQL", status: "coming_soon" },
      { id: "mongodb", label: "MongoDB", status: "coming_soon" },
      { id: "graphql", label: "GraphQL", status: "coming_soon" },
      { id: "docker", label: "Docker", status: "coming_soon" },
      { id: "kubernetes", label: "Kubernetes", status: "coming_soon" },
      { id: "aws", label: "AWS", status: "coming_soon" },
      { id: "azure", label: "Azure", status: "coming_soon" },
      { id: "gcp", label: "Google Cloud", status: "coming_soon" },
      { id: "linux", label: "Linux", status: "coming_soon" },
      { id: "git", label: "Git", status: "coming_soon" },
      { id: "system_design", label: "System Design", status: "coming_soon" },
      { id: "dsa", label: "Data Structures", status: "coming_soon" },
      { id: "testing", label: "Software Testing", status: "coming_soon" },
      { id: "clean_code", label: "Clean Code", status: "coming_soon" },
      { id: "redis", label: "Redis", status: "coming_soon" },
      { id: "elasticsearch", label: "ElasticSearch", status: "coming_soon" },
    ],
  },
  {
    title: "Frameworks & Tools Roadmap",
    items: [
      { id: "nextjs", label: "Next.js", status: "coming_soon" },
      { id: "nestjs", label: "NestJS", status: "coming_soon" },
      { id: "express", label: "Express", status: "coming_soon" },
      { id: "django", label: "Django", status: "coming_soon" },
      { id: "flask", label: "Flask", status: "coming_soon" },
      { id: "fastapi", label: "FastAPI", status: "coming_soon" },
      { id: "laravel", label: "Laravel", status: "coming_soon" },
      { id: "rails", label: "Ruby on Rails", status: "coming_soon" },
      { id: "aspnet", label: "ASP.NET Core", status: "coming_soon" },
      { id: "spring", label: "Spring Boot", status: "coming_soon" },
      { id: "flutter", label: "Flutter", status: "coming_soon" },
      { id: "react_native", label: "React Native", status: "coming_soon" },
      { id: "swift", label: "Swift", status: "coming_soon" },
      { id: "kotlin", label: "Kotlin", status: "coming_soon" },
      { id: "pandas", label: "Pandas", status: "coming_soon" },
      { id: "tensorflow", label: "TensorFlow", status: "coming_soon" },
      { id: "pytorch", label: "PyTorch", status: "coming_soon" },
      { id: "tailwind", label: "Tailwind CSS", status: "coming_soon" },
      { id: "bootstrap", label: "Bootstrap", status: "coming_soon" },
      { id: "sass", label: "Sass", status: "coming_soon" },
      { id: "npm", label: "npm", status: "coming_soon" },
      { id: "yarn", label: "Yarn", status: "coming_soon" },
      { id: "webpack", label: "Webpack", status: "coming_soon" },
      { id: "vite", label: "Vite", status: "coming_soon" },
      { id: "jest", label: "Jest", status: "coming_soon" },
      { id: "cypress", label: "Cypress", status: "coming_soon" },
      { id: "playwright", label: "Playwright", status: "coming_soon" },
      { id: "github_actions", label: "GitHub Actions", status: "coming_soon" },
      { id: "gitlab_ci", label: "GitLab CI", status: "coming_soon" },
      { id: "jenkins", label: "Jenkins", status: "coming_soon" },
      { id: "terraform", label: "Terraform", status: "coming_soon" },
      { id: "ansible", label: "Ansible", status: "coming_soon" },
      { id: "framer_motion", label: "Framer Motion", status: "coming_soon" },
      { id: "prisma", label: "Prisma ORM", status: "coming_soon" },
      { id: "drizzle", label: "Drizzle ORM", status: "coming_soon" },
      { id: "apollo", label: "Apollo GraphQL", status: "coming_soon" },
    ],
  },
  {
    title: "Best Practices",
    items: [
      { id: "code_review", label: "Code Review", status: "coming_soon" },
      {
        id: "design_patterns",
        label: "Design Patterns",
        status: "coming_soon",
      },
      { id: "refactoring", label: "Refactoring", status: "coming_soon" },
      { id: "agile", label: "Agile Development", status: "coming_soon" },
      { id: "scrum", label: "Scrum Framework", status: "coming_soon" },
      { id: "performance", label: "Web Performance", status: "coming_soon" },
      {
        id: "accessibility",
        label: "Accessibility (a11y)",
        status: "coming_soon",
      },
      { id: "security", label: "Web Security", status: "coming_soon" },
      { id: "seo", label: "Technical SEO", status: "coming_soon" },
      { id: "ci_cd", label: "CI/CD Best Practices", status: "coming_soon" },
      { id: "api_design", label: "REST API Design", status: "coming_soon" },
      { id: "microservices", label: "Microservices", status: "coming_soon" },
      {
        id: "serverless",
        label: "Serverless Architecture",
        status: "coming_soon",
      },
    ],
  },
];

export default function RoadmapPage() {
  const { user, isLoaded } = useUser();
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<
    Record<number, { status: RoadmapStepStatus; progressPercent: number }>
  >({});
  const [selectedTopic, setSelectedTopic] = useState<{
    skill: string;
    stepNo: number;
    isDone: boolean;
  } | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    new Set(),
  );

  const fetchStatus = useCallback(async () => {
    if (!isLoaded || !user?.id) {
      if (isLoaded) setLoading(false);
      return;
    }
    try {
      const data: BackendRoadmapResponse = await backendRequest("/dashboard/roadmap", {
        clerkUserId: user.id
      });
      if (data) {
        const devPath = data["dev"];
        if (devPath && devPath.stages) {
          const map: Record<
            number,
            { status: RoadmapStepStatus; progressPercent: number }
          > = {};
          devPath.stages.forEach((st) => {
            map[st.stepNo] = {
              status: st.status,
              progressPercent: st.progressPercent,
            };
          });
          setStatusMap(map);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user?.id]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const pathContent = active ? PATHS.find((p) => p.id === active) : null;

  const steps = pathContent
    ? pathContent.steps.map((step, index) => {
        if (active === "dev" && statusMap[step.no]) {
          return {
            ...step,
            status: statusMap[step.no].status,
            progressPercent: statusMap[step.no].progressPercent,
          };
        }
        const isFirst = index === 0;
        return {
          ...step,
          status: (isFirst ? "current" : "locked") as RoadmapStepStatus,
          progressPercent: 0,
        };
      })
    : [];

  const completedCount = steps.filter((s) => s.status === "done").length;
  const overallProgress =
    steps.length > 0
      ? Math.round(
          steps.reduce(
            (acc, step) =>
              acc + (step.status === "done" ? 100 : step.progressPercent || 0),
            0,
          ) / steps.length,
        )
      : 0;

  return (
    <div
      className={`min-h-screen mx-auto bg-[#f6f8ff] dark:bg-[#05050a] selection:bg-violet-500/30 ${montserrat.className}`}
    >
      <Navbar />

      <main className="text-slate-900 dark:text-white pt-10 max-w-6xl mx-auto">
        <div className="max-w-7xl mx-auto px-6">
          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-16 flex flex-col items-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 bg-blue-50 dark:bg-violet-500/15 border border-blue-100 dark:border-violet-500/35 text-blue-600 dark:text-violet-400 shadow-sm dark:shadow-none"
            >
              <Zap size={11} /> Structured Learning Paths
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4">
              Your Learning{" "}
              <span
                className={`${montserrat.className} text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400`}
              >
                Blueprint
              </span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
              Step-by-step career playbooks curated by industry experts. Start
              at zero and follow the exact path to job-ready mastery.
            </p>
            {!active && (
              <div className="relative w-full max-w-xl mx-auto">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search roadmaps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-full py-4 pl-14 pr-6 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#0056d2]/50 dark:focus:border-violet-500/50 focus:ring-1 focus:ring-[#0056d2]/30 dark:focus:ring-violet-500/50 transition-all font-medium shadow-sm dark:shadow-none"
                />
              </div>
            )}
          </div>

          {/* ── Main Layout ── */}
          <div className="flex flex-col md:flex-row gap-10 pb-24">
            {/* Sidebar — only show on dashboard, not active roadmap */}
            {!active && (
              <div className="w-full md:w-52 shrink-0 hidden md:block border-r border-slate-200 dark:border-white/5 pr-6">
                <div className="sticky top-24">
                  <h3 className="text-[10px] font-black tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-4 pl-2">
                    Categories
                  </h3>
                  <div className="space-y-0.5">
                    {SIDEBAR_CATS.map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => {
                          setActiveCategory(cat.match);
                          setActive(null);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                          activeCategory === cat.match
                            ? "bg-[#0056d2]/10 text-[#0056d2] dark:bg-violet-500/10 dark:text-violet-300 font-bold border border-[#0056d2]/20 dark:border-violet-500/20"
                            : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/[0.03] font-medium"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {!active ? (
                /* ── Dashboard Grid ── */
                <div className="space-y-12">
                  {ROADMAP_CATEGORIES.filter(
                    (category) =>
                      activeCategory === null ||
                      category.title === activeCategory,
                  ).map((category) => {
                    const filtered = category.items.filter((item) =>
                      searchQuery
                        ? item.label
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : true,
                    );
                    if (filtered.length === 0) return null;
                    return (
                      <div key={category.title}>
                        <h2 className="text-xs font-black tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-5 flex items-center gap-4">
                          {category.title}
                          <div className="h-px bg-slate-200 dark:bg-white/5 flex-1" />
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {filtered.map((item) => {
                            const isReady = item.status === "ready";
                            // roadmap.sh slug mapping
                            const roadmapShSlugs: Record<string, string> = {
                              frontend: "frontend",
                              backend: "backend",
                              devops: "devops",
                              data_analyst: "data-analyst",
                              android: "android",
                              ios: "ios",
                              blockchain: "blockchain",
                              qa: "qa",
                              cloud_architect: "cloudnative",
                              game_dev: "game-developer",
                              tech_writer: "technical-writer",
                              machine_learning: "mlops",
                              devsecops: "devops",
                              sre: "devops",
                              engineering_manager: "engineering-manager",
                              dev_rel: "devops",
                              cyber_sec: "cyber-security",
                              data_scientist: "data-scientist",
                              data_engineer: "data-analyst",
                              software_architect: "software-architect",
                              react: "react",
                              vue: "vue",
                              javascript: "javascript",
                              nodejs: "nodejs",
                              typescript: "typescript",
                              python: "python",
                              postgresql: "postgresql",
                              java: "java",
                              cplusplus: "cpp",
                              csharp: "csharp",
                              go: "golang",
                              rust: "rust",
                              ruby: "ruby",
                              php: "php",
                              sql: "sql",
                              mongodb: "mongodb",
                              graphql: "graphql",
                              docker: "docker",
                              kubernetes: "kubernetes",
                              aws: "aws",
                              azure: "azure",
                              gcp: "gcp",
                              linux: "linux",
                              git: "git",
                              system_design: "system-design",
                              dsa: "datastructures",
                              testing: "qa",
                              clean_code: "software-architect",
                              redis: "redis",
                              elasticsearch: "devops",
                              nextjs: "nodejs",
                              nestjs: "nodejs",
                              express: "nodejs",
                              django: "python",
                              flask: "python",
                              fastapi: "python",
                              laravel: "php",
                              rails: "ruby",
                              aspnet: "csharp",
                              spring: "java",
                              flutter: "flutter",
                              react_native: "react-native",
                              swift: "swift",
                              kotlin: "kotlin",
                              pandas: "python",
                              tensorflow: "mlops",
                              pytorch: "mlops",
                              tailwind: "css",
                              bootstrap: "css",
                              sass: "css",
                              npm: "nodejs",
                              yarn: "nodejs",
                              webpack: "nodejs",
                              vite: "nodejs",
                              jest: "qa",
                              cypress: "qa",
                              playwright: "qa",
                              github_actions: "devops",
                              gitlab_ci: "devops",
                              jenkins: "devops",
                              terraform: "devops",
                              ansible: "devops",
                              framer_motion: "react",
                              prisma: "nodejs",
                              drizzle: "nodejs",
                              apollo: "graphql",
                              code_review: "software-architect",
                              design_patterns: "software-architect",
                              refactoring: "software-architect",
                              agile: "engineering-manager",
                              scrum: "engineering-manager",
                              performance: "frontend",
                              accessibility: "frontend",
                              security: "cyber-security",
                              seo: "frontend",
                              ci_cd: "devops",
                              api_design: "api-design",
                              microservices: "software-architect",
                              serverless: "devops",
                            };
                            const roadmapShUrl =
                              !isReady && roadmapShSlugs[item.id]
                                ? `https://roadmap.sh/${roadmapShSlugs[item.id]}`
                                : null;
                            if (!isReady && roadmapShUrl) {
                              return (
                                <a
                                  key={item.id}
                                  href={roadmapShUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-[#0056d2]/30 dark:hover:border-violet-500/30 hover:bg-[#f0f4ff] dark:hover:bg-violet-500/5 cursor-pointer shadow-sm dark:shadow-none hover:shadow-md"
                                >
                                  <span className="text-sm font-bold text-slate-600 dark:text-gray-400 group-hover:text-[#0056d2] dark:group-hover:text-white transition-colors">
                                    {item.label}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[8px] font-bold tracking-widest text-slate-400 dark:text-gray-600 uppercase">
                                      roadmap.sh
                                    </span>
                                    <ArrowRight
                                      size={12}
                                      className="text-slate-400 dark:text-gray-600 group-hover:text-[#0056d2] dark:group-hover:text-violet-400 transition-colors"
                                    />
                                  </div>
                                </a>
                              );
                            }
                            return (
                              <button
                                key={item.id}
                                onClick={() => isReady && setActive(item.id)}
                                className="group flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-[#0056d2]/30 dark:hover:border-violet-500/30 hover:bg-[#eef2ff] dark:hover:bg-violet-500/5 cursor-pointer shadow-sm dark:shadow-none hover:shadow-md"
                              >
                                <span className="text-sm font-bold text-slate-700 dark:text-gray-200 group-hover:text-[#0056d2] dark:group-hover:text-white">
                                  {item.label}
                                </span>
                                <BookOpen
                                  size={16}
                                  className="text-slate-300 dark:text-gray-600 group-hover:text-[#0056d2] dark:group-hover:text-violet-400 transition-colors"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ── Active Roadmap View ── */
                <AnimatePresence mode="wait">
                  {!loading && pathContent && (
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.22 }}
                    >
                      {/* Back (mobile) */}
                      <div className="mb-6 md:hidden">
                        <button
                          onClick={() => setActive(null)}
                          className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white py-2 px-4 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none transition-all w-fit"
                        >
                          <ChevronRight className="rotate-180" size={14} /> Back
                          to Categories
                        </button>
                      </div>

                      {/* Path Header */}
                      <div
                        className="rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
                        style={{
                          background: pathContent.bg,
                          border: `1px solid ${pathContent.border}`,
                          boxShadow: `0 0 50px ${pathContent.glow}`,
                        }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center text-4xl shadow-inner">
                              {pathContent.emoji}
                            </div>
                            <div>
                              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                                {pathContent.label}
                              </h2>
                              <p
                                className="text-sm font-bold opacity-80"
                                style={{ color: pathContent.color }}
                              >
                                {pathContent.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest bg-slate-100 dark:bg-black/30 px-2 py-0.5 rounded">
                              Career paths:
                            </span>
                            <span className="text-xs text-slate-600 dark:text-gray-300 font-semibold">
                              {pathContent.jobs}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-center shrink-0 relative z-10">
                          {[
                            { label: "Stages", value: steps.length },
                            { label: "Timeline", value: pathContent.duration },
                            {
                              label: "Complete",
                              value: `${completedCount}/${steps.length}`,
                            },
                          ].map((stat) => (
                            <div
                              key={stat.label}
                              className="px-5 py-3 rounded-2xl bg-white/60 dark:bg-black/30 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"
                              style={{
                                border: `1px solid ${pathContent.border}`,
                              }}
                            >
                              <p className="text-xl font-black text-slate-900 dark:text-white">
                                {stat.value}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-gray-500">
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-10">
                        <div className="flex justify-between text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">
                          <span>Path Mastery</span>
                          <span style={{ color: pathContent.color }}>
                            {overallProgress}%
                          </span>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-white/5"
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${pathContent.color}90, ${pathContent.color})`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${overallProgress}%` }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                          />
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="space-y-4">
                        {steps.map((step, idx) => {
                          const isLocked = step.status === "locked";
                          const isCurrent = step.status === "current";
                          const isDone = step.status === "done";
                          const prevStep = idx > 0 ? steps[idx - 1] : null;
                          return (
                            <motion.div
                              key={step.no}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.07 }}
                              className={`group rounded-3xl overflow-hidden transition-all duration-300 border ${
                                isCurrent
                                  ? "bg-white/80 dark:bg-white/5 border-blue-500/30 dark:border-violet-500/30"
                                  : isLocked
                                    ? "bg-slate-50 dark:bg-white/1 border-slate-200 dark:border-white/5"
                                    : "bg-white dark:bg-white/3 border-slate-200 dark:border-white/10"
                              }`}
                              style={{
                                opacity: isLocked ? 0.6 : 1,
                              }}
                            >
                              <div className="flex items-start gap-6 p-6">
                                <div className="flex flex-col items-center gap-2 pt-1.5 shrink-0">
                                  <StepIcon
                                    status={step.status}
                                    color={pathContent.color}
                                  />
                                  {idx < steps.length - 1 && (
                                    <div className="w-px h-16 bg-slate-200 dark:bg-white/10" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                      {step.weeks}
                                    </span>
                                    {isCurrent && (
                                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-violet-400 animate-pulse">
                                        <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />{" "}
                                        IN PROGRESS
                                      </span>
                                    )}
                                    {isDone && (
                                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                                        CERTIFIED <CheckCircle size={10} />
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-violet-400 transition-colors">
                                    Stage {step.no}: {step.title}
                                  </h3>
                                  <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed mb-4">
                                    {step.desc}
                                  </p>
                                  <div className="flex flex-wrap gap-2.5 mb-5">
                                    {step.skills.map((skill) => {
                                      const topicId = `${step.no}-${skill}`;
                                      const isTopicDone =
                                        completedTopics.has(topicId);
                                      return (
                                        <button
                                          key={skill}
                                          onClick={() =>
                                            setSelectedTopic({
                                              skill,
                                              stepNo: step.no,
                                              isDone: isTopicDone,
                                            })
                                          }
                                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-wider ${
                                            isTopicDone
                                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                              : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-300 hover:border-blue-500/50 dark:hover:border-violet-500/50 hover:bg-blue-50 dark:hover:bg-violet-500/10 hover:text-blue-600 dark:hover:text-white"
                                          }`}
                                        >
                                          <div
                                            className={`w-1.5 h-1.5 rounded-full ${isTopicDone ? "bg-emerald-500 dark:bg-emerald-400" : "bg-slate-300 dark:bg-gray-500"}`}
                                          />
                                          {skill}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {!isLocked ? (
                                    <Link
                                      href={`/courses/${step.courseSlug}`}
                                      className="inline-flex items-center gap-2 text-[13px] font-black px-4 py-2 border border-slate-200 dark:border-white/5 rounded-xl bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors group/btn shadow-sm dark:shadow-none"
                                      style={{ color: pathContent.color }}
                                    >
                                      {isDone
                                        ? "Review Curriculum"
                                        : "Start Learning"}
                                      <ArrowRight
                                        size={14}
                                        className="group-hover/btn:translate-x-1 transition-transform"
                                      />
                                    </Link>
                                  ) : (
                                    <div className="mt-3 pt-3 border-t border-white/[0.05]">
                                      <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-gray-600 uppercase">
                                        <Lock
                                          size={12}
                                          className="text-gray-500"
                                        />{" "}
                                        Complete previous stage to unlock
                                      </div>
                                      {prevStep && (
                                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                          <span className="text-violet-400 font-bold border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 rounded">
                                            Stage {step.no - 1}
                                          </span>
                                          {prevStep.title}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {isCurrent &&
                                  (step.progressPercent ?? 0) > 0 && (
                                    <div className="hidden sm:flex flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-black/20 border border-white/5 shrink-0">
                                      <div className="relative w-12 h-12">
                                        <svg
                                          className="w-full h-full"
                                          viewBox="0 0 36 36"
                                        >
                                          <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth={3}
                                          />
                                          <motion.path
                                            initial={{ pathLength: 0 }}
                                            animate={{
                                              pathLength:
                                                (step.progressPercent ?? 0) /
                                                100,
                                            }}
                                            transition={{
                                              duration: 1.5,
                                              ease: "easeOut",
                                            }}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke={pathContent.color}
                                            strokeWidth={3}
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">
                                          {step.progressPercent}%
                                        </span>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* CTA Cards */}
                      <div className="mt-16 grid md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[32px] border border-slate-200 dark:border-white/[0.05] bg-violet-50/50 dark:bg-transparent dark:bg-gradient-to-br dark:from-violet-600/10 dark:to-transparent relative group overflow-hidden shadow-sm dark:shadow-none">
                          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles size={64} className="text-violet-500" />
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 dark:bg-violet-600/20 text-violet-600 dark:text-violet-300 text-[10px] font-black uppercase mb-6 border border-violet-500/20">
                            <StarIcon size={11} className="fill-current" /> AI
                            Career Architect
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                            Generate Custom Path
                          </h3>
                          <p className="text-slate-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                            Our AI can architect a specialized roadmap based on
                            your current skills.
                          </p>
                          <button className="px-6 py-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black text-xs hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 hover:border-violet-500 transition-all">
                            Join Waitlist
                          </button>
                        </div>
                        <div className="p-8 rounded-[32px] border border-slate-200 dark:border-white/[0.05] bg-emerald-50/50 dark:bg-transparent dark:bg-gradient-to-br dark:from-emerald-600/10 dark:to-transparent relative group overflow-hidden shadow-sm dark:shadow-none">
                          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Zap size={64} className="text-emerald-500" />
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-black uppercase mb-6 border border-emerald-500/20">
                            <CheckCircle size={11} className="fill-current" />{" "}
                            Mentorship Pro
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                            Validate Your Progress
                          </h3>
                          <p className="text-slate-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                            Get milestones reviewed by industry leads. Unlock
                            the Job-Ready badge.
                          </p>
                          <button className="px-6 py-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black text-xs hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 hover:border-emerald-500 transition-all flex items-center gap-2">
                            <Lock size={12} /> Unlock Mentors
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {loading && active && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 gap-4"
                    >
                      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                      <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                        Synchronizing your progress...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Glassmorphism Side Drawer ── */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex justify-end"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedTopic(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-[70] w-full max-w-md bg-white dark:bg-[#0a0a0f]/95 backdrop-blur-xl border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col h-full"
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-1">
                    Stage {selectedTopic.stepNo} · Topic
                  </p>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {selectedTopic.skill}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-600 dark:text-violet-400" /> Why learn
                    this?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] p-4 rounded-2xl">
                    Mastering{" "}
                    <strong className="text-blue-600 dark:text-violet-300">
                      {selectedTopic.skill}
                    </strong>{" "}
                    is crucial for building robust, scalable applications—and
                    one of the most sought-after skills in modern tech.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">
                    Curated Resources
                  </h3>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <a
                        key={i}
                        href="#"
                        className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:border-slate-300 dark:hover:border-white/10 transition-all group shadow-sm dark:shadow-none"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-violet-500/20 text-blue-500 dark:text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <PlayCircle size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-violet-300 transition-colors">
                            Complete {selectedTopic.skill} Crash Course
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-500 mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />{" "}
                            YouTube · 45 mins
                          </p>
                        </div>
                      </a>
                    ))}
                    <a
                      href="#"
                      className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:border-slate-300 dark:hover:border-white/10 transition-all group shadow-sm dark:shadow-none"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-blue-500/20 text-indigo-500 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-blue-300 transition-colors">
                          Official Documentation
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-500 mt-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-blue-500" />{" "}
                          Read the docs
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/40">
                <button
                  onClick={() => {
                    if (!selectedTopic) return;
                    const id = `${selectedTopic.stepNo}-${selectedTopic.skill}`;
                    setCompletedTopics((prev) => {
                      const next = new Set(prev);
                      if (next.has(id)) next.delete(id);
                      else next.add(id);
                      return next;
                    });
                    setSelectedTopic((prev) =>
                      prev ? { ...prev, isDone: !prev.isDone } : null,
                    );
                  }}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm transition-all active:scale-[0.98] ${
                    selectedTopic.isDone
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/25"
                  }`}
                >
                  {selectedTopic.isDone ? (
                    <>
                      <CheckCircle size={18} /> Mark as Pending
                    </>
                  ) : (
                    <>
                      <Circle size={18} /> Mark as Mastered
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
