"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Lock, CheckCircle, Circle, Sparkles, ArrowRight, BookOpen, Zap, Star } from "lucide-react";

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
        no: 1, title: "Design Foundations", status: "done", weeks: "Weeks 1–2",
        desc: "Visual hierarchy, typography, colour theory, and Gestalt principles.",
        skills: ["Typography", "Colour Theory", "Layout"],
        courseSlug: "complete-ui-ux-design-bootcamp",
      },
      {
        no: 2, title: "Figma & Wireframing", status: "done", weeks: "Weeks 3–5",
        desc: "Master Figma components, auto-layout, and rapid low-fidelity wireframing.",
        skills: ["Figma", "Wireframing", "Components"],
        courseSlug: "complete-ui-ux-design-bootcamp",
      },
      {
        no: 3, title: "UX Research", status: "current", weeks: "Weeks 6–8",
        desc: "User interviews, affinity mapping, and insight-driven design decisions.",
        skills: ["User Interviews", "Research Ops", "Synthesis"],
        courseSlug: "ux-research-interview-lab",
      },
      {
        no: 4, title: "Prototyping & Mobile UI", status: "locked", weeks: "Weeks 9–11",
        desc: "Interactive prototypes, mobile-first design patterns, and design tokens.",
        skills: ["Prototyping", "Mobile UI", "Design Tokens"],
        courseSlug: "mobile-app-design-with-figma",
      },
      {
        no: 5, title: "Motion & Advanced Framer", status: "locked", weeks: "Weeks 12–16",
        desc: "Micro-interactions, transition systems, and deploying with Framer.",
        skills: ["Framer Motion", "Micro-interactions", "Animation"],
        courseSlug: "advanced-motion-design-framer",
      },
      {
        no: 6, title: "Portfolio & Job Ready", status: "locked", weeks: "Weeks 17–24",
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
        no: 1, title: "Web Fundamentals", status: "done", weeks: "Weeks 1–3",
        desc: "HTML, CSS, JavaScript ES6+, DOM manipulation, and async programming.",
        skills: ["HTML/CSS", "JavaScript", "Async JS"],
        courseSlug: "full-stack-development-accelerator",
      },
      {
        no: 2, title: "React & Ecosystem", status: "current", weeks: "Weeks 4–7",
        desc: "Components, hooks, state management, routing, and testing.",
        skills: ["React", "Hooks", "State Management"],
        courseSlug: "react-nextjs-mastery-2026",
      },
      {
        no: 3, title: "Next.js & TypeScript", status: "locked", weeks: "Weeks 8–12",
        desc: "App router, server components, API routes, and type-safe patterns.",
        skills: ["Next.js", "TypeScript", "API Design"],
        courseSlug: "react-nextjs-mastery-2026",
      },
      {
        no: 4, title: "Backend & Databases", status: "locked", weeks: "Weeks 13–18",
        desc: "REST/GraphQL APIs, PostgreSQL, Prisma ORM, auth, and security.",
        skills: ["Node.js", "PostgreSQL", "REST APIs"],
        courseSlug: "full-stack-development-accelerator",
      },
      {
        no: 5, title: "System Design", status: "locked", weeks: "Weeks 19–24",
        desc: "Scalable architecture, caching, rendering strategies, and trade-offs.",
        skills: ["Architecture", "Performance", "Scalability"],
        courseSlug: "system-design-for-frontend-engineers",
      },
      {
        no: 6, title: "Cloud & Deployment", status: "locked", weeks: "Weeks 25–32",
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
        no: 1, title: "Python & Data Analysis", status: "done", weeks: "Weeks 1–4",
        desc: "Python, NumPy, Pandas, and real-world data wrangling.",
        skills: ["Python", "Pandas", "Statistics"],
        courseSlug: "python-for-data-analysis",
      },
      {
        no: 2, title: "AI for Designers", status: "current", weeks: "Weeks 5–8",
        desc: "Practical ML concepts, LLM APIs, and AI-assisted workflows.",
        skills: ["LLMs", "Prompt Design", "AI Workflows"],
        courseSlug: "ai-machine-learning-for-designers",
      },
      {
        no: 3, title: "No-Code AI Automation", status: "locked", weeks: "Weeks 9–12",
        desc: "Build agents, connect APIs, and automate with no-code platforms.",
        skills: ["AI Agents", "Automation", "No-Code"],
        courseSlug: "no-code-ai-automation",
      },
      {
        no: 4, title: "Deep Learning Foundations", status: "locked", weeks: "Weeks 13–18",
        desc: "Neural networks, CNNs, transformers, and fine-tuning open models.",
        skills: ["PyTorch", "Transformers", "Fine-tuning"],
        courseSlug: "ai-machine-learning-for-designers",
      },
      {
        no: 5, title: "Production ML Systems", status: "locked", weeks: "Weeks 19–28",
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
        no: 1, title: "Product Fundamentals", status: "done", weeks: "Weeks 1–3",
        desc: "Problem discovery, OKR frameworks, roadmapping, and prioritisation.",
        skills: ["Product Strategy", "Roadmapping", "OKRs"],
        courseSlug: "product-management-fundamentals",
      },
      {
        no: 2, title: "Growth Marketing", status: "current", weeks: "Weeks 4–7",
        desc: "Acquisition, funnel optimisation, A/B testing, and growth loops.",
        skills: ["Growth Loops", "A/B Testing", "Funnels"],
        courseSlug: "growth-marketing-playbook",
      },
      {
        no: 3, title: "Data-Driven Decisions", status: "locked", weeks: "Weeks 8–12",
        desc: "Analytics setup, cohort analysis, and revenue attribution.",
        skills: ["Analytics", "Cohorts", "Attribution"],
        courseSlug: "python-for-data-analysis",
      },
      {
        no: 4, title: "Execution & Leadership", status: "locked", weeks: "Weeks 13–20",
        desc: "Stakeholder management, sprint ceremonies, and launch playbooks.",
        skills: ["Leadership", "Agile", "Launch"],
        courseSlug: "product-management-fundamentals",
      },
    ],
  },
];

