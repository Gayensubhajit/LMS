"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses-data";
import { getEnrollments, updateEnrollmentProgress } from "@/lib/mock-enrollments";

export default function LearnCoursePage() {
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

  const lessonItems = useMemo(
    () =>
      course.skills.flatMap((skill, moduleIndex) => [
        { id: `${moduleIndex}-1`, module: `Module ${moduleIndex + 1}`, title: `Intro to ${skill}` },
        { id: `${moduleIndex}-2`, module: `Module ${moduleIndex + 1}`, title: `${skill} fundamentals` },
        { id: `${moduleIndex}-3`, module: `Module ${moduleIndex + 1}`, title: `Project with ${skill}` },
      ]),
    [course.skills]
  );

  const enrollment = getEnrollments().find((e) => e.slug === course.slug);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeLessonId, setActiveLessonId] = useState<string>(lessonItems[0]?.id ?? "");

  const progress = lessonItems.length
    ? Math.round((completed.size / lessonItems.length) * 100)
    : enrollment?.progress ?? 0;

  const activeLesson = lessonItems.find((lesson) => lesson.id === activeLessonId) ?? lessonItems[0];

  const markCompleted = () => {
    if (!activeLesson) return;
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(activeLesson.id);
      const nextProgress = lessonItems.length
        ? Math.round((next.size / lessonItems.length) * 100)
        : 0;
      updateEnrollmentProgress(course.slug, nextProgress);
      return next;
    });
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
      </div>
    </main>
  );
}

