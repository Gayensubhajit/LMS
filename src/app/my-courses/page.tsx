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
  Share2,
  X,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Copy,
  AlertTriangle,
  Loader2,
  Flame,
  Award,
  Zap,
  TrendingUp,
  Trophy,
  Download
} from "lucide-react";
import Footer from "@/components/lms/Footer";
import CertificateModal from "@/components/lms/CertificateModal";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

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
      certificate?: {
        certificateId: string;
        issuedAt: string;
      } | null;
    };
  };

  type DashboardStats = {
    xp: number;
    streak: number;
    certificates: number;
    activeCourses: number;
    lastActivity: string | null;
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
  
  // Modal States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"share" | "rate" | "unenroll" | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<DashboardCourseItem | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [certificateToShow, setCertificateToShow] = useState<{
    courseTitle: string;
    certificateId: string;
    issuedAt: string;
  } | null>(null);

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
            ? "Cannot reach the backend server. Please check your internet connection or try again later."
            : msg || "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };
    const fetchRecommendations = async () => {
        try {
            const res = await backendRequest<{ ok: boolean; recommendations: any[] }>("/recommendations");
            if (res.ok) setRecommendations(res.recommendations);
        } catch (err) {
            console.error("Failed to fetch recommendations");
        }
    };

    const fetchStats = async () => {
        try {
            const res = await backendRequest<{ ok: boolean; stats: DashboardStats }>("/dashboard/stats", { clerkUserId: user?.id });
            if (res.ok) setStats(res.stats);
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        }
    };

    void run();
    if (user?.id) {
        fetchRecommendations();
        fetchStats();
    }
  }, [isLoaded, user?.id]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const filteredEnrollments = useMemo(() => {
    // Hide the membership itself from the course list
    const actualCourses = enrollments.filter((e) => e.course.slug !== "plus-membership");
    
    if (activeTab === "completed")
      return actualCourses.filter((e) => e.progress.progressPercent === 100);
    return actualCourses.filter((e) => e.progress.progressPercent < 100);
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

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#080a10] text-foreground flex items-center justify-center pt-20">
        <SignIn />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#08080f] text-slate-900 dark:text-[#f0f0ff]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* ── LEFT SIDEBAR ── */}
          {/* ── MOBILE: GREETING ── */}
          <div className={`${montserrat.className} lg:hidden mb-6`}>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {greeting}, <span className="text-4xl font-black">{displayName}</span>
            </h1>
            
            {/* Mobile Stats Row */}
            <div className="flex gap-4 mt-6">
                <div className="flex-1 bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Flame size={14} className="text-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Streak</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{stats?.streak || 0}</p>
                </div>
                <div className="flex-1 bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap size={14} className="text-yellow-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total XP</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{stats?.xp.toLocaleString() || 0}</p>
                </div>
            </div>
          </div>

          {/* ── RIGHT: COURSES (SHOW FIRST ON MOBILE) ── */}
          <section className="order-1 lg:order-2">
            {/* Achievement Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-md">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Learning Status</p>
                        <h4 className="text-xl font-black">{activeTab === "completed" ? "Masters Circle" : "Rising Star"}</h4>
                        <p className="text-xs font-bold text-white/80 mt-1">Keep crushing your goals!</p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-white/[0.04] rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm"
                >
                    <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center mb-4">
                        <Flame size={24} className="text-orange-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">Daily Streak</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats?.streak || 0}</h4>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Days</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-white/[0.04] rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm"
                >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-4">
                        <Trophy size={24} className="text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">Total Accomplishments</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats?.certificates || 0}</h4>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Certificates</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-white/5 overflow-x-auto no-scrollbar">
              {(["in-progress", "completed"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${montserrat.className} px-5 py-3 text-sm font-semibold relative transition-colors`}
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
                      className="h-40 rounded-2xl animate-pulse bg-slate-200 dark:bg-white/2 border border-slate-300 dark:border-white/5"
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
                    <div className="mt-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-mono text-[10px] bg-black/40 px-3 py-2 rounded border border-white/5 text-violet-400">
                        <span className="text-gray-500 shrink-0">URL:</span>
                        <span className="truncate">{process.env.NEXT_PUBLIC_API_URL || "Fallback to Localhost"}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] bg-black/40 px-3 py-2 rounded border border-white/5 text-violet-400">
                        <span className="text-gray-500 shrink-0">Resolution:</span>
                        <span>cd backend && npm run dev</span>
                      </div>
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
                                    <div className="relative">
                                      <button 
                                        onClick={() => setActiveMenuId(activeMenuId === enrollment.enrollmentId ? null : enrollment.enrollmentId)}
                                        className={`p-2 rounded-lg transition-colors ${activeMenuId === enrollment.enrollmentId ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white" : "text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"}`}
                                      >
                                        <MoreHorizontal size={18} />
                                      </button>
                                      
                                      <AnimatePresence>
                                        {activeMenuId === enrollment.enrollmentId && (
                                          <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full right-0 mb-2 w-48 py-2 bg-white dark:bg-[#0c0c1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                          >
                                            <button 
                                              onClick={() => {
                                                setSelectedEnrollment(enrollment);
                                                setModalType("share");
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-white transition-all text-left"
                                            >
                                              <Share2 size={14} /> Share Course
                                            </button>
                                            <button 
                                              onClick={() => {
                                                setSelectedEnrollment(enrollment);
                                                setModalType("rate");
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-amber-500 dark:hover:text-white transition-all text-left"
                                            >
                                              <Star size={14} /> Rate & Review
                                            </button>
                                            <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                                            <button 
                                              onClick={() => {
                                                setSelectedEnrollment(enrollment);
                                                setModalType("unenroll");
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left"
                                            >
                                              <AlertTriangle size={14} /> Un-enroll
                                            </button>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                    <CheckCircle size={16} />
                                    <span>Course Certification Ready</span>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <button
                                      onClick={() => {
                                        if (enrollment.progress.certificate) {
                                            setCertificateToShow({
                                                courseTitle: enrollment.course.title,
                                                certificateId: enrollment.progress.certificate.certificateId,
                                                issuedAt: enrollment.progress.certificate.issuedAt
                                            });
                                        }
                                      }}
                                      className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:translate-y-[-1px] transition-all"
                                    >
                                      <Download size={14} />
                                      Get Certificate
                                    </button>
                                    <div className="relative">
                                      <button 
                                        onClick={() => setActiveMenuId(activeMenuId === enrollment.enrollmentId ? null : enrollment.enrollmentId)}
                                        className={`p-2 rounded-lg transition-colors ${activeMenuId === enrollment.enrollmentId ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white" : "text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"}`}
                                      >
                                        <MoreHorizontal size={18} />
                                      </button>
                                      
                                      <AnimatePresence>
                                        {activeMenuId === enrollment.enrollmentId && (
                                          <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full right-0 mb-2 w-48 py-2 bg-white dark:bg-[#0c0c1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                          >
                                            <button 
                                              onClick={() => {
                                                setSelectedEnrollment(enrollment);
                                                setModalType("share");
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-white transition-all text-left"
                                            >
                                              <Share2 size={14} /> Share Course
                                            </button>
                                            <button 
                                              onClick={() => {
                                                setSelectedEnrollment(enrollment);
                                                setModalType("rate");
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-amber-500 dark:hover:text-white transition-all text-left"
                                            >
                                              <Star size={14} /> Rate & Review
                                            </button>
                                            <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                                            <button 
                                              onClick={() => {
                                                setSelectedEnrollment(enrollment);
                                                setModalType("unenroll");
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left"
                                            >
                                              <AlertTriangle size={14} /> Un-enroll
                                            </button>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
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

            {/* Recommendations section */}
            {recommendations.length > 0 && (
                <div className="mt-20 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-200 dark:to-white/5" />
                        <h2 className={`${montserrat.className} text-sm font-black uppercase tracking-[0.3em] text-slate-400 dark:text-gray-500`}>
                            Recommended for You
                        </h2>
                        <div className="h-px flex-1 bg-linear-to-l from-transparent to-slate-200 dark:to-white/5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendations.map((course, i) => (
                            <Link key={course.id} href={`/courses/${course.slug}`}>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative p-6 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-violet-500/30 transition-all overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-violet-600/10 transition-colors" />
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-4xl shrink-0">
                                            {course.imageUrl ? <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover rounded-2xl" /> : "📚"}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-violet-500 mb-1">{course.category}</p>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-violet-400 transition-colors">{course.title}</h4>
                                            <div className="flex items-center gap-3 mt-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600 px-2 py-1 rounded bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                                    {course.level}
                                                </span>
                                                <span className="text-xs font-black text-slate-900 dark:text-white">
                                                    {course.isFree ? "FREE" : "Premium"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
          </section>

          {/* ── SIDEBAR (SHOW BELOW COURSES ON MOBILE) ── */}
          <aside className="order-2 lg:order-1">
            {/* Desktop greeting (Hidden on mobile) */}
            <div className={`${montserrat.className} hidden lg:block mb-6`}>
              <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-xl font-black text-white mb-3 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-violet-500 dark:to-pink-500 shadow-md dark:shadow-none">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={initials}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {greeting},{" "}
                <span className="text-4xl font-black">{displayName}</span>
              </h1>
              <p className="text-sm mt-0.5 text-slate-500 dark:text-gray-400">
                {enrollments.length === 0
                  ? "Start your learning journey"
                  : `${enrollments.length} course${enrollments.length !== 1 ? "s" : ""} enrolled`}
              </p>
            </div>

            {/* Today's goals */}
            <div className="lumen-sidebar-widget rounded-lg p-4 mb-4 bg-slate-50 dark:bg-[rgba(255,255,255,0.03)] border border-slate-200 dark:border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className="text-yellow-500" fill="#eab308" />
                <h3
                  className={`${montserrat.className} text-sm font-bold text-slate-900 dark:text-white`}
                >
                  Today&apos;s goals
                </h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  {
                    label: "Complete any 3 learning items • 0/3",
                    href: "/courses",
                  },
                  { label: "Complete a reading", href: "/courses?q=reading" },
                  { label: "Continue your weekly streak", href: "/my-courses" },
                ].map((goal, i) => (
                  <li key={i}>
                    <Link
                      href={goal.href}
                      className="flex items-start gap-2.5 text-sm group hover:text-blue-600 dark:hover:text-violet-300 transition-colors text-slate-500 dark:text-gray-400"
                    >
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
              className={`${montserrat.className} lumen-sidebar-widget rounded-lg p-4 mb-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]`}
            >
              <h3 className="text-sm font-bold mb-1 text-slate-900 dark:text-white">
                Learning plan
              </h3>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={prevMonth}
                  className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-400 dark:text-gray-400"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                  {calMonthLabel}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-400 dark:text-gray-400"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {CAL_HEADERS.map((h) => (
                  <div
                    key={h}
                    className="text-center text-[10px] font-bold py-0.5 text-slate-400 dark:text-gray-500"
                  >
                    {h}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-0.5">
                {calCells.map((day, i) => {
                  const isToday =
                    day === todayDate &&
                    calMonth === todayMonth &&
                    calYear === todayYear;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center h-7 text-[11px] font-medium rounded-full mx-2 md:mx-1 ${isToday ? "bg-blue-600 dark:bg-violet-600 text-white font-bold" : day ? "text-slate-600 dark:text-slate-400" : "text-transparent"}`}
                    >
                      {day ?? ""}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upgrade */}
            <div
              className={`${montserrat.className} lumen-sidebar-widget lumen-upgrade-widget rounded-lg p-5 mt-2`}
              style={{
                background: "rgba(124,58,237,0.05)",
                border: "1px solid rgba(124,58,237,0.15)",
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center mb-4">
                <GraduationCap
                  size={20}
                  className="text-violet-500 dark:text-violet-400"
                />
              </div>
              <h3 className="text-sm font-bold mb-1 text-slate-900 dark:text-white">
                Upgrade to Plus
              </h3>
              <p className="text-xs mb-4 text-slate-500 dark:text-gray-400 leading-relaxed">
                Get unlimited access to 7,000+ courses and certifications.
              </p>
              <Link
                href="/pricing"
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                View Plans <ArrowRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!modalLoading) setModalType(null); }}
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setModalType(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Content */}
              <div className="p-8 sm:p-10">
                {modalType === "share" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Share</h2>
                      <p className="text-sm text-slate-500 dark:text-gray-500 font-medium">Show your friends what they can learn on EduNova.</p>
                    </div>

                    <div className="flex justify-between items-center px-2">
                       {[
                         { icon: <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="w-6 h-6" />, label: "LinkedIn" },
                         { icon: <Mail className="text-blue-500" />, label: "Email" },
                         { icon: <MessageCircle className="text-emerald-500" />, label: "WhatsApp" },
                         { icon: <Facebook className="text-blue-600" />, label: "Facebook" },
                         { icon: <Twitter className="text-sky-500" />, label: "X" }
                       ].map((s, i) => (
                         <div key={i} className="flex flex-col items-center gap-3">
                           <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                             {s.icon}
                           </div>
                           <span className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">{s.label}</span>
                         </div>
                       ))}
                    </div>

                    <div className="relative">
                      <input 
                        readOnly
                        value={`https://edunova.org/courses/${selectedEnrollment?.course.slug}`}
                        className="w-full bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/5 rounded-2xl p-4 pr-20 text-sm font-bold text-slate-700 dark:text-gray-300 outline-none"
                      />
                      <button 
                        onClick={() => {
                          const url = `https://edunova.org/courses/${selectedEnrollment?.course.slug}`;
                          navigator.clipboard.writeText(url);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {modalType === "rate" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{selectedEnrollment?.course.title}</h2>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4">Your review</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button 
                              key={s}
                              onMouseEnter={() => setRating(s)}
                              onClick={() => setRating(s)}
                              className={`transition-colors ${rating >= s ? "text-amber-400" : "text-slate-200 dark:text-white/10"}`}
                            >
                              <Star size={24} fill={rating >= s ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-400 dark:text-gray-600 uppercase tracking-widest">
                          {rating === 0 ? "No rating" : `${rating} Stars`}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest px-1">Write your review (optional)</label>
                      <textarea 
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts on this curriculum..."
                        rows={4}
                        className="w-full bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/5 rounded-2xl p-4 text-slate-700 dark:text-white font-medium outline-none focus:border-blue-500/30 transition-all resize-none placeholder:text-slate-300 dark:placeholder:text-gray-700"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                      <p className="text-[9px] text-slate-400 dark:text-gray-600 leading-relaxed max-w-[240px]">
                        By clicking Submit, I agree that my feedback may be viewed by the EduNova community, in compliance with the <span className="text-blue-600 underline cursor-pointer">Terms of Use</span> and privacy settings.
                      </p>
                      <button 
                        disabled={rating === 0 || modalLoading}
                        onClick={async () => {
                          if (!selectedEnrollment) return;
                          setModalLoading(true);
                          try {
                            const res = await backendRequest("/reviews", {
                              method: "POST",
                              body: { courseSlug: selectedEnrollment.course.slug, rating, comment: reviewComment },
                              clerkUserId: user?.id
                            });
                            setModalType(null);
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setModalLoading(false);
                          }
                        }}
                        className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${rating > 0 ? "bg-blue-600 dark:bg-violet-600 text-white shadow-xl shadow-blue-600/20 active:scale-95" : "bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-gray-700 cursor-not-allowed"}`}
                      >
                        {modalLoading ? <Loader2 className="animate-spin" size={16} /> : "Submit"}
                      </button>
                    </div>
                  </div>
                )}

                {modalType === "unenroll" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">Are you sure you want to un-enroll?</h2>
                      <p className="text-sm text-slate-600 dark:text-gray-400 font-medium leading-relaxed">
                        When you un-enroll, this course will no longer appear on your dashboard. Your progress will be saved, and you can re-enroll through the catalog if you change your mind.
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <button 
                        onClick={() => setModalType(null)}
                        className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        disabled={modalLoading}
                        onClick={async () => {
                          if (!selectedEnrollment) return;
                          setModalLoading(true);
                          try {
                            await backendRequest(`/enrollments/${selectedEnrollment.enrollmentId}`, {
                              method: "DELETE",
                              clerkUserId: user?.id
                            });
                            window.location.reload();
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setModalLoading(false);
                          }
                        }}
                        className="flex-1 px-8 py-4 rounded-2xl bg-blue-600 dark:bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 dark:shadow-red-600/30 active:scale-95 transition-all flex items-center justify-center"
                      >
                         {modalLoading ? <Loader2 className="animate-spin" size={16} /> : "Yes, un-enroll"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />

      {certificateToShow && (
          <CertificateModal 
            isOpen={true}
            onClose={() => setCertificateToShow(null)}
            courseTitle={certificateToShow.courseTitle}
            studentName={user?.fullName || displayName}
            issueDate={new Date(certificateToShow.issuedAt)}
            certificateId={certificateToShow.certificateId}
          />
      )}
    </div>
  );
}

