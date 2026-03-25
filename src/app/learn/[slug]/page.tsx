"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getCourseBySlug } from "@/lib/courses-data";
import { backendRequest } from "@/lib/backend-client";
import { CheckCircle2, ChevronRight, Circle, Lock, PlayCircle } from "lucide-react";

type BackendLesson = {
  id: string;
  title: string;
  description: string | null;
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

export default function LearnCoursePage() {
  const { user, isLoaded } = useUser();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const course = getCourseBySlug(slug);

  const [backendSections, setBackendSections] = useState<BackendSection[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [hasEnrollment, setHasEnrollment] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [markingDone, setMarkingDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lessonItems = useMemo(
    () =>
      backendSections.flatMap((section) =>
        section.lessons.map((lesson) => ({
          ...lesson,
          sectionTitle: section.title,
        }))
      ),
    [backendSections]
  );

  useEffect(() => {
    const run = async () => {
      if (!isLoaded) return;
      if (!user?.id) { setLoading(false); return; }
      try {
        const lessonsRes = await backendRequest<{ ok: true; item: { sections: BackendSection[] } }>(
          `/courses/${slug}/lessons`, { clerkUserId: user.id }
        );
        setBackendSections(lessonsRes.item.sections);

        const progressRes = await backendRequest<{
          ok: true; item: { progressPercent: number; hasActiveEnrollment: boolean };
        }>(`/progress/courses/${slug}`, { clerkUserId: user.id });
        setProgressPercent(progressRes.item.progressPercent);
        setHasEnrollment(progressRes.item.hasActiveEnrollment);

        const nextRes = await backendRequest<{
          ok: true; item: { nextLesson: { id: string } | null };
        }>(`/progress/courses/${slug}/continue`, { clerkUserId: user.id });

        const nextId = nextRes.item.nextLesson?.id;
        const fallbackId = lessonsRes.item.sections[0]?.lessons[0]?.id ?? "";
        setActiveLessonId(nextId ?? fallbackId);
      } catch (err) {
        setError((err as Error).message || "Failed to load learning data");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [isLoaded, slug, user?.id]);

  const activeLesson = lessonItems.find((l) => l.id === activeLessonId) ?? lessonItems[0];

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
      setCompleted((prev) => { const n = new Set(prev); n.add(activeLesson.id); return n; });
      const progressRes = await backendRequest<{ ok: true; item: { progressPercent: number } }>(
        `/progress/courses/${slug}`, { clerkUserId: user.id }
      );
      setProgressPercent(progressRes.item.progressPercent);
      // Auto-advance to next lesson
      navToNext();
    } catch (err) {
      setError((err as Error).message || "Unable to update progress");
    } finally {
      setMarkingDone(false);
    }
  };

  if (!course) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="glass-card rounded-3xl border border-violet-500/20 p-10 max-w-md text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-black text-white mb-2">Course not found</h1>
          <p className="text-gray-400 mb-6">The learning path is unavailable.</p>
          <Link href="/courses" className="inline-flex bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
            Browse Courses
          </Link>
        </div>
      </main>
    );
  }

  const displayProgress = lessonItems.length
    ? Math.max(progressPercent, Math.round((completed.size / lessonItems.length) * 100))
    : progressPercent;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header
        className="flex items-center justify-between px-6 py-3 sticky top-0 z-40"
        style={{ background: "rgba(10,10,20,0.95)", borderBottom: "1px solid rgba(124,58,237,0.2)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/my-courses" className="text-violet-300 hover:text-violet-200 text-sm flex-shrink-0">← My Courses</Link>
          <span className="text-gray-700 hidden sm:block">|</span>
          <span className="text-white font-semibold text-sm truncate hidden sm:block">{course.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-col items-end hidden sm:flex">
            <span className="text-xs text-gray-500 mb-0.5">{displayProgress}% complete</span>
            <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${displayProgress}%`, background: "linear-gradient(90deg,#7c3aed,#a855f7)" }}
              />
            </div>
          </div>
          <Link href={`/courses/${course.slug}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors hidden sm:block">
            Course details
          </Link>
        </div>
      </header>

      {!isLoaded || loading ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading your lessons…</p>
          </div>
        </div>
      ) : !user?.id ? (
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <div className="glass-card rounded-3xl border border-violet-500/20 p-10 max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Sign in required</h2>
            <p className="text-gray-400 mb-6">Please sign in to access your learning player.</p>
            <Link href="/auth/sign-in" className="inline-flex bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <div className="glass-card rounded-3xl border border-red-500/20 p-8 max-w-md text-center">
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-57px)]">
          {/* Sidebar */}
          <aside
            className="w-72 flex-shrink-0 hidden lg:flex flex-col overflow-hidden"
            style={{ borderRight: "1px solid rgba(124,58,237,0.15)", background: "rgba(12,12,25,0.98)" }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(124,58,237,0.15)" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">Course Content</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{lessonItems.length} lessons</span>
                <span className="text-xs text-violet-400 font-semibold">{displayProgress}%</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {backendSections.map((section) => (
                <div key={section.id}>
                  <div className="px-4 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-600">{section.title}</p>
                  </div>
                  {section.lessons.map((lesson) => {
                    const isDone = completed.has(lesson.id);
                    const isActive = lesson.id === activeLessonId;
                    const isLocked = !hasEnrollment && !lesson.isPreview;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && setActiveLessonId(lesson.id)}
                        disabled={isLocked}
                        className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                          isActive ? "bg-violet-500/15" : "hover:bg-white/5"
                        } ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isLocked ? (
                            <Lock size={13} className="text-gray-600" />
                          ) : isDone ? (
                            <CheckCircle2 size={13} className="text-violet-400" fill="rgba(124,58,237,0.3)" />
                          ) : isActive ? (
                            <PlayCircle size={13} className="text-violet-400" fill="rgba(124,58,237,0.3)" />
                          ) : (
                            <Circle size={13} className="text-gray-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug ${isActive ? "text-white font-semibold" : "text-gray-400"}`}>
                            {lesson.title}
                          </p>
                          {lesson.durationMins && (
                            <p className="text-[10px] text-gray-700 mt-0.5">{lesson.durationMins}m</p>
                          )}
                        </div>
                        {lesson.isPreview && !hasEnrollment && (
                          <span className="text-[9px] text-violet-400 border border-violet-500/30 px-1 py-0.5 rounded flex-shrink-0">FREE</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </aside>

          {/* Main Player */}
          <div className="flex-1 overflow-y-auto">
            {activeLesson ? (
              <>
                {/* Video area */}
                <div
                  className="aspect-video w-full flex items-center justify-center relative"
                  style={{ background: "linear-gradient(135deg,rgba(30,12,60,0.9),rgba(15,15,30,1))" }}
                >
                  <div className="text-center">
                    <div className="text-8xl mb-4">{course.emoji}</div>
                    <p className="text-gray-500 text-sm">
                      {hasEnrollment || activeLesson.isPreview
                        ? "Video player will be connected when video URLs are added"
                        : "Enroll to watch this lesson"}
                    </p>
                  </div>
                  {/* Lesson indicator */}
                  <div
                    className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs text-white font-semibold"
                    style={{ background: "rgba(124,58,237,0.4)", border: "1px solid rgba(124,58,237,0.5)" }}
                  >
                    {lessonItems.findIndex(l => l.id === activeLessonId) + 1} / {lessonItems.length}
                  </div>
                </div>

                {/* Lesson info */}
                <div className="max-w-4xl mx-auto px-6 py-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-violet-400 font-semibold mb-1">{activeLesson.sectionTitle}</p>
                      <h1 className="text-2xl font-black text-white">{activeLesson.title}</h1>
                      {activeLesson.description && (
                        <p className="text-gray-400 text-sm mt-2">{activeLesson.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {hasEnrollment || activeLesson.isPreview ? (
                        <button
                          onClick={markCompleted}
                          disabled={completed.has(activeLesson.id) || markingDone}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                          style={{
                            background: completed.has(activeLesson.id)
                              ? "rgba(124,58,237,0.2)"
                              : "linear-gradient(135deg,#7c3aed,#a855f7)",
                            border: completed.has(activeLesson.id) ? "1px solid rgba(124,58,237,0.4)" : "none",
                            color: completed.has(activeLesson.id) ? "#a78bfa" : "white",
                          }}
                        >
                          {completed.has(activeLesson.id) ? (
                            <><CheckCircle2 size={14} /> Completed</>
                          ) : markingDone ? (
                            "Saving…"
                          ) : (
                            <>Mark Complete</>
                          )}
                        </button>
                      ) : (
                        <Link
                          href={`/checkout?slug=${encodeURIComponent(slug)}&plan=1month`}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                          style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                        >
                          Enroll to Continue
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Next lesson button */}
                  {lessonItems.findIndex(l => l.id === activeLessonId) < lessonItems.length - 1 && (
                    <button
                      onClick={navToNext}
                      className="flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200 transition-colors"
                    >
                      Next lesson <ChevronRight size={14} />
                      <span className="text-gray-500">
                        {lessonItems[lessonItems.findIndex(l => l.id === activeLessonId) + 1]?.title}
                      </span>
                    </button>
                  )}

                  {/* Mobile lesson list */}
                  <div className="mt-6 lg:hidden">
                    <p className="text-sm font-bold text-white mb-3">Course Lessons</p>
                    <div className="space-y-1">
                      {lessonItems.map((lesson) => {
                        const isDone = completed.has(lesson.id);
                        const isActive = lesson.id === activeLessonId;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLessonId(lesson.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-xs transition-colors ${
                              isActive ? "bg-violet-500/15 text-white" : "text-gray-400 hover:bg-white/5"
                            }`}
                          >
                            {isDone
                              ? <CheckCircle2 size={12} className="text-violet-400 flex-shrink-0" />
                              : <Circle size={12} className="text-gray-700 flex-shrink-0" />
                            }
                            {lesson.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-5xl mb-4">{course.emoji}</div>
                  <p className="text-gray-400 text-sm">
                    {lessonItems.length === 0
                      ? "No lessons available yet for this course."
                      : "Select a lesson to begin."}
                  </p>
                  {!hasEnrollment && (
                    <Link
                      href={`/checkout?slug=${encodeURIComponent(slug)}&plan=1month`}
                      className="inline-flex mt-4 px-6 py-3 rounded-xl text-white font-semibold text-sm"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                    >
                      Enroll Now
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