// ── Status helpers ─────────────────────────────────────────────────────────
function StepIcon({ status, color }: { status: string; color: string }) {
  if (status === "done")    return <CheckCircle size={18} style={{ color }} />;
  if (status === "current") return <Circle size={18} style={{ color, fill: `${color}30` }} />;
  return <Lock size={16} className="text-gray-700" />;
}

export default function RoadmapPage() {
  const [active, setActive] = useState("design");
  const path = PATHS.find((p) => p.id === active)!;

  return (
    <main className="min-h-screen bg-background text-foreground pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Hero ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)", color: "#c084fc" }}>
            <Zap size={11} /> Structured Learning Paths
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Your Learning{" "}
            <span style={{ background: "linear-gradient(135deg,#c084fc,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Roadmap
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Follow a curated sequence of courses, projects, and milestones —
            built by industry experts to get you job-ready.
          </p>
        </div>

        {/* ── Path selector tabs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {PATHS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className="rounded-2xl p-4 text-left transition-all duration-200"
              style={{
                background: active === p.id ? p.bg : "rgba(15,15,30,0.6)",
                border: `1px solid ${active === p.id ? p.border : "rgba(124,58,237,0.15)"}`,
                boxShadow: active === p.id ? `0 0 30px ${p.glow}` : "none",
              }}
            >
              <div className="text-3xl mb-2">{p.emoji}</div>
              <p className="text-sm font-bold text-white leading-tight">{p.label}</p>
              <p className="text-[11px] mt-1" style={{ color: p.color }}>{p.duration}</p>
            </button>
          ))}
        </div>

        {/* ── Active path panel ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22 }}
          >
            {/* Path header */}
            <div
              className="rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5"
              style={{ background: path.bg, border: `1px solid ${path.border}`, boxShadow: `0 0 50px ${path.glow}` }}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{path.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-black text-white">{path.label}</h2>
                    <p className="text-sm" style={{ color: path.color }}>{path.description}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-semibold text-gray-400">Career paths: </span>{path.jobs}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-center flex-shrink-0">
                <div className="px-5 py-3 rounded-2xl" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${path.border}` }}>
                  <p className="text-xl font-black text-white">{path.steps.length}</p>
                  <p className="text-[11px] text-gray-500">Stages</p>
                </div>
                <div className="px-5 py-3 rounded-2xl" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${path.border}` }}>
                  <p className="text-xl font-black text-white">{path.duration}</p>
                  <p className="text-[11px] text-gray-500">Timeline</p>
                </div>
                <div className="px-5 py-3 rounded-2xl" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${path.border}` }}>
                  <p className="text-xl font-black text-white">{path.steps.filter(s => s.status === "done").length}/{path.steps.length}</p>
                  <p className="text-[11px] text-gray-500">Complete</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progress</span>
                <span style={{ color: path.color }}>
                  {Math.round((path.steps.filter(s => s.status === "done").length / path.steps.length) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${path.color}90, ${path.color})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(path.steps.filter(s => s.status === "done").length / path.steps.length) * 100}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {path.steps.map((step, idx) => {
                const isLocked = step.status === "locked";
                const isCurrent = step.status === "current";
                return (
                  <motion.div
                    key={step.no}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: isCurrent ? path.bg : isLocked ? "rgba(15,15,26,0.5)" : "rgba(15,15,30,0.8)",
                      border: isCurrent ? `1px solid ${path.border}` : isLocked ? "1px solid rgba(255,255,255,0.05)" : `1px solid ${path.border}50`,
                      boxShadow: isCurrent ? `0 0 24px ${path.glow}` : "none",
                      opacity: isLocked ? 0.65 : 1,
                    }}
                  >
                    <div className="flex items-start gap-4 p-5">
                      {/* Step number + icon */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <StepIcon status={step.status} color={path.color} />
                        {idx < path.steps.length - 1 && (
                          <div className="w-px h-4 mt-1" style={{ background: isLocked ? "rgba(255,255,255,0.06)" : `${path.color}40` }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold text-gray-600">{step.weeks}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: `${path.color}20`, color: path.color }}>
                              ● In Progress
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">
                          Stage {step.no} — {step.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">{step.desc}</p>

                        {/* Skill chips */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {step.skills.map((skill) => (
                            <span key={skill} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                              style={{ background: `${path.color}15`, color: path.color, border: `1px solid ${path.color}25` }}>
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* CTA */}
                        {!isLocked && (
                          <Link
                            href={`/courses/${step.courseSlug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:gap-2.5"
                            style={{ color: path.color }}
                          >
                            {step.status === "done" ? "Review course" : "Start course"} <ChevronRight size={13} />
                          </Link>
                        )}
                        {isLocked && (
                          <span className="text-xs text-gray-700 flex items-center gap-1">
                            <Lock size={11} /> Complete previous stage to unlock
                          </span>
                        )}
                      </div>

                      {/* Stage number badge */}
                      <div className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: isLocked ? "rgba(255,255,255,0.04)" : `${path.color}18`, color: isLocked ? "#374151" : path.color }}>
                        {step.no}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10 rounded-3xl p-8 text-center"
              style={{ background: path.bg, border: `1px solid ${path.border}`, boxShadow: `0 0 60px ${path.glow}` }}>
              <Sparkles size={20} style={{ color: path.color }} className="mx-auto mb-3" />
              <h3 className="text-2xl font-black text-white mb-2">Ready to start this path?</h3>
              <p className="text-gray-400 text-sm mb-6">Begin with Stage 1 and follow the roadmap at your own pace.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link
                  href={`/courses/${path.steps[0].courseSlug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${path.color}cc, ${path.color})`, boxShadow: `0 0 24px ${path.glow}` }}
                >
                  Start Stage 1 <ArrowRight size={15} />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                  style={{ border: `1px solid ${path.border}`, color: path.color }}
                >
                  Browse all courses
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
