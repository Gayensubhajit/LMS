"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { SignIn, useUser } from "@clerk/nextjs";
import { getCourseBySlug } from "@/lib/courses-data";
import { backendRequest } from "@/lib/backend-client";
import Navbar from "@/components/lms/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle,
  MoreHorizontal,
  Video,
  FileText,
  Star,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { dark } from "@clerk/ui/themes";

type DashboardCourseItem = {
  enrollmentId: string;
  plan: string;
  amountPaid: number;
  startsAt: string;
  expiresAt: string;
  course: {
    slug: string;
    title: string;
    category: string;
    previewVideoUrl: string | null;
  };
  progress: {
    completedLessons: number;
    totalLessons: number;
    progressPercent: number;
    nextLesson: {
      id: string;
      title: string;
      isPreview: boolean;
      sectionTitle: string;
    } | null;
  };
};

type TabType = "in-progress" | "completed";

const CAL_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // shift so Mon=0
  const offset = (firstDay + 6) % 7;
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function estimatedCompletion(
  startsAt: string,
  totalLessons: number,
  completedLessons: number,
) {
  if (totalLessons === 0 || completedLessons >= totalLessons) return null;
  const remaining = totalLessons - completedLessons;
  const daysNeeded = Math.ceil(remaining * 0.5); // ~30min/lesson, ~2 lessons/day
  const d = new Date();
  d.setDate(d.getDate() + daysNeeded);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyCoursesPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [enrollments, setEnrollments] = useState<DashboardCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("in-progress");

  const now = new Date();
  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();
  const [calMonth, setCalMonth] = useState(todayMonth);
  const [calYear, setCalYear] = useState(todayYear);
  const calCells = buildCalendar(calYear, calMonth);
  const calMonthLabel = new Date(calYear, calMonth, 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  useEffect(() => {
    const run = async () => {
      if (!isLoaded) return;
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await backendRequest<{
          ok: true;
          items: DashboardCourseItem[];
        }>("/dashboard/my-courses", { clerkUserId: user.id });
        setEnrollments(res.items || []);
      } catch (err) {
        const msg = (err as Error).message;
        // Surface a friendlier message for network errors
        setError(
          msg === "Failed to fetch"
            ? "Cannot reach the backend server. Make sure it is running on port 4000."
            : msg || "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [isLoaded, user?.id]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const filteredEnrollments = useMemo(() => {
    if (activeTab === "completed")
      return enrollments.filter((e) => e.progress.progressPercent === 100);
    return enrollments.filter((e) => e.progress.progressPercent < 100);
  }, [enrollments, activeTab]);

  const displayName =
    user?.firstName ||
    user?.emailAddresses[0]?.emailAddress.split("@")[0] ||
    "Student";
  const avatarUrl = user?.imageUrl;
  const initials =
    (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") ||
    user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
    "?";

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#0a0a16] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#080a10] text-foreground flex items-center justify-center pt-20">
        <SignIn />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#08080f] text-slate-900 dark:text-[#f0f0ff]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* ── LEFT SIDEBAR ── */}
          {/* ── MOBILE: GREETING ── */}
          <div className="lg:hidden mb-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {greeting}, {displayName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {enrollments.length === 0
                ? "Start your learning journey"
                : `${enrollments.length} course${enrollments.length !== 1 ? "s" : ""} enrolled`}
            </p>
          </div>

          {/* ── RIGHT: COURSES (SHOW FIRST ON MOBILE) ── */}
          <section className="order-1 lg:order-2">
            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-white/5 overflow-x-auto no-scrollbar">
              {(["in-progress", "completed"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-3 text-sm font-semibold relative transition-colors"
                  style={{ color: activeTab === tab ? "#a78bfa" : "#6b7280" }}
                >
                  {tab === "in-progress" ? "In Progress" : "Completed"}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="coursera-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Loading */}
              {(!isLoaded || loading) && (
                <motion.div key="skeleton" className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-40 rounded-2xl animate-pulse bg-slate-200 dark:bg-white/[0.02] border border-slate-300 dark:border-white/5"
                    />
                  ))}
                </motion.div>
              )}

              {/* Error */}
              {!loading && error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl p-8 flex items-start gap-4 bg-red-500/5 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertCircle size={20} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white mb-1">
                      Connection Issue
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                      {error}
                    </p>
                    <div className="mt-4 flex items-center gap-2 font-mono text-xs bg-black/40 px-3 py-2 rounded border border-white/5 text-violet-400">
                      cd backend && npm run dev
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Empty */}
              {!loading && !error && filteredEnrollments.length === 0 && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl p-16 text-center bg-white dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-white/10 shadow-sm dark:shadow-none"
                >
                  <GraduationCap
                    size={48}
                    className="mx-auto mb-6 text-gray-600"
                  />
                  <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                    {activeTab === "completed"
                      ? "No completed courses"
                      : "No courses in progress"}
                  </h2>
                  <p className="text-sm mb-8 text-slate-500 dark:text-gray-500 max-w-sm mx-auto">
                    {activeTab === "completed"
                      ? "Complete all lessons in a course to see it here and earn your certificate."
                      : "Discover your next challenge and start learning today."}
                  </p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all hover:translate-y-[-2px] bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                  >
                    Explore Courses <ArrowRight size={14} />
                  </Link>
                </motion.div>
              )}

              {/* Course list */}
              {!loading && !error && filteredEnrollments.length > 0 && (
                <motion.div key="list" className="space-y-4">
                  {filteredEnrollments.map((enrollment, idx) => {
                    const meta = getCourseBySlug(enrollment.course.slug);
                    const pct = enrollment.progress.progressPercent;
                    const isComplete = pct === 100;
                    const eta = estimatedCompletion(
                      enrollment.startsAt,
                      enrollment.progress.totalLessons,
                      enrollment.progress.completedLessons,
                    );
                    const nextLesson = enrollment.progress.nextLesson;

                    return (
                      <motion.div
                        key={enrollment.enrollmentId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="lumen-course-card rounded-2xl overflow-hidden group transition-all duration-300 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] hover:border-blue-500/30 dark:hover:border-violet-500/30 shadow-sm dark:shadow-none"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Thumbnail */}
                          <div className="sm:w-56 h-40 sm:h-auto flex items-center justify-center text-6xl shrink-0 bg-slate-100 dark:bg-white/[0.02] border-r border-slate-200 dark:border-white/5">
                            <span className="transition-transform duration-500 group-hover:scale-110">
                              {meta?.emoji ?? "📚"}
                            </span>
                          </div>

                          {/* Main content */}
                          <div className="flex-1 p-6 sm:p-8">
                            {/* Provider */}
                            <p className="text-[10px] uppercase tracking-widest font-black mb-2 text-violet-600 dark:text-violet-400">
                              EduNova Learning
                            </p>

                            {/* Title */}
                            <h3 className="text-xl font-bold leading-snug mb-2 text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-violet-200 transition-colors">
                              {enrollment.course.title}
                            </h3>

                            {/* Meta row */}
                            <div className="text-xs mb-4 flex items-center gap-2 flex-wrap text-slate-400 dark:text-gray-500">
                              <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded uppercase font-bold text-[10px] border border-slate-200 dark:border-white/5">
                                {enrollment.course.category}
                              </span>
                              <span>•</span>
                              <span>{pct}% complete</span>
                              {eta && !isComplete && (
                                <>
                                  <span>•</span>
                                  <span>EST. Completion: {eta}</span>
                                </>
                              )}
                              {isComplete && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                                    <CheckCircle size={12} /> Completed
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Progress bar */}
                            <div className="h-1.5 rounded-full overflow-hidden mb-6 bg-slate-200 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                                <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${pct}%` }}
                                 transition={{
                                   duration: 0.8,
                                   delay: 0.2 + idx * 0.05,
                                 }}
                                 className={`h-full rounded-full ${isComplete ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-500 dark:to-pink-500"}`}
                               />
                            </div>

                            <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                              {!isComplete ? (
                                <>
                                  <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center shrink-0">
                                      <Video
                                        size={14}
                                        className="text-violet-400"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                        {nextLesson?.title ||
                                          "Continue Learning"}
                                      </p>
                                      <p className="text-[10px] text-slate-400 dark:text-gray-500">
                                        {nextLesson?.sectionTitle ||
                                          "Pick up where you left off"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <Link
                                      href={`/learn/${enrollment.course.slug}`}
                                      className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 dark:shadow-violet-500/20 hover:shadow-blue-500/40 dark:hover:shadow-violet-500/40 hover:translate-y-[-1px] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-500 dark:to-pink-500"
                                    >
                                      <Play size={12} fill="currentColor" />
                                      Resume
                                    </Link>
                                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white">
                                      <MoreHorizontal size={18} />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                    <CheckCircle size={16} />
                                    <span>Course Certification Ready</span>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <Link
                                      href={`/learn/${enrollment.course.slug}`}
                                      className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                    >
                                      <FileText size={14} />
                                      Review Course
                                    </Link>
                                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white">
                                      <MoreHorizontal size={18} />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ── SIDEBAR (SHOW BELOW COURSES ON MOBILE) ── */}
          <aside className="order-2 lg:order-1">
            {/* Desktop greeting (Hidden on mobile) */}
            <div className="hidden lg:block mb-6">
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-xl font-black text-white mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-500 dark:to-pink-500 shadow-md dark:shadow-none"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={initials} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {greeting}, {displayName}
              </h1>
              <p className="text-sm mt-0.5 text-slate-500 dark:text-gray-400">
                {enrollments.length === 0 ? "Start your learning journey" : `${enrollments.length} course${enrollments.length !== 1 ? "s" : ""} enrolled`}
              </p>
            </div>

            {/* Today's goals */}
            <div
              className="lumen-sidebar-widget rounded-lg p-4 mb-4 bg-slate-50 dark:bg-[rgba(255,255,255,0.03)] border border-slate-200 dark:border-[rgba(255,255,255,0.08)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className="text-yellow-500" fill="#eab308" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Today&apos;s goals</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  { label: "Complete any 3 learning items • 0/3", href: "/courses" },
                  { label: "Complete a reading", href: "/courses?q=reading" },
                  { label: "Continue your weekly streak", href: "/my-courses" },
                ].map((goal, i) => (
                  <li key={i}>
                    <Link href={goal.href} className="flex items-start gap-2.5 text-sm group hover:text-blue-600 dark:hover:text-violet-300 transition-colors text-slate-500 dark:text-gray-400">
                      <div className="w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center border-slate-300 dark:border-gray-600 group-hover:border-violet-500 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {goal.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning plan */}
            <div
              className="lumen-sidebar-widget rounded-lg p-4 mb-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]"
            >
              <h3 className="text-sm font-bold mb-1 text-slate-900 dark:text-white">Learning plan</h3>
              <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-400 dark:text-gray-400"><ChevronLeft size={14} /></button>
                <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">{calMonthLabel}</span>
                <button onClick={nextMonth} className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-400 dark:text-gray-400"><ChevronRight size={14} /></button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {CAL_HEADERS.map(h => <div key={h} className="text-center text-[10px] font-bold py-0.5 text-slate-400 dark:text-gray-500">{h}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-y-0.5">
                {calCells.map((day, i) => {
                  const isToday = day === todayDate && calMonth === todayMonth && calYear === todayYear;
                  return (
                    <div key={i} className={`flex items-center justify-center h-7 text-[11px] font-medium rounded-full mx-0.5 ${isToday ? "bg-blue-600 dark:bg-violet-600 text-white font-bold" : day ? "text-slate-600 dark:text-slate-400" : "text-transparent"}`}
                    >
                      {day ?? ""}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upgrade */}
            <div
              className="lumen-sidebar-widget lumen-upgrade-widget rounded-lg p-5 mt-2"
              style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center mb-4">
                <GraduationCap size={20} className="text-violet-500 dark:text-violet-400" />
              </div>
              <h3 className="text-sm font-bold mb-1 text-slate-900 dark:text-white">Upgrade to Plus</h3>
              <p className="text-xs mb-4 text-slate-500 dark:text-gray-400 leading-relaxed">Get unlimited access to 7,000+ courses and certifications.</p>
              <Link href="/pricing" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors flex items-center gap-1">
                View Plans <ArrowRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
