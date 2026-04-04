"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Play,
  BookOpen,
  Star,
  Trophy,
  Users,
  BarChart2,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { Montserrat } from "next/font/google";
import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

const words = [
  "Learning",
  "Design",
  "Code",
  "Success",
  "AI",
  "Growth",
  "Mastery",
  "Skills",
  "Excellence",
  "Success",
  "Future",
  "Impact",
];

// Simulated pages inside the 3D browser
const pages = [
  {
    id: "hero",
    label: "Home",
    content: () => (
      <div className="flex flex-col h-full bg-white relative overflow-hidden">
        {/* Mini Navbar */}
        <div className="h-8 bg-white border-b border-black/5 flex items-center px-4 gap-3 shrink-0">
          <div className="w-5 h-5 rounded-md bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <GraduationCap size={10} className="text-white" />
          </div>
          <span className="text-[8px] font-black tracking-tight text-black">
            Edu<span className="text-blue-600">Nova</span>
          </span>
          <div className="flex gap-3 ml-2">
            {["Courses", "Roadmap", "Pricing"].map((l) => (
              <span key={l} className="text-[7px] text-slate-600 font-bold">
                {l}
              </span>
            ))}
          </div>
          <div className="ml-auto w-10 h-3 bg-black rounded-full" />
        </div>
        {/* Aurora bg */}
        <div className="absolute inset-0 top-8 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-48 h-48 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle,rgba(59,130,246,0.6),transparent 70%)",
            }}
          />
          <div
            className="absolute top-4 right-1/4 w-32 h-32 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle,rgba(34,197,94,0.5),transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-8 left-1/3 w-40 h-40 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle,rgba(59,130,246,0.5),transparent 70%)",
            }}
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center z-10">
          <motion.h2
            className="text-[14px] font-black text-black leading-tight mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Step Into the
            <br />
            Future of Learning
          </motion.h2>
          <motion.p
            className="text-[7px] text-slate-600 font-medium mb-4 max-w-[160px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            AI-guided roadmaps, real-world projects, and industry mentors
          </motion.p>
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="px-3 py-1 bg-black text-white text-[7px] font-bold rounded-full">
              Start Learning Free
            </div>
            <div className="px-3 py-1 border border-black/10 text-[7px] text-black font-bold rounded-full flex items-center gap-1">
              <Play size={6} fill="black" /> Demo
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    id: "courses",
    label: "Courses",
    content: () => (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="h-8 bg-white border-b border-black/5 flex items-center px-4 gap-3 shrink-0">
          <div className="w-5 h-5 rounded-md bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <GraduationCap size={10} className="text-white" />
          </div>
          <span className="text-[8px] font-black text-black">
            Edu<span className="text-blue-600">Nova</span>
          </span>
          <div className="ml-auto h-3 w-16 bg-gray-100 border border-black/5 rounded-full" />
        </div>
        <div className="flex-1 p-3 overflow-hidden">
          <p className="text-[8px] font-black text-black mb-2">
            Explore Courses
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                emoji: "⚛️",
                title: "React & Next.js",
                level: "Intermediate",
                rating: "4.9",
                students: "8.2k",
              },
              {
                emoji: "🎨",
                title: "UI/UX Design",
                level: "Beginner",
                rating: "4.8",
                students: "12k",
              },
              {
                emoji: "🤖",
                title: "Machine Learning",
                level: "Advanced",
                rating: "4.9",
                students: "6.4k",
              },
              {
                emoji: "📊",
                title: "Data Analytics",
                level: "Intermediate",
                rating: "4.7",
                students: "9.1k",
              },
            ].map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-2 border border-black/5 shadow-xs"
              >
                <span className="text-lg">{course.emoji}</span>
                <p className="text-[7px] font-bold text-black mt-1 leading-tight">
                  {course.title}
                </p>
                <p className="text-[6px] text-gray-400 mb-1">{course.level}</p>
                <div className="flex items-center gap-1">
                  <Star size={5} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[6px] font-bold text-black">
                    {course.rating}
                  </span>
                  <span className="text-[6px] text-gray-400 ml-auto">
                    {course.students}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "dashboard",
    label: "Dashboard",
    content: () => (
      <div className="flex h-full bg-gray-50">
        {/* Sidebar */}
        <div className="w-16 bg-white border-r border-black/5 flex flex-col items-center py-3 gap-3 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-2">
            <GraduationCap size={12} className="text-white" />
          </div>
          {[BookOpen, BarChart2, Trophy, Users].map((Icon, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${i === 0 ? "bg-blue-100" : "hover:bg-gray-100"}`}
            >
              <Icon
                size={11}
                className={i === 0 ? "text-blue-600" : "text-gray-400"}
              />
            </div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-3 overflow-hidden">
          <p className="text-[8px] font-black text-black mb-2">My Dashboard</p>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[
              {
                label: "Courses",
                value: "3",
                color: "bg-blue-50 border-blue-100",
              },
              {
                label: "Progress",
                value: "72%",
                color: "bg-cyan-50 border-cyan-100",
              },
              {
                label: "Streak",
                value: "14d",
                color: "bg-green-50 border-green-100",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-2 rounded-xl border ${stat.color}`}
              >
                <p className="text-[9px] font-black text-black">{stat.value}</p>
                <p className="text-[6px] text-slate-600 font-bold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="text-[7px] font-bold text-black mb-1">
            Continue Learning
          </p>
          <div className="space-y-1.5">
            {[
              { title: "React & Next.js", pct: 83, color: "bg-blue-600" },
              { title: "UI/UX Design", pct: 45, color: "bg-cyan-600" },
            ].map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white rounded-xl p-2 border border-black/5"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[7px] font-semibold text-black">
                    {course.title}
                  </p>
                  <span className="text-[6px] text-slate-600 font-bold">
                    {course.pct}%
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${course.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${course.pct}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export default function HeroSection() {
  const [activeWord, setActiveWord] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Cycle words every 2.5s
  useEffect(() => {
    const t = setInterval(
      () => setActiveWord((w) => (w + 1) % words.length),
      2500,
    );
    return () => clearInterval(t);
  }, []);

  // Cycle pages every 4s
  useEffect(() => {
    const t = setInterval(
      () => setActivePage((p) => (p + 1) % pages.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  const CurrentPage = pages[activePage].content;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 aurora-bg transition-colors duration-700">
      {/* Bottom white fade */}
      <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-linear-to-t from-white via-white/70 to-transparent pointer-events-none dark:from-[#050510] dark:via-[#050510]/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        {/* Headline with word marquee */}
        <div className="min-h-screen max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-black tracking-tight mb-8 leading-[1.4] md:leading-loose"
            style={{ color: "var(--foreground)" }}
          >
            <span className="mb-6 inline-block font-serif text-[36px] md:text-7xl lg:text-7xl">
              Step Into the Future of
            </span>
            <div className="md:h-[6.4em] overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeWord}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className={`${syne.className} block text-4xl md:text-8xl text-transparent bg-clip-text  ${
                    isDark
                      ? "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
                      : "bg-linear-to-r from-cyan-700 via-blue-500 to-indigo-600"
                  }`}
                >
                  {words[activeWord]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${montserrat.className} text-sm md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12`}
          >
            Master UI/UX Design, Development & more with AI-guided roadmaps,
            real-world projects, and industry mentors — all in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4"
          >
            <a
              href="/courses"
              className="group flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full text-base font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
            >
              <span>Start Learning Free</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <button className="flex items-center gap-3 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-black dark:text-white px-8 py-4 rounded-full text-base font-bold hover:bg-white/90 dark:hover:bg-white/20 transition-all group">
              <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                <Play size={14} className="fill-current ml-0.5" />
              </div>
              <span>Watch Demo</span>
            </button>
          </motion.div>
        </div>

        {/* 3D Browser Showcase */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto mt-16"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Browser chrome */}
            <div className="relative z-10 rounded-[24px] overflow-hidden border border-black/8 bg-white dark:bg-gray-900 shadow-[0_60px_120px_rgba(0,0,0,0.15)]">
              {/* Browser top bar */}
              <div className="h-10 bg-gray-50 dark:bg-gray-800 border-b border-black/5 dark:border-white/5 flex items-center px-5 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                {/* URL bar */}
                <div className="flex-1 max-w-xs mx-auto h-5 bg-black/5 dark:bg-white/10 rounded-full flex items-center px-3 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                    edunova.app/{pages[activePage].label.toLowerCase()}
                  </span>
                </div>
                {/* Page tabs */}
                <div className="flex gap-1 ml-auto">
                  {pages.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePage(i)}
                      className={`px-2 py-0.5 rounded-full text-[8px] font-bold transition-all ${i === activePage ? "bg-black dark:bg-white text-white dark:text-black" : "text-gray-600 hover:text-black dark:hover:text-white"}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page content area */}
              <div className="h-[420px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0"
                  >
                    <CurrentPage />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Glow under browser */}
            <div className="absolute -bottom-8 inset-x-16 h-24 bg-blue-500/20 blur-3xl rounded-full -z-10" />
          </motion.div>

          {/* Page indicator dots */}
          <div className="flex justify-center gap-2 mt-8">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePage(i)}
                className={`transition-all duration-300 rounded-full ${i === activePage ? "w-6 h-2 bg-black dark:bg-white" : "w-2 h-2 bg-black/20 dark:bg-white/20"}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
