"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, Users, ArrowRight, Search } from "lucide-react";
import { coursesData } from "@/lib/courses-data";
import { Montserrat } from "next/font/google";
import Footer from "@/components/lms/Footer";
import Navbar from "@/components/lms/Navbar";

const montserrat = Montserrat({ subsets: ["latin"] });

// ── Build instructor profiles from course data ──────────────────────────────
const INSTRUCTOR_META: Record<
  string,
  {
    title: string;
    bio: string;
    avatar: string;
    gradient: [string, string];
    image?: string;
  }
> = {
  "Jessica Willis": {
    title: "Lead Product Designer",
    bio: "10+ years designing products at Figma and Airbnb. Specialises in end-to-end UX systems.",
    avatar: "JW",
    gradient: ["#f472b6", "#ec4899"],
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60",
  },
  "Alex Chen": {
    title: "Senior Software Engineer",
    bio: "Ex-Vercel engineer. Built production systems used by 2M+ developers. Open-source contributor.",
    avatar: "AC",
    gradient: ["#60a5fa", "#3b82f6"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
  },
  "Dr. Sarah Park": {
    title: "AI Research Scientist",
    bio: "PhD in ML from Stanford. Worked at DeepMind and Google Brain on generative models.",
    avatar: "SP",
    gradient: ["#a78bfa", "#8b5cf6"],
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60",
  },
  "Marcus Lee": {
    title: "Mobile & UI Designer",
    bio: "Design lead at Meta's mobile design team. Created iOS apps with 5M+ downloads.",
    avatar: "ML",
    gradient: ["#f97316", "#fb923c"],
    image:
      "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=500&auto=format&fit=crop&q=60",
  },
  "Ryan Torres": {
    title: "Principal Full-Stack Engineer",
    bio: "Architected backend systems at Stripe and Shopify processing $1B+ annually.",
    avatar: "RT",
    gradient: ["#34d399", "#10b981"],
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60",
  },
  "Emily Watson": {
    title: "Senior Product Manager",
    bio: "Former PM at Notion and Linear. Expert in product-led growth and PLG strategies.",
    avatar: "EW",
    gradient: ["#fbbf24", "#f59e0b"],
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
  },
  "Nina Kaur": {
    title: "Motion Designer",
    bio: "Award-winning motion designer. Former Disney Creative Labs. Framer MVP.",
    avatar: "NK",
    gradient: ["#e879f9", "#d946ef"],
    image:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=500&auto=format&fit=crop&q=60",
  },
  "Arjun Patel": {
    title: "Data Scientist",
    bio: "Data science lead at McKinsey. Built ML models for Fortune 500 companies.",
    avatar: "AP",
    gradient: ["#22d3ee", "#06b6d4"],
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60",
  },
  "Leah Kim": {
    title: "Growth Marketing Director",
    bio: "Scaled Duolingo and Calm's user base through data-driven growth loops.",
    avatar: "LK",
    gradient: ["#4ade80", "#22c55e"],
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60",
  },
  "Diego Martins": {
    title: "Frontend Architect",
    bio: "Staff engineer at Atlassian. Expert in scalable frontend systems and performance.",
    avatar: "DM",
    gradient: ["#818cf8", "#6366f1"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
  },
  "Olivia Harper": {
    title: "UX Research Lead",
    bio: "Research lead at IBM Design. Champion of inclusive research practices.",
    avatar: "OH",
    gradient: ["#fb7185", "#f43f5e"],
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60",
  },
  "Kevin Roy": {
    title: "No-Code & Automation Expert",
    bio: "Built 200+ automation systems. Advisor to AI-native startups.",
    avatar: "KR",
    gradient: ["#38bdf8", "#0ea5e9"],
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60",
  },
};

function buildInstructors() {
  const map: Record<
    string,
    {
      name: string;
      courses: typeof coursesData;
      meta: (typeof INSTRUCTOR_META)[string];
    }
  > = {};
  for (const course of coursesData) {
    if (!map[course.instructor]) {
      map[course.instructor] = {
        name: course.instructor,
        courses: [],
        meta: INSTRUCTOR_META[course.instructor] ?? {
          title: "Expert Instructor",
          bio: "Industry expert with years of hands-on experience.",
          avatar: course.instructor
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2),
          gradient: ["#7c3aed", "#a855f7"],
        },
      };
    }
    map[course.instructor].courses.push(course);
  }
  return Object.values(map).sort((a, b) => b.courses.length - a.courses.length);
}

const allInstructors = buildInstructors();

const categoryColors: Record<string, string> = {
  Design: "#f472b6",
  Development: "#60a5fa",
  "AI/ML": "#a78bfa",
  Business: "#fbbf24",
  Marketing: "#34d399",
};

export default function InstructorsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allInstructors;
    return allInstructors.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.meta.title.toLowerCase().includes(q) ||
        i.courses.some((c) => c.category.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="min-h-screen mx-auto bg-[#f6f8ff] dark:bg-transparent">
      <Navbar />
      <main
        className={`${montserrat.className} min-h-screen text-foreground pt-24 pb-20 overflow-x-hidden`}
      >
        <div className="max-w-5xl mx-auto px-6">
          {/* ── Hero ── */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5 bg-blue-600/10 text-blue-600 border border-blue-600/20 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/35 transition-colors">
              <Star size={11} className="fill-current" /> World-Class
              Instructors
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4">
              Learn From{" "}
              <span
                className={`${montserrat.className} inline-block bg-gradient-to-br from-blue-700 to-indigo-600 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent`}
              >
                The Best
              </span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Our instructors come from Google, Figma, DeepMind, Stripe, and
              more — bringing real-world experience directly to your screen.
            </p>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              {
                value: `${allInstructors.length}+`,
                label: "Expert Instructors",
              },
              { value: "50K+", label: "Students Taught" },
              { value: "4.8★", label: "Average Rating" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="lumen-stat-card rounded-3xl p-6 text-center bg-white dark:bg-[#0f0f1e]/80 border border-slate-200 dark:border-violet-500/20 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-700"
              >
                <p className="text-3xl font-black mb-1 bg-linear-to-br from-blue-700 to-indigo-600 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                  {value}
                </p>
                <p className="text-slate-500 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* ── Search ── */}
          <div className="flex items-center rounded-2xl mb-12 overflow-hidden lumen-search-bar bg-white dark:bg-violet-500/5 border border-slate-200 dark:border-violet-500/35 transition-colors shadow-sm">
            <Search size={15} className="ml-4 text-violet-400 flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, title, or category…"
              className="flex-1 bg-transparent text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 px-4 py-4 outline-none"
            />
          </div>

          {/* ── Instructor cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((inst, i) => {
              const avgRating = (
                inst.courses.reduce((s, c) => s + c.rating, 0) /
                inst.courses.length
              ).toFixed(1);
              const totalStudents = inst.courses.reduce(
                (s, c) => s + parseFloat(c.students),
                0,
              );
              const [g1, g2] = inst.meta.gradient;
              const categories = [
                ...new Set(inst.courses.map((c) => c.category)),
              ];

              return (
                <motion.div
                  key={inst.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.22,
                    delay: Math.min(i * 0.05, 0.3),
                  }}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 50px rgba(124,58,237,0.2)",
                  }}
                  className="lumen-instructor-card rounded-[2rem] overflow-hidden flex flex-col bg-white dark:bg-[#0f0f1e]/85 border border-slate-200 dark:border-violet-500/20 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-700"
                >
                  {/* Full image header replacing the band & overlapping avatar */}
                  <div className="relative h-48 flex-shrink-0 w-full overflow-hidden">
                    {inst.meta.image ? (
                      <img
                        src={inst.meta.image}
                        alt={inst.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-4xl font-black text-white"
                        style={{
                          background: `linear-gradient(135deg, ${g1}, ${g2})`,
                        }}
                      >
                        {inst.meta.avatar}
                      </div>
                    )}

                    {/* Gradient Overlay for contrast with rating/stats */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                    {/* Stats overlayed on image */}
                    <div className="absolute bottom-3 right-4 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                        <Star
                          size={13}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-white text-xs font-bold leading-none">
                          {avgRating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-5 pt-5 pb-5 flex flex-col flex-1">
                    <h2 className="text-base font-black text-slate-900 dark:text-white mb-0.5">
                      {inst.name}
                    </h2>
                    <p
                      className="text-xs font-semibold mb-3"
                      style={{ color: g1 }}
                    >
                      {inst.meta.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-500 leading-relaxed mb-4 flex-1">
                      {inst.meta.bio}
                    </p>

                    {/* Category chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                          style={{
                            background: `${categoryColors[cat] ?? "#7c3aed"}18`,
                            color: categoryColors[cat] ?? "#c084fc",
                            border: `1px solid ${categoryColors[cat] ?? "#7c3aed"}30`,
                          }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-gray-600 mb-5">
                      <span className="flex items-center gap-1">
                        <BookOpen size={11} /> {inst.courses.length} course
                        {inst.courses.length !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={11} /> {totalStudents.toFixed(1)}K students
                      </span>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/courses?q=${encodeURIComponent(inst.name)}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${g1}cc, ${g2})`,
                      }}
                    >
                      View courses <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-gray-500 font-bold uppercase tracking-tight">
                No instructors match &ldquo;{query}&rdquo;
              </p>
              <button
                onClick={() => setQuery("")}
                className="mt-4 text-blue-600 dark:text-violet-400 font-black text-xs uppercase tracking-widest hover:text-blue-500 dark:hover:text-violet-300 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}

          {/* ── CTA banner ── */}
          <div className="lumen-cta-banner mt-24 rounded-[3rem] p-12 text-center bg-slate-50 dark:bg-violet-500/5 border border-slate-200 dark:border-violet-500/25 shadow-xl shadow-slate-200/50 dark:shadow-[0_0_80px_rgba(124,58,237,0.1)] transition-colors duration-700">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
              Become an Instructor
            </h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm max-w-lg mx-auto mb-7">
              Share your expertise with 25K+ learners. We handle the platform —
              you focus on teaching.
            </p>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.4)] dark:shadow-[0_0_30px_rgba(124,58,237,0.4)] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-500"
            >
              Apply to Teach <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
