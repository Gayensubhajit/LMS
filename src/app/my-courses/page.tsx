"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getCourseBySlug } from "@/lib/courses-data";
import { backendRequest } from "@/lib/backend-client";

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

export default function MyCoursesPage() {
  const { user, isLoaded } = useUser();
  const [enrollments, setEnrollments] = useState<DashboardCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        }>("/dashboard/my-courses", {
          clerkUserId: user.id
        });
        setEnrollments(res.items);
      } catch (err) {
        setError((err as Error).message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [isLoaded, user?.id]);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="tag-purple inline-flex mb-4">My Learning</div>
            <h1 className="text-4xl font-black text-white mb-2">My Courses</h1>
            <p className="text-gray-400">Continue where you left off and track progress.</p>
          </div>
          <Link
            href="/courses"
            className="inline-flex border border-violet-500/30 text-violet-300 px-5 py-2.5 rounded-xl font-semibold"
          >
            Browse More Courses
          </Link>
        </div>

        {!isLoaded || loading ? (
          <div className="glass-card rounded-2xl border border-violet-500/20 p-8 text-center text-gray-400">
            Loading your courses...
          </div>
        ) : !user?.id ? (
          <div className="glass-card rounded-2xl border border-violet-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Sign in required</h2>
            <p className="text-gray-400 mb-6">Please sign in to view your enrolled courses.</p>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Go to Sign In
            </Link>
          </div>
        ) : error ? (
          <div className="glass-card rounded-2xl border border-red-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Unable to load courses</h2>
            <p className="text-red-300 mb-6">{error}</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="glass-card rounded-2xl border border-violet-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">No enrolled courses yet</h2>
            <p className="text-gray-400 mb-6">Purchase a course to see it in your dashboard.</p>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enrollment) => {
              const course = getCourseBySlug(enrollment.course.slug);
              if (!course) return null;

              return (
                <article
                  key={enrollment.enrollmentId}
                  className="glass-card rounded-2xl border border-violet-500/20 overflow-hidden"
                >
                  <div className="h-40 bg-gradient-to-br from-violet-900/40 to-purple-900/20 flex items-center justify-center text-6xl">
                    {course.emoji}
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-violet-400 font-medium mb-2">{course.category}</div>
                    <h2 className="text-xl font-bold text-white mb-1">{enrollment.course.title}</h2>
                    <p className="text-sm text-gray-400 mb-4">
                      Plan: {enrollment.plan.toLowerCase()} • Paid: ${enrollment.amountPaid}
                    </p>

                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{enrollment.progress.progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                          style={{ width: `${enrollment.progress.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/learn/${enrollment.course.slug}`}
                        className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                      >
                        Continue Learning
                      </Link>
                      <Link
                        href={`/courses/${enrollment.course.slug}`}
                        className="inline-flex items-center justify-center border border-violet-500/30 text-violet-300 px-4 py-2 rounded-xl text-sm font-semibold"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

