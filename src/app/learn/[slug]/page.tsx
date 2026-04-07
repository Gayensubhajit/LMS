"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";
// Removed static import
import { backendRequest } from "@/lib/backend-client";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Download,
  LayoutList,
  Lock,
  MessageSquare,
  NotebookPen,
  PlayCircle,
  Sparkles,
  Video,
  X,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";
import CourseVideoPlayer, { CourseVideoPlayerRef } from "@/components/lms/CourseVideoPlayer";
import CertificateModal from "@/components/lms/CertificateModal";
import QuizComponent from "@/components/lms/QuizComponent";
import LessonNotes from "@/components/lms/LessonNotes";
import CodePlayground from "@/components/lms/CodePlayground";
import CourseAssistant from "@/components/lms/CourseAssistant";
import { motion, AnimatePresence } from "framer-motion";
import { dark } from "@clerk/themes";
import confetti from "canvas-confetti";

// ── Types ──────────────────────────────────────────────────────────────────────
type TranscriptEntry = { time: string; text: string };
type Resource = {
  label: string;
  url: string;
  title?: string;
  type?: string;
  size?: string;
};
type LessonContent = {
  transcript?: TranscriptEntry[];
  resources?: Resource[];
  notes?: string | null;
};

type BackendLesson = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  content: LessonContent | null;
  durationMins: number | null;
  position: number;
  isPreview: boolean;
};

type BackendSection = {
  id: string;
  title: string;
  position: number;
  lessons: BackendLesson[];
};

type Tab = "transcript" | "notes" | "downloads" | "quiz" | "lab";

// ── Constants ──────────────────────────────────────────────────────────────────
const FALLBACK_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const AI_SUGGESTIONS = [
  "Explain this topic in simple terms",
  "Give me a summary",
  "Give me a practice question",
  "Give me real-life examples",
];

