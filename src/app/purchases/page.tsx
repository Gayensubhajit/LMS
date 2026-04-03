"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/lms/Navbar";

import { SignIn, useUser } from "@clerk/nextjs";
import { getRecentViews } from "@/lib/history-api";
import { coursesData } from "@/lib/courses-data";
import {
  CreditCard,
  History,
  Compass,
  Award,
  ChevronRight,
  ExternalLink,
  Zap,
  Star,
  Search,
  BookOpen,
  Monitor,
  Cpu,
  BrainCircuit,
  Globe,
  GraduationCap,
} from "lucide-react";
import { dark } from "@clerk/ui/themes";

export default function PurchasesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("subscriptions");

  // Start empty (SSR-safe). Populated client-side after hydration.
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [hasSearchHistory, setHasSearchHistory] = useState(false);

  const { user, isLoaded, isSignedIn } = useUser();

  React.useEffect(() => {
    if (!isLoaded) return;

    async function loadHistory() {
      // 1. If signed in, try fetching from backend
      if (user?.id) {
        try {
          const backendItems = await getRecentViews(user.id);
          if (backendItems.length > 0) {
            setHistoryItems(
              backendItems.map((course) => ({
                type: "course",
                course,
                term: course.title,
              })),
            );
            setHasSearchHistory(true);
            return; // Preference for account sync
          }
        } catch (e) {
          console.error("[PurchasesPage] Backend history fetch failed:", e);
        }
      }

      // 2. Fallback to localStorage (either guest or backend was empty)
      try {
        const raw = localStorage.getItem("lms_recent_searches");
        if (!raw) return;
        const terms: string[] = JSON.parse(raw);
        if (!Array.isArray(terms) || terms.length === 0) return;

        const seen = new Set<string>();
        const deduped: any[] = [];

        terms.slice(0, 6).forEach((term) => {
          const termWords = term.toLowerCase().split(/\s+/);
          const match = coursesData.find((c) => {
            const titleLower = c.title.toLowerCase();
            return termWords.some(
              (word) => word.length > 2 && titleLower.includes(word),
            );
          });
          const key = match ? match.slug : `search:${term}`;
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push({
              type: match ? "course" : "search",
              course: match || null,
              term,
            });
          }
        });

        setHistoryItems(deduped.slice(0, 4));
        setHasSearchHistory(terms.length > 0);
      } catch (e) {
        console.error("[PurchasesPage] Local history error:", e);
      }
    }

    loadHistory();
  }, [isLoaded, user?.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  } as const;

  const freeCourses = coursesData.filter((c) => c.isFree).slice(0, 4);

  const degrees = [
    {
      title: "Bachelor of Science in Computer Science",
      provider: "BITS Pilani",
      level: "Bachelor's Degree",
      color: "from-indigo-500 to-violet-600",
      img: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
      href: "https://www.coursera.org/degrees/bachelor-of-science-computer-science-bits",
    },
    {
      title: "Post Graduate Diploma in Applied Statistics",
      provider: "Indian Statistical Institute",
      level: "Master's Degree",
      color: "from-emerald-500 to-teal-600",
      img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
      href: "https://www.coursera.org/degrees/postgraduate-diploma-applied-statistics-isi",
    },
    {
      title: "Bachelor of Science in Data Science & AI",
      provider: "IIT Madras",
      level: "Bachelor's Degree",
      color: "from-violet-500 to-pink-600",
      img: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
      href: "https://www.onlinedegrees.iitm.ac.in/",
    },
    {
      title: "Bachelor of Science in Psychology",
      provider: "O.P. Jindal University",
      level: "Bachelor's Degree",
      color: "from-sky-500 to-blue-600",
      img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
      href: "https://www.coursera.org/degrees/bachelor-of-science-psychology-jindal",
    },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#0a0a16] flex items-center justify-center transition-colors duration-700">
        <div className="w-12 h-12 border-4 border-blue-500/20 dark:border-violet-500/20 border-t-blue-600 dark:border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#080a10] text-slate-900 dark:text-white flex items-center justify-center pt-20 transition-colors duration-700">
        <SignIn
          appearance={{
            theme: undefined, // Let clerk handle theme or use conditional
          }}
        />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f6f8ff] dark:bg-[#080a10] overflow-x-hidden pt-20 font-sans selection:bg-blue-500/30 dark:selection:bg-violet-500/30 transition-colors duration-700">
      <Navbar />

      {/* Hero Starfield */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/5 blur-[130px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-600/5 blur-[130px] rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ================= HEADER ================= */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
            <span>Stellar Hub</span>
            <ChevronRight size={10} />
            <span className="text-blue-600 dark:text-violet-400">Acquisition Logs</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-none uppercase">
            Purchases
          </h1>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-white/5 gap-8 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`pb-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === "subscriptions" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300"}`}
            >
              Subscriptions
              {activeTab === "subscriptions" && (
                <motion.div
                  layoutId="tabLine"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-violet-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === "history" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300"}`}
            >
              Payment History
              {activeTab === "history" && (
                <motion.div
                  layoutId="tabLine"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-violet-500"
                />
              )}
            </button>
          </div>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className="mb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/50 dark:bg-slate-900/20 border border-slate-200 dark:border-white/5 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-20 text-center relative overflow-hidden group shadow-xl shadow-slate-200/50 dark:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-400/5 dark:from-violet-600/5 dark:to-sky-400/5 group-hover:opacity-100 opacity-60 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-8 shadow-inner animate-pulse">
                  {activeTab === "subscriptions" ? (
                    <BookOpen size={32} className="text-blue-600 dark:text-violet-400" />
                  ) : (
                    <History size={32} className="text-indigo-500 dark:text-sky-400" />
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4 leading-none">
                  No {activeTab} found in your stellar history
                </h2>
                <p className="text-slate-500 dark:text-gray-500 text-xs sm:text-sm mb-10 max-w-sm mx-auto font-medium">
                  Your acquisition logs are currently clear. Ready to begin your
                  next interstellar mastery traversal?
                </p>
                <button
                  onClick={() => router.push("/courses")}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-indigo-600 text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(37,99,235,0.3)] dark:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-105 transition-all"
                >
                  Start Your Journey
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================= DISCOVERY ENGINE ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-32"
        >
          {/* Recently Viewed */}
          {hasSearchHistory && (
            <div className="space-y-10">
              <div className="flex justify-between items-end px-4">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                    Recently Viewed Voyages
                  </h3>
                  <div className="h-1 w-20 bg-blue-600/50 dark:bg-violet-500/50 rounded-full" />
                </div>
                <button
                  onClick={() => router.push("/courses")}
                  className="hidden sm:flex text-[10px] font-black text-blue-600 dark:text-violet-400 uppercase tracking-widest items-center gap-1 hover:text-blue-800 dark:hover:text-white transition-colors"
                >
                  Browse all <ChevronRight size={12} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {historyItems.map((item: any, i: number) => {
                  const course = item.course;
                  return (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      onClick={() =>
                        course
                          ? router.push(`/courses/${course.slug}`)
                          : router.push(
                              `/courses?q=${encodeURIComponent(item.term)}`,
                            )
                      }
                      className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden group/card shadow-xl shadow-slate-200/50 dark:shadow-xl backdrop-blur-sm cursor-pointer h-full flex flex-col transition-colors duration-700"
                    >
                      <div className="h-44 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {course?.img ? (
                          <img
                            src={course.img}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 opacity-90 dark:opacity-80"
                          />
                        ) : (
                          <img
                            src={`https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop`}
                            alt={course?.title || item.term}
                            className="w-full h-full object-cover opacity-50 dark:opacity-30"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent dark:from-slate-950 dark:via-slate-950/20 dark:to-transparent opacity-70" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-blue-600/20 dark:bg-violet-500/20 backdrop-blur-md border border-blue-500/30 dark:border-violet-500/30 text-[8px] font-black text-blue-900 dark:text-white uppercase tracking-widest">
                            {course ? course.category : "Search"}
                          </span>
                        </div>
                        {!course?.img && (
                          <div className="absolute inset-0 flex items-center justify-center text-5xl drop-shadow-lg">
                            {course?.emoji || "🔍"}
                          </div>
                        )}
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                              <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${(
                                  course?.instructor || item.term
                                )
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}&backgroundColor=${course ? "2563eb" : "7c3aed"}`}
                                alt={course?.instructor || item.term}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest truncate">
                              {course?.instructor || "EduNova"}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight mb-2 group-hover/card:text-blue-600 dark:group-hover/card:text-violet-400 transition-colors leading-snug line-clamp-2">
                            {course?.title || `"${item.term}"`}
                          </h4>
                        </div>
                        <div>
                          <div className="h-px w-full bg-slate-100 dark:bg-white/5 mb-4" />
                          <span className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                            {course ? course.level : "Browse Results"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EduNova Infinite Banner */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-[3rem] p-px overflow-hidden shadow-2xl group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-400 to-sky-400 dark:from-violet-600 dark:via-pink-400 dark:to-sky-400 animate-gradient-x opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl border border-slate-200 dark:border-transparent rounded-[2.95rem] p-10 sm:p-14 lg:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 transition-colors duration-700">
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-lg shadow-inner">
                    EduNova{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-violet-400 dark:to-pink-500">
                      Infinite
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-600/10 dark:bg-violet-500/10 border border-blue-500/20 dark:border-violet-500/20 text-[9px] font-black text-blue-600 dark:text-violet-400 uppercase tracking-widest animate-pulse">
                    Alpha Access
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-none uppercase">
                  Unlimit Your <br /> Mastery Potential
                </h2>
                <p className="text-slate-500 dark:text-gray-500 text-xs sm:text-sm mb-10 max-w-lg mx-auto lg:mx-0 font-medium">
                  Gain total access to the full repository of certifications,
                  guided projects, and professional degrees. One plan. Infinite
                  possibility.
                </p>
                <button
                  onClick={() => router.push("/pricing")}
                  className="px-10 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 dark:hover:bg-violet-500 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                >
                  Level Up Now
                </button>
              </div>
              <div className="w-64 h-64 sm:w-80 sm:h-80 relative flex items-center justify-center group-hover:rotate-12 transition-transform duration-1000">
                <div className="absolute inset-0 bg-violet-600/20 blur-[100px] rounded-full" />
                <img
                  src="https://api.dicebear.com/7.x/shapes/svg?seed=Infinite&backgroundColor=transparent&shape1Color=a78bfa&shape2Color=ec4899&shape3Color=38bdf8"
                  alt="Infinite Symbol"
                  className="w-full h-full relative z-10 drop-shadow-[0_0_50px_rgba(124,58,237,0.5)]"
                />
              </div>
            </div>
          </motion.div>

          {/* Free Interstellar Labs (Inspiration: Get Started with These Free Courses) */}
          <div className="space-y-10 group/labs">
            <div className="flex justify-between items-end px-4">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                  Get Started with These Free Transmissions
                </h3>
                <div className="h-1 w-20 bg-sky-500/50 rounded-full" />
              </div>
              <button
                onClick={() => router.push("/courses?category=Labs")}
                className="hidden sm:flex text-[10px] font-black text-sky-500 dark:text-sky-400 uppercase tracking-widest items-center gap-1 hover:text-sky-700 dark:hover:text-white transition-colors"
              >
                Explore all labs <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {freeCourses.map((course, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onClick={() => router.push(`/courses/${course.slug}`)}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden group/card shadow-xl shadow-slate-200/50 dark:shadow-xl backdrop-blur-sm cursor-pointer h-full flex flex-col transition-colors duration-700"
                >
                  <div className="h-44 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {course.img ? (
                      <img
                        src={course.img}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 opacity-90 dark:opacity-80"
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
                        alt={course.title}
                        className="w-full h-full object-cover opacity-50 dark:opacity-30"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent dark:from-slate-950 dark:via-slate-950/20 dark:to-transparent opacity-60" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-500/30 text-[8px] font-black text-sky-900 dark:text-white uppercase tracking-widest">
                        Free lab
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.instructor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}&backgroundColor=3b82f6`}
                            alt={course.instructor}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                          {course.instructor}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight mb-4 group-hover/card:text-bridge-600 dark:group-hover/card:text-sky-400 transition-colors leading-snug line-clamp-2">
                        {course.title}
                      </h4>
                    </div>
                    <div>
                      <div className="h-px w-full bg-slate-100 dark:bg-white/5 mb-4" />
                      <span className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                        Guided Project
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Earn Your Residency Mastery (Inspiration: Earn Your Degree) */}
          <div className="space-y-10 group/degrees pb-20">
            <div className="flex justify-between items-end px-4">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                  Earn Your Interstellar Degree
                </h3>
                <div className="h-1 w-20 bg-pink-500/50 rounded-full" />
              </div>
              <button
                onClick={() =>
                  window.open("https://www.coursera.org/degrees", "_blank")
                }
                className="hidden sm:flex text-[10px] font-black text-pink-500 dark:text-pink-400 uppercase tracking-widest items-center gap-1 hover:text-pink-700 dark:hover:text-white transition-colors"
              >
                Browse degrees <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {degrees.map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onClick={() => window.open(item.href, "_blank")}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden group/card shadow-xl shadow-slate-200/50 dark:shadow-xl backdrop-blur-sm flex flex-col h-[420px] cursor-pointer transition-colors duration-700"
                >
                  <div className="h-44 relative overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-transparent">
                    <img
                      src={
                        item.img ||
                        "https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000 opacity-90 dark:opacity-80"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=800&auto=format&fit=crop";
                      }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} mix-blend-overlay opacity-50 dark:opacity-40`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent dark:from-slate-950 dark:via-transparent dark:to-transparent opacity-80" />

                    {/* Badge from Inspiration */}
                    <div className="absolute top-4 right-4 animate-bounce-slow">
                      <span className="px-3 py-1 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 text-[7px] font-black text-white uppercase tracking-widest shadow-sm">
                        Hands-On Projects
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-1.5 overflow-hidden shadow-inner">
                          <img
                            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${item.provider.replace(/\s/g, "")}&backgroundColor=transparent&shape1Color=ec4899&shape2Color=1e1b4b`}
                            alt={item.provider}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                          {item.provider}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight group-hover/card:text-pink-600 dark:group-hover/card:text-pink-400 leading-tight transition-all line-clamp-3">
                        {item.title}
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div className="h-px w-full bg-slate-100 dark:bg-white/5" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 group-hover/card:text-sky-800 dark:group-hover/card:text-white transition-colors">
                          <GraduationCap size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Earn a degree
                          </span>
                        </div>
                        <span className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase">
                          {item.level.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </main>
  );
}
