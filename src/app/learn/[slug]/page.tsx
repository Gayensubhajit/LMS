"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getCourseBySlug } from "@/lib/courses-data";
import { backendRequest } from "@/lib/backend-client";

type BackendLesson = {
  id: string;
  title: string;
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
  if (!course) {
    return (
      <main className="min-h-screen bg-background text-foreground px-6 py-14">
        <div className="max-w-2xl mx-auto glass-card rounded-3xl border border-violet-500/20 p-8">
          <h1 className="text-3xl font-black text-white mb-2">Course not found</h1>
          <p className="text-gray-400 mb-6">The selected learning path is unavailable.</p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  const [backendSections, setBackendSections] = useState<BackendSection[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lessonItems = useMemo(
    () =>
      backendSections.flatMap((section) =>
        section.lessons.map((lesson) => ({
          id: lesson.id,
          module: section.title,
          title: lesson.title
        }))
      ),
    [backendSections]
  );

  useEffect(() => {
    const run = async () => {
      if (!isLoaded) return;
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const lessonsRes = await backendRequest<{
          ok: true;
          item: { sections: BackendSection[] };
        }>(`/courses/${slug}/lessons`, {
          clerkUserId: user.id
        });

        setBackendSections(lessonsRes.item.sections);

        const progressRes = await backendRequest<{
          ok: true;
          item: { progressPercent: number };
        }>(`/progress/courses/${slug}`, {
          clerkUserId: user.id
        });
        setProgressPercent(progressRes.item.progressPercent);

        const nextRes = await backendRequest<{
          ok: true;
          item: { nextLesson: { id: string } | null };
        }>(`/progress/courses/${slug}/continue`, {
          clerkUserId: user.id
        });

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

  const progress = lessonItems.length
    ? Math.max(progressPercent, Math.round((completed.size / lessonItems.length) * 100))
    : progressPercent;

  const activeLesson = lessonItems.find((lesson) => lesson.id === activeLessonId) ?? lessonItems[0];

  const markCompleted = async () => {
    if (!activeLesson) return;
    if (!user?.id) return;

    try {
      await backendRequest(`/progress/lessons/${activeLesson.id}`, {
        method: "POST",
        clerkUserId: user.id,
        body: { isCompleted: true }
      });
      setCompleted((prev) => {
        const next = new Set(prev);
        next.add(activeLesson.id);
        return next;
      });

      const progressRes = await backendRequest<{
        ok: true;
        item: { progressPercent: number };
      }>(`/progress/courses/${slug}`, {
        clerkUserId: user.id
      });
      setProgressPercent(progressRes.item.progressPercent);
    } catch (err) {
      setError((err as Error).message || "Unable to update lesson progress");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <Link href="/my-courses" className="text-violet-300 text-sm hover:text-violet-200">
              ← Back to My Courses
            </Link>
            <h1 className="text-3xl font-black text-white mt-2">{course.title}</h1>
          </div>
          <div className="text-sm text-gray-400">
            Progress: <span className="text-white font-semibold">{progress}%</span>
          </div>
        </div>

        {!isLoaded || loading ? (
          <div className="glass-card rounded-2xl border border-violet-500/20 p-8 text-center text-gray-400">
            Loading lessons...
          </div>
        ) : !user?.id ? (
          <div className="glass-card rounded-2xl border border-violet-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Sign in required</h2>
            <p className="text-gray-400 mb-6">Please sign in to access your learning player.</p>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Go to Sign In
            </Link>
          </div>
        ) : error ? (
          <div className="glass-card rounded-2xl border border-red-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Unable to load learning data</h2>
            <p className="text-red-300">{error}</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 glass-card rounded-2xl border border-violet-500/20 p-4 h-fit lg:sticky lg:top-6">
            <h2 className="text-white font-semibold mb-3">Course Lessons</h2>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {lessonItems.map((lesson) => {
                const isDone = completed.has(lesson.id);
                const isActive = lesson.id === activeLessonId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`w-full text-left rounded-xl p-3 border transition-colors ${
                      isActive
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-violet-500/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-[11px] text-violet-300">{lesson.module}</div>
                    <div className="text-sm text-white">{lesson.title}</div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      {isDone ? "Completed" : "Not completed"}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="lg:col-span-3 glass-card rounded-2xl border border-violet-500/20 overflow-hidden">
            <div className="aspect-video bg-black/40 flex items-center justify-center text-7xl">
              {course.emoji}
            </div>
            <div className="p-6">
              <div className="text-xs text-violet-400 font-medium mb-2">{activeLesson?.module}</div>
              <h2 className="text-2xl font-bold text-white mb-3">{activeLesson?.title}</h2>
              <p className="text-gray-400 mb-5">
                This is your lesson player shell. Backend video/content streaming can be connected later.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={markCompleted}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold"
                >
                  Mark as Completed
                </button>
                <Link
                  href={`/courses/${course.slug}`}
                  className="border border-violet-500/30 text-violet-300 px-5 py-2.5 rounded-xl font-semibold"
                >
                  View Course Details
                </Link>
              </div>
            </div>
          </section>
        </div>
        )}
      </div>
    </main>
  );
}