// ─────────────────────────────────────────────────────────────────────────────
export default function LearnCoursePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const [course, setCourse] = useState<any>(null);
  const [courseLoaded, setCourseLoaded] = useState(false);
  const [backendSections, setBackendSections] = useState<BackendSection[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [initialTime, setInitialTime] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [hasEnrollment, setHasEnrollment] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [markingDone, setMarkingDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("transcript");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [userNote, setUserNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coachInput, setCoachInput] = useState("");
  const [showCertModal, setShowCertModal] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [activeTime, setActiveTime] = useState(0);
  const playerRef = useRef<CourseVideoPlayerRef>(null);

  // flat lesson list
  const lessonItems = useMemo(
    () =>
      backendSections.flatMap((s) =>
        s.lessons.map((l) => ({
          ...l,
          sectionTitle: s.title,
          sectionId: s.id,
        })),
      ),
    [backendSections],
  );

  // ── Data fetching ─────────────────────────────────────────────────────────
  useEffect(() => {
    const run = async () => {
      if (!isLoaded) return;
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        // Fetch course details first
        const courseRes = await backendRequest<{ok: boolean, item: any}>(`/courses/${slug}`);
        if (!courseRes.ok || !courseRes.item) {
          setError("Course not found");
          setLoading(false);
          setCourseLoaded(true);
          return;
        }
        
        // Merge with local utils using a dynamic import to avoid breaking the client component
        const { mergeCourse } = await import("@/lib/course-utils");
        setCourse(mergeCourse(courseRes.item));
        setCourseLoaded(true);

        const lessonsRes = await backendRequest<{
          ok: true;
          item: { sections: BackendSection[] };
        }>(`/courses/${slug}/lessons`, { clerkUserId: user.id });
        setBackendSections(lessonsRes.item.sections);

        // Expand all sections by default
        setExpandedSections(new Set(lessonsRes.item.sections.map((s) => s.id)));

        const progressRes = await backendRequest<{
          ok: true;
          item: { progressPercent: number; hasActiveEnrollment: boolean };
        }>(`/progress/courses/${slug}`, { clerkUserId: user.id });
        setProgressPercent(progressRes.item.progressPercent);
        setHasEnrollment(progressRes.item.hasActiveEnrollment);

        const nextRes = await backendRequest<{
          ok: true;
          item: { nextLesson: { id: string, lastPlayedSeconds?: number } | null };
        }>(`/progress/courses/${slug}/continue`, { clerkUserId: user.id });

        const next = nextRes.item.nextLesson;
        const fallbackId = lessonsRes.item.sections[0]?.lessons[0]?.id ?? "";
        setActiveLessonId(next?.id ?? fallbackId);
        if (next?.lastPlayedSeconds) {
          setInitialTime(next.lastPlayedSeconds);
        }

        // Check for certificates if completion is high
        if (progressRes.item.progressPercent === 100) {
           const certsRes = await backendRequest<{ ok: true; certificates: any[] }>("/accomplishments", { clerkUserId: user.id });
           const cert = certsRes.certificates.find((c: any) => c.course.slug === slug);
           if (cert) {
              setCertificateData(cert);
           }
        }
      } catch (err) {
        setError((err as Error).message || "Failed to load learning data");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [isLoaded, slug, user?.id]);

  useEffect(() => {
    // Confetti if just hit 100%
    if (progressPercent === 100 && !certificateData) {
       // @ts-ignore
       confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [progressPercent]);

  // Reset tab when lesson changes
  useEffect(() => {
    setActiveTab("transcript");
  }, [activeLessonId]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const activeLesson =
    lessonItems.find((l) => l.id === activeLessonId) ?? lessonItems[0];

  const navToLesson = (id: string) => {
    setActiveLessonId(id);
    setSidebarOpen(false);
  };

  const navToNext = () => {
    const idx = lessonItems.findIndex((l) => l.id === activeLessonId);
    const next = lessonItems[idx + 1];
    if (next) setActiveLessonId(next.id);
  };

  const markCompleted = async () => {
    if (!activeLesson || !user?.id || markingDone) return;
    setMarkingDone(true);
    try {
      await backendRequest(`/progress/lessons/${activeLesson.id}`, {
        method: "POST",
        clerkUserId: user.id,
        body: { isCompleted: true },
      });
      setCompleted((prev) => {
        const n = new Set(prev);
        n.add(activeLesson.id);
        return n;
      });
      const progressRes = await backendRequest<{
        ok: true;
        item: { progressPercent: number };
      }>(`/progress/courses/${slug}`, { clerkUserId: user.id });
      setProgressPercent(progressRes.item.progressPercent);
      navToNext();
    } catch {
      // silently fail
    } finally {
      setMarkingDone(false);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleProgressSync = async (seconds: number) => {
    setActiveTime(seconds);
    if (!activeLessonId || !user?.id) return;
    try {
      await backendRequest(`/progress/lessons/${activeLessonId}/watch`, {
        method: "PATCH",
        clerkUserId: user.id,
        body: { seconds }
      });
    } catch { /* background sync, fail silently */ }
  };

  const saveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // ── Guards ────────────────────────────────────────────────────────────────

  // Check if data is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Check if user is signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#080a10] text-foreground flex items-center justify-center pt-20">
        <SignIn />
      </div>
    );
  }

  // Check if course is available
  if (courseLoaded && !course) {
    return (
      <main className="min-h-screen bg-[#f6f8ff] dark:bg-background text-slate-900 dark:text-foreground flex items-center justify-center px-6">
        <div className="bg-white dark:bg-transparent dark:glass-card rounded-3xl p-10 max-w-md text-center border border-slate-200 dark:border-none shadow-sm dark:shadow-none">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Course not found
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mb-6">
            The learning path is unavailable.
          </p>
          <Link
            href="/courses"
            className="inline-flex bg-linear-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Browse Courses
          </Link>
        </div>
      </main>
    );
  }

  const displayProgress = lessonItems.length
    ? Math.max(
        progressPercent,
        Math.round((completed.size / lessonItems.length) * 100),
      )
    : progressPercent;

  const currentIdx = lessonItems.findIndex((l) => l.id === activeLessonId);
  const totalLessons = lessonItems.length;
  const nextLesson = lessonItems[currentIdx + 1];
  const transcript = activeLesson?.content?.transcript ?? [];
  const resources = activeLesson?.content?.resources ?? [];
  const lessonNote = activeLesson?.content?.notes ?? "";

  // ── Loading UI ────────────────────────────────────────────────────────────
  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen bg-[#f6f8ff] dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-gray-500 text-sm">Loading your lessons…</p>
        </div>
      </main>
    );
  }

  // ── Error UI ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f8ff] dark:bg-background flex items-center justify-center px-6">
        <div className="bg-white dark:bg-transparent dark:glass-card rounded-3xl p-10 max-w-md text-center border border-slate-200 dark:border-none shadow-sm dark:shadow-none">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Could not load lessons
          </h2>
          <p className="text-red-500 dark:text-red-400 text-sm mb-1">{error}</p>
          <p className="text-slate-400 dark:text-gray-600 text-xs">
            cd backend &amp;&amp; npm run dev
          </p>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="h-screen bg-[#f6f8ff] dark:bg-background text-slate-900 dark:text-foreground flex flex-col overflow-hidden">
      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 h-14 sticky top-0 z-50 shrink-0 bg-white/95 dark:bg-[#08080f]/97 border-b border-slate-200 dark:border-violet-500/18 backdrop-blur-md"
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/my-courses"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors shrink-0 flex items-center gap-1"
          >
            <ChevronRight size={12} className="rotate-180" />
            My Learning
          </Link>
          <span className="text-slate-400 dark:text-gray-700 hidden sm:block text-xs">|</span>
          <span className="text-slate-900 dark:text-white font-semibold text-sm truncate hidden sm:block max-w-xs">
            {course.title}
          </span>
        </div>

        {/* Center — progress */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-gray-500">
            {currentIdx + 1} / {totalLessons} lessons
          </span>
          <div className="w-36 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${displayProgress}%`,
                background: "linear-gradient(90deg,#7c3aed,#a855f7,#ec4899)",
                boxShadow: "0 0 8px rgba(168,85,247,0.5)",
              }}
            />
          </div>
          <span className="text-xs text-violet-400 font-bold">
            {displayProgress}%
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <LayoutList size={18} />
          </button>
          {progressPercent === 100 && (
            <button
               onClick={() => setShowCertModal(true)}
               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/20"
            >
               <Award size={14} />
               Claim Certificate
            </button>
          )}
          <Link
            href={`/courses/${course.slug}`}
            className="hidden sm:block text-xs text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300 transition-colors"
          >
            Course Info
          </Link>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
        <>
          {/* Mobile overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          <aside
            className={`
              w-80 shrink-0 flex flex-col overflow-hidden transition-transform duration-300
              fixed inset-y-14 left-0 z-40 lg:relative lg:inset-auto lg:translate-x-0
              bg-slate-50 dark:bg-[#0a0a14] border-r border-slate-200 dark:border-violet-500/15
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            {/* Sidebar header */}
            <div
              className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-slate-200 dark:border-violet-500/12"
            >
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-500 mb-0.5">
                  Course Content
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-500">
                  {totalLessons} lessons · {displayProgress}% complete
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 dark:text-gray-600 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Section list */}
            <div className="flex-1 overflow-y-auto py-2">
              {backendSections.map((section) => {
                const isExpanded = expandedSections.has(section.id);
                const sectionDone = section.lessons.filter((l) =>
                  completed.has(l.id),
                ).length;
                return (
                  <div key={section.id}>
                    {/* Section header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-200/50 dark:hover:bg-white/3 transition-colors group"
                    >
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[11px] font-bold text-slate-700 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight">
                          {section.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-gray-600 mt-0.5">
                          {sectionDone}/{section.lessons.length} done
                        </p>
                      </div>
                      <ChevronDown
                        size={14}
                        className={`text-gray-600 shrink-0 ml-2 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Lessons */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {section.lessons.map((lesson) => {
                            const isDone = completed.has(lesson.id);
                            const isActive = lesson.id === activeLessonId;
                            const isLocked =
                              !hasEnrollment && !lesson.isPreview;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() =>
                                  !isLocked && navToLesson(lesson.id)
                                }
                                disabled={isLocked}
                                className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-all duration-150 border-l-2 ${
                                  isActive
                                    ? "bg-blue-50 dark:bg-violet-500/10 border-blue-600 dark:border-violet-500"
                                    : "border-transparent hover:bg-slate-200/30 dark:hover:bg-white/4 hover:border-slate-300 dark:hover:border-violet-500/30"
                                } ${isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                              >
                                {/* Icon */}
                                <div className="mt-0.5 shrink-0">
                                  {isLocked ? (
                                    <Lock size={12} className="text-slate-400 dark:text-gray-600" />
                                  ) : isDone ? (
                                    <CheckCircle2
                                      size={12}
                                      className="text-emerald-500 dark:text-violet-400"
                                      fill={isDone ? "currentColor" : "transparent"}
                                      strokeWidth={isDone ? 2 : 1}
                                    />
                                  ) : isActive ? (
                                    <PlayCircle
                                      size={12}
                                      className="text-blue-600 dark:text-violet-400"
                                      fill="currentColor"
                                    />
                                  ) : (
                                    <Video
                                      size={12}
                                      className="text-slate-400 dark:text-gray-600"
                                    />
                                  )}
                                </div>
                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-xs leading-snug ${
                                      isActive
                                        ? "text-slate-900 dark:text-white font-bold"
                                        : isDone
                                          ? "text-slate-500 dark:text-gray-400"
                                          : "text-slate-600 dark:text-gray-400 font-medium"
                                    }`}
                                  >
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {lesson.durationMins && (
                                      <p className="text-[10px] text-gray-600">
                                        {lesson.durationMins}m
                                      </p>
                                    )}
                                    {lesson.isPreview && !hasEnrollment && (
                                      <span className="text-[9px] text-violet-400 border border-violet-500/30 px-1 py-0.5 rounded">
                                        FREE
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </aside>
        </>

        {/* ── MAIN CONTENT AREA ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {activeLesson ? (
            <div>
              {/* VIDEO PLAYER — Coursera-style: padded, max-width, not full-bleed */}
              <div
                className="w-full bg-white dark:bg-[#0a0a14] border-b border-slate-200 dark:border-violet-500/10"
              >
                <div className="max-w-5xl mx-auto px-4 sm:px-8 py-4 sm:py-5">
                  {hasEnrollment || activeLesson.isPreview ? (
                    <div
                      className="overflow-hidden rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-violet-500/20 transition-all duration-700"
                    >
                      <CourseVideoPlayer
                        ref={playerRef}
                        url={activeLesson.videoUrl ?? FALLBACK_VIDEO}
                        title={activeLesson.title}
                        lessonId={activeLesson.id}
                        initialTime={initialTime}
                        onTimeUpdate={handleProgressSync}
                        startSec={
                          (activeLesson.content as { startSec?: number } | null)
                            ?.startSec ?? 0
                        }
                        endSec={
                          (activeLesson.content as { endSec?: number } | null)
                            ?.endSec
                        }
                        onEnded={markCompleted}
                        nextLessonTitle={nextLesson?.title}
                        onNextUpConfirm={markCompleted}
                      />
                    </div>
                  ) : (
                    /* Locked state */
                    <div
                      className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#140a32]/98 dark:to-[#08080f] border border-slate-300 dark:border-violet-500/15 transition-colors duration-700"
                      style={{
                        aspectRatio: "16/9",
                        maxHeight: "520px",
                      }}
                    >
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center p-8 glass-card rounded-3xl max-w-sm">
                          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-violet-600/20 border border-blue-200 dark:border-violet-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                            {course.emoji}
                          </div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                            Lesson Locked
                          </h3>
                          <p className="text-slate-500 dark:text-gray-400 text-sm mb-5 leading-relaxed">
                            This lesson is for enrolled students only. Enroll to
                            unlock the full curriculum.
                          </p>
                          <Link
                            href="/pricing"
                            className="inline-flex px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-violet-600/30 transition-all"
                          >
                            Unlock Course
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* LESSON META + ACTIONS */}
              <div className="max-w-5xl mx-auto px-4 sm:px-8 py-5">
                {/* Section breadcrumb */}
                <p className="text-xs text-blue-600 dark:text-violet-400 font-bold mb-1 uppercase tracking-wider">
                  {activeLesson.sectionTitle}
                </p>

                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {activeLesson.title}
                    </h1>
                    {activeLesson.description && (
                      <p className="text-slate-500 dark:text-gray-400 text-sm mt-1.5 leading-relaxed font-medium">
                        {activeLesson.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {hasEnrollment || activeLesson.isPreview ? (
                      <button
                        onClick={markCompleted}
                        disabled={completed.has(activeLesson.id) || markingDone}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${
                          completed.has(activeLesson.id)
                            ? "bg-emerald-50 dark:bg-violet-500/15 border border-emerald-500/30 dark:border-violet-500/40 text-emerald-600 dark:text-violet-400"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-500 text-white shadow-md shadow-blue-500/20 dark:shadow-violet-500/20 hover:shadow-lg"
                        }`}
                      >
                        {completed.has(activeLesson.id) ? (
                          <>
                            <CheckCircle2 size={14} /> Completed
                          </>
                        ) : markingDone ? (
                          "Saving…"
                        ) : (
                          "Mark Complete"
                        )}
                      </button>
                    ) : null}

                    {currentIdx < totalLessons - 1 && (
                      <button
                        onClick={navToNext}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-blue-500/40 dark:hover:border-violet-500/40 transition-all shadow-sm dark:shadow-none"
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* ── AI COACH BLOCK ──────────────────────────────────── */}
                <div
                  className="rounded-2xl mb-6 overflow-hidden bg-indigo-50/50 dark:bg-slate-900/80 border border-indigo-100 dark:border-violet-500/20 shadow-sm dark:shadow-none"
                >
                  <div className="hidden sm:flex items-center gap-3 px-4 py-3 border-b border-indigo-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/10 dark:bg-violet-600/20 border border-blue-600/20 dark:border-violet-500/30 flex items-center justify-center shrink-0">
                      <Sparkles size={13} className="text-blue-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        EduNova Coach
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-600">
                        AI-powered learning assistant • Powered by GPT-4
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-500">
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-400 mb-2 sm:mb-3 font-medium">
                      Ask the AI Coach anything about this lesson:
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                      {AI_SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => setCoachInput(s)}
                          className="text-[9px] sm:text-[11px] px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border transition-all flex items-center gap-1.5 bg-blue-50 dark:bg-violet-500/5 border-blue-100 dark:border-violet-500/15 text-blue-700 dark:text-violet-300 font-bold"
                        >
                          <Sparkles size={9} className="sm:size-[10px]" />
                          {s}
                        </button>
                      ))}
                    </div>
                    {coachInput && (
                      <div className="flex gap-2 items-center">
                        <input
                          value={coachInput}
                          onChange={(e) => setCoachInput(e.target.value)}
                          className="flex-1 text-xs bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-violet-500/50 transition-colors shadow-inner"
                          placeholder="Ask the coach anything..."
                          onKeyDown={(e) =>
                            e.key === "Escape" && setCoachInput("")
                          }
                        />
                        <button
                          onClick={() => setCoachInput("")}
                          className="p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/5"
                        >
                          <X size={14} />
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-500 shadow-md shadow-blue-500/20 dark:shadow-violet-500/20"
                        >
                          Ask →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── TABS ────────────────────────────────────────────── */}
                <div className="mb-5 border-b border-slate-200 dark:border-violet-500/15">
                  <div className="flex gap-0 overflow-x-auto no-scrollbar">
                    {(
                      [
                        {
                          id: "transcript",
                          label: "Transcript",
                          icon: <MessageSquare size={13} />,
                        },
                        {
                          id: "notes",
                          label: "Notes",
                          icon: <NotebookPen size={13} />,
                        },
                        {
                          id: "quiz",
                          label: "Quiz",
                          icon: <HelpCircle size={13} />,
                        },
                        {
                          id: "lab",
                          label: "Lab",
                          icon: <Sparkles size={13} />,
                        },
                        {
                          id: "downloads",
                          label: "Downloads",
                          icon: <Download size={13} />,
                        },
                      ] as { id: Tab; label: string; icon: React.ReactNode }[]
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all relative border-b-2
                          ${
                            activeTab === tab.id
                              ? "text-blue-600 dark:text-violet-300 border-blue-600 dark:border-violet-500"
                              : "text-slate-500 dark:text-gray-500 border-transparent hover:text-slate-900 dark:hover:text-gray-300"
                          }
                        `}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAB: Transcript */}
                {activeTab === "transcript" && (
                  <div className="space-y-3 pb-10">
                    {transcript.length > 0 ? (
                      transcript.map((entry, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex gap-4 group cursor-pointer"
                        >
                          <span
                            className="text-xs font-mono shrink-0 mt-0.5 px-2 py-0.5 rounded font-bold transition-colors bg-blue-50/80 dark:bg-violet-500/10 text-blue-600 dark:text-violet-400"
                            style={{
                              minWidth: "3.5rem",
                              textAlign: "center",
                            }}
                          >
                            {entry.time}
                          </span>
                          <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {entry.text}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <MessageSquare
                          size={32}
                          className="text-slate-400 dark:text-gray-700 mx-auto mb-3"
                        />
                        <p className="text-slate-500 dark:text-gray-600 text-sm">
                          No transcript available for this lesson.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: Notes */}
                {activeTab === "notes" && (
                  <div className="pb-10">
                    <LessonNotes 
                      lessonId={activeLesson.id} 
                      currentTime={activeTime} 
                      onSeek={(s) => playerRef.current?.seekTo(s)}
                    />
                  </div>
                )}

                {/* TAB: Quiz */}
                {activeTab === "quiz" && (
                  <div className="pb-10 min-h-[400px]">
                    <QuizComponent sectionId={activeLesson.sectionId} />
                  </div>
                )}

                {/* TAB: Lab */}
                {activeTab === "lab" && (
                  <div className="pb-10 min-h-[500px]">
                    <CodePlayground />
                  </div>
                )}

                {/* TAB: Downloads */}
                {activeTab === "downloads" && (
                  <div className="pb-10">
                    {resources && resources.length > 0 ? (
                      <div className="space-y-3">
                        {resources.map((r, i) => (
                          <a
                            key={i}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-violet-500/50 transition-all group shadow-sm dark:shadow-none"
                          >
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-violet-500/10 flex items-center justify-center shrink-0 border border-blue-100 dark:border-violet-500/20">
                              <Download
                                size={18}
                                className="text-blue-600 dark:text-violet-400"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {r.title || r.label || "Resource File"}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-gray-500 font-medium uppercase tracking-wider">
                                {r.type || "FILE"} • {r.size || "Unknown Size"}
                              </p>
                            </div>
                            <ArrowUpRight
                              size={14}
                              className="text-slate-300 dark:text-gray-700 group-hover:text-blue-600 dark:group-hover:text-violet-400 transition-colors"
                            />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-slate-50/50 dark:bg-white/2 rounded-3xl border border-dashed border-slate-200 dark:border-white/5">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Download
                            size={24}
                            className="text-slate-400 dark:text-gray-700"
                          />
                        </div>
                        <p className="text-slate-500 dark:text-gray-500 text-sm font-medium">
                          No downloadable assets for this lesson.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <footer className="max-w-5xl mx-auto px-4 sm:px-8 py-10 mt-10 border-t border-slate-200 dark:border-white/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-[2rem] bg-indigo-50/30 dark:bg-white/5 border border-indigo-100/50 dark:border-white/5 shadow-sm dark:shadow-none">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-violet-600/20 flex items-center justify-center border border-blue-600/20 dark:border-violet-500/20">
                      <HelpCircle
                        size={28}
                        className="text-blue-600 dark:text-violet-400"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        Need assistance, Explorer?
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400">
                        Our support crew is always on standby for your mission.
                      </p>
                    </div>
                  </div>
                  <button className="px-8 py-3 rounded-xl bg-white dark:bg-white/10 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/20 transition-all shadow-sm">
                    Contact Support
                  </button>
                </div>
              </footer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f6f8ff] dark:bg-background">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
                <span className="text-4xl">{course?.emoji || "📚"}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Select a lesson to begin
              </h3>
              <p className="text-slate-500 dark:text-gray-400 max-w-xs mx-auto text-sm">
                Choose any lesson from the sidebar to start your interstellar
                learning journey.
              </p>
            </div>
          )}
        </div>
      </div>

      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        courseTitle={course?.title}
        studentName={
          certificateData?.verifiedName || user?.fullName || "Explorer"
        }
        issueDate={
          certificateData?.issuedAt
            ? new Date(certificateData.issuedAt)
            : new Date()
        }
        certificateId={
          certificateData?.certificateId ||
          "CERT-" + Math.random().toString(36).substring(7).toUpperCase()
        }
      />
    </main>
  );
}
