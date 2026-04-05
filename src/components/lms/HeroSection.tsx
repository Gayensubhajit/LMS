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
  FileText,
  Inbox,
  Send,
  Archive,
  Trash,
  AlertCircle,
  MessageSquare,
  ShoppingBag,
  Tag,
  Search,
  RotateCcw,
  Reply,
  ReplyAll,
  Forward,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { Montserrat, Syne, Bricolage_Grotesque } from "next/font/google";
import { useAuth } from "@clerk/nextjs";

const syne = Syne({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

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
      <div className="flex flex-col h-full bg-white dark:bg-[#030712] relative overflow-hidden">
        {/* Mini Navbar */}
        <div className="h-8 bg-white dark:bg-[#111827] border-b border-black/5 dark:border-white/5 flex items-center px-4 gap-3 shrink-0">
          <div className="w-5 h-5 rounded-md bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <GraduationCap size={10} className="text-white" />
          </div>
          <span className="text-[8px] font-black tracking-tight text-black dark:text-white">
            Edu<span className="text-blue-600">Nova</span>
          </span>
          <div className="flex gap-3 ml-2">
            {["Courses", "Roadmap", "Pricing"].map((l) => (
              <span
                key={l}
                className="text-[7px] text-slate-600 dark:text-gray-400 font-bold"
              >
                {l}
              </span>
            ))}
          </div>
          <div className="ml-auto w-10 h-3 bg-black dark:bg-white/20 rounded-full" />
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
            className="text-[14px] font-black text-black dark:text-white leading-tight mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Step Into the
            <br />
            Future of Learning
          </motion.h2>
          <motion.p
            className="text-[7px] text-slate-600 dark:text-gray-400 font-medium mb-4 max-w-[160px]"
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
            <div className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[7px] font-bold rounded-full">
              Start Learning Free
            </div>
            <div className="px-3 py-1 border border-black/10 dark:border-white/10 text-[7px] text-black dark:text-white font-bold rounded-full flex items-center gap-1">
              <Play size={6} className="fill-black dark:fill-white" /> Demo
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
      <div className="flex flex-col h-full bg-gray-50 dark:bg-[#030712]">
        <div className="h-8 bg-white dark:bg-[#111827] border-b border-black/5 dark:border-white/5 flex items-center px-4 gap-3 shrink-0">
          <div className="w-5 h-5 rounded-md bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <GraduationCap size={10} className="text-white" />
          </div>
          <span className="text-[8px] font-black text-black dark:text-white">
            Edu<span className="text-blue-600">Nova</span>
          </span>
          <div className="ml-auto h-3 w-16 bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-full" />
        </div>
        <div className="flex-1 p-3 overflow-hidden">
          <p className="text-[8px] font-black text-black dark:text-white mb-2">
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
                className="bg-white dark:bg-[#111827] rounded-xl p-2 border border-black/5 dark:border-white/5 shadow-xs"
              >
                <span className="text-lg">{course.emoji}</span>
                <p className="text-[7px] font-bold text-black dark:text-white mt-1 leading-tight">
                  {course.title}
                </p>
                <p className="text-[6px] text-gray-400 dark:text-gray-500 mb-1">
                  {course.level}
                </p>
                <div className="flex items-center gap-1">
                  <Star size={5} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[6px] font-bold text-black dark:text-white">
                    {course.rating}
                  </span>
                  <span className="text-[6px] text-gray-400 dark:text-gray-500 ml-auto">
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
      <div className="flex h-full bg-white dark:bg-[#030712] overflow-hidden">
        {/* Sidebar (Left Column) - 25% */}
        <div className="hidden lg:flex w-1/4 border-r border-black/5 dark:border-white/5 flex flex-col py-3 shrink-0">
          <div className="px-3 mb-4">
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <div className="w-5 h-5 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white uppercase">
                SG
              </div>
              <span className="text-[9px] font-bold text-black dark:text-white truncate">
                Subhajit Gayen
              </span>
              <ChevronDown size={8} className="text-gray-400 ml-auto" />
            </div>
          </div>

          <div className="space-y-0.5 px-2">
            {[
              { icon: Inbox, label: "Inbox", count: 128, active: true },
              { icon: FileText, label: "Assignments", count: 9 },
              { icon: Send, label: "Sent" },
              { icon: AlertCircle, label: "Feedback", count: 23 },
              { icon: Trash, label: "Trash" },
              { icon: Archive, label: "Archive" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${item.active ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}
              >
                <item.icon size={10} />
                <span className="text-[9px] font-medium">{item.label}</span>
                {item.count && (
                  <span
                    className={`ml-auto text-[8px] font-bold ${item.active ? "opacity-70" : "text-gray-400"}`}
                  >
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 px-3">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2">
              Categories
            </p>
            <div className="space-y-0.5">
              {[
                { icon: Users, label: "Social", count: 972 },
                { icon: Star, label: "Updates", count: 342 },
                { icon: MessageSquare, label: "Forums", count: 128 },
                { icon: ShoppingBag, label: "Course Store", count: 8 },
                { icon: Tag, label: "Promotions", count: 21 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors"
                >
                  <item.icon size={10} />
                  <span className="text-[9px] font-medium">{item.label}</span>
                  <span className="ml-auto text-[8px] font-bold text-gray-400">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message List (Middle Column) - 35% */}
        <div className="w-full lg:w-[35%] border-r border-black/5 dark:border-white/5 flex flex-col shrink-0">
          <div className="p-3 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-[12px] font-black text-black dark:text-white">
              Inbox
            </h3>
            <div className="flex gap-1">
              <button className="px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[7px] font-bold">
                All mail
              </button>
              <button className="px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400 text-[7px] font-bold border border-black/5 dark:border-white/5">
                Unread
              </button>
            </div>
          </div>

          <div className="p-3">
            <div className="relative">
              <Search
                size={10}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-[9px] outline-hidden placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-1 px-2 pb-4 scrollbar-hide">
            {[
              {
                name: "Instructor Sarah",
                time: "over 1 year ago",
                title: "Project Feedback",
                body: "Hi Subhajit, I've reviewed your latest React patterns...",
                tags: ["review", "feedback"],
                active: true,
              },
              {
                name: "System Admin",
                time: "over 1 year ago",
                title: "Assignment Update",
                body: "Re: Advanced UI Library - The deadline for your...",
                tags: ["assignment", "urgent"],
              },
              {
                name: "Peer Review Lab",
                time: "almost 2 years ago",
                title: "New Lab Results",
                body: "Your peer evaluation results are now available in...",
                tags: ["academic"],
              },
              {
                name: "John Doe (Alumni)",
                time: "almost 2 years ago",
                title: "Networking Event",
                body: "Hey! We're hosting a meet-and-greet this Friday...",
                tags: ["event", "alumni"],
              },
            ].map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border transition-all ${msg.active ? "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] font-black text-black dark:text-white">
                    {msg.name}
                  </span>
                  <span className="text-[7px] text-gray-400 tracking-tight">
                    {msg.time}
                  </span>
                </div>
                <p className="text-[8px] font-bold text-gray-700 dark:text-gray-300 mb-1 truncate">
                  {msg.title}
                </p>
                <p className="text-[8px] text-gray-400 line-clamp-2 leading-relaxed mb-2">
                  {msg.body}
                </p>
                <div className="flex gap-1">
                  {msg.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-full text-[6px] font-black uppercase tracking-widest ${tag === "urgent" ? "bg-red-500/10 text-red-600" : "bg-black/5 dark:bg-white/10 text-gray-500 dark:text-white/60"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Detail (Right Column) - 40% */}
        <div className="hidden md:flex flex-1 flex flex-col">
          <div className="h-10 border-b border-black/5 dark:border-white/5 flex items-center px-4 justify-between shrink-0">
            <div className="flex gap-4">
              <div className="flex gap-2">
                {[Archive, Trash, AlertCircle, Clock].map((Icon, i) => (
                  <Icon
                    key={i}
                    size={12}
                    className="text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  />
                ))}
              </div>
              <div className="w-[1px] h-3 bg-black/5 dark:bg-white/10 self-center" />
              <div className="flex gap-2">
                {[RotateCcw, Reply, ReplyAll, Forward].map((Icon, i) => (
                  <Icon
                    key={i}
                    size={12}
                    className="text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  />
                ))}
              </div>
            </div>
            <div className="w-1 h-3 flex flex-col gap-0.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-0.5 h-0.5 rounded-full bg-gray-400" />
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col overflow-y-auto">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 text-[10px] font-black">
                  IS
                </div>
                <div>
                  <p className="text-[11px] font-black text-black dark:text-white">
                    Instructor Sarah
                  </p>
                  <p className="text-[8px] font-bold text-gray-500 dark:text-gray-400">
                    Meeting Regarding Capstone Project
                  </p>
                  <p className="text-[7px] text-gray-400">
                    Reply-To: sarah.inst@edunova.app
                  </p>
                </div>
              </div>
              <span className="text-[8px] text-gray-400 font-medium">
                Oct 22, 2023, 9:00:00 AM
              </span>
            </div>

            <div className="space-y-4 max-w-md">
              <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Hi Subhajit, let's have a meeting tomorrow to discuss the
                project. I've been reviewing your latest React patterns and have
                some ideas I'd like to share.
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                It's crucial that we align on our next steps to ensure the
                project's success. Please come prepared with any questions or
                insights you may have. Looking forward to our meeting!
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Best regards, <br />
                <span className="font-black">Sarah</span>
              </p>
            </div>

            <div className="mt-auto pt-8">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <p className="text-[9px] text-gray-400 mb-4">
                  Reply to Instructor Sarah...
                </p>
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                    <Send size={12} />
                  </div>
                </div>
              </div>
            </div>
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
  const [isMember, setIsMember] = useState(false);
  const { getToken, userId, isLoaded } = useAuth();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Check Plus membership
  useEffect(() => {
    if (!isLoaded || !userId) return;
    const check = async () => {
      try {
        const token = await getToken();
        // Check current slug status
        const res = await fetch(`${BACKEND_URL}/enrollments/check/plus-membership`, {
          headers: { Authorization: `Bearer ${token}`, "x-clerk-user-id": userId },
        });
        const data = await res.json();
        if (data.ok && data.enrolled) {
          setIsMember(true);
        } else {
          // Fallback to full enrollment list
          const meRes = await fetch(`${BACKEND_URL}/enrollments/me`, {
            headers: { Authorization: `Bearer ${token}`, "x-clerk-user-id": userId },
          });
          const meData = await meRes.json();
          if (meData.ok) {
            const hasPlus = meData.items?.some((i: any) => i.course.slug === "plus-membership" && i.status === "ACTIVE");
            if (hasPlus) setIsMember(true);
          }
        }
      } catch {}
    };
    check();
  }, [isLoaded, userId, getToken]);

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
      <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-linear-to-t from-white via-white/70 to-transparent pointer-events-none dark:from-[#030712] dark:via-[#030712]/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        {/* Headline with word marquee */}
        <div className="max-w-4xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-black tracking-tight mb-8 leading-[1.4] md:leading-loose"
            style={{ color: "var(--foreground)" }}
          >
            <span className="md:mb-6 inline-block font-serif text-5xl md:text-7xl lg:text-7xl leading-tight">
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
                  className={`${bricolage.className} block text-5xl md:text-8xl font-black italic text-transparent bg-clip-text  ${
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
            className={`${montserrat.className} text-sm md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium mb-8`}
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
              href={isMember ? "/courses" : "/auth/sign-up?plan=plus"}
              className="group flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full text-base font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
            >
              <span>{isMember ? "Continue Learning" : "Start Learning Free"}</span>
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
          className="relative max-w-full md:max-w-7xl mx-auto mt-12 px-0 sm:px-6 scale-100 sm:scale-[0.85] md:scale-100 origin-top"
          style={{
            perspective: "2000px",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
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
            <div className="relative z-10 rounded-[24px] overflow-hidden border border-black/8 bg-white dark:bg-[#030712] shadow-[0_60px_120px_rgba(0,0,0,0.15)] dark:shadow-[0_60px_120px_rgba(0,0,0,0.6)]">
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
              <div className="h-[450px] sm:h-[600px] md:h-[750px] relative overflow-hidden">
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
