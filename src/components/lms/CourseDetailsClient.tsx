"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronDown, Lock, MessageSquare, Play, PlayCircle, Star, UserRound, Loader2 } from "lucide-react";
import type { Course } from "@/lib/courses-data";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import EnrollmentModal from "./EnrollmentModal";
import { formatLocalPrice } from "@/lib/utils/currency";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

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

type BackendCourseWithLessons = {
  id: string;
  slug: string;
  title: string;
  sections: BackendSection[];
};

const instructorProfiles: Record<string, { role: string; bio: string; learners: string }> = {
  "Jessica Willis": {
    role: "Lead UX Designer",
    bio: "Design mentor with 10+ years of product experience helping learners build portfolio-ready case studies.",
    learners: "12K+",
  },
  "Alex Chen": {
    role: "Senior Full-Stack Engineer",
    bio: "Specializes in React, Next.js, and production architecture used by fast-growing startups.",
    learners: "18K+",
  },
  "Dr. Sarah Park": {
    role: "AI Research Lead",
    bio: "Works at the intersection of practical AI systems and product strategy for real-world teams.",
    learners: "9K+",
  },
};

export default function CourseDetailsClient({ course }: { course: Course }) {
  const { getToken, userId } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "syllabus" | "reviews">("overview");
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(0);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  const handleEnrollClick = async () => {
    if (isEnrolled) {
      router.push(`/learn/${course.slug}`);
      return;
    }

    if (course.isFree) {
      if (!userId) {
        router.push(`/auth/sign-in?redirect_url=/courses/${course.slug}`);
        return;
      }

      try {
        setEnrolling(true);
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/enrollments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-clerk-user-id": userId
          },
          body: JSON.stringify({ courseSlug: course.slug })
        });

        const data = await res.json();
        if (data.ok) {
          // Success! Redirect to the learn page or show success
          // For now, let's just refresh or redirect to learn
          router.push(`/learn/${course.slug}`);
        } else {
          alert(data.error || "Enrollment failed");
        }
      } catch (err) {
        console.error("Enrollment error:", err);
        alert("Something went wrong during enrollment.");
      } finally {
        setEnrolling(false);
      }
    } else {
      setIsEnrollModalOpen(true);
    }
  };

  // Real sections from backend
  const [sections, setSections] = useState<BackendSection[]>([]);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/courses/${course.slug}/lessons`)
      .then(r => r.json())
      .then((data: { ok: boolean; item: BackendCourseWithLessons }) => {
        if (data.ok && data.item?.sections?.length) {
          setSections(data.item.sections);
        }
      })
      .catch(() => {/* keep empty */})
      .finally(() => setSectionsLoaded(true));
  }, [course.slug]);

  // Check enrollment status
  useEffect(() => {
    if (!userId) {
      setCheckingEnrollment(false);
      return;
    }

    const checkEnrollment = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/enrollments/check/${course.slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            // Backend auth expects this header to identify the Clerk user
            "x-clerk-user-id": userId
          }
        });
        const data = await res.json();
        if (data.ok) {
          setIsEnrolled(data.enrolled);
        }
      } catch (err) {
        console.error("Check enrollment error:", err);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    checkEnrollment();
  }, [course.slug, userId, getToken]);

  // Fallback modules from skills when backend has no sections yet
  const fallbackModules = useMemo(() => {
    return course.skills.map((skill, index) => ({
      title: `Module ${index + 1}: ${skill}`,
      lessons: [
        `Introduction to ${skill}`,
        `${skill} core concepts and framework`,
        `Guided project: applying ${skill.toLowerCase()}`,
        `${skill} best practices and review`,
      ],
    }));
  }, [course.skills]);

  const reviews = useMemo(
    () => [
      { name: "Rahul D.", rating: 5, text: `Excellent structure. I finally understood ${course.skills[0]} with practical examples.` },
      { name: "Ananya S.", rating: 5, text: "One of the cleanest course experiences I have used. Great pace and clear explanations." },
      { name: "Michael K.", rating: 4, text: "Strong content depth and modern tooling. Worth it for career-focused learning." },
    ],
    [course.skills]
  );

  const instructor = instructorProfiles[course.instructor] ?? {
    role: "Industry Instructor",
    bio: "Experienced mentor delivering practical, project-based learning.",
    learners: course.students,
  };

  const totalLessons = sections.length > 0
    ? sections.reduce((sum, s) => sum + s.lessons.length, 0)
    : course.lessons;

  return (
    <main className="min-h-screen bg-[#f6f8ff] dark:bg-background text-foreground pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/courses" className="inline-flex mb-6 text-slate-500 hover:text-[#0056d2] dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors">
          ← Back to courses
        </Link>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2">
            <div className="h-72 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/20 flex items-center justify-center text-9xl rounded-3xl mb-8 border border-blue-200 dark:border-blue-500/20">
              {course.emoji}
            </div>

            <div className="mb-8">
              <div className="text-sm text-[#0056d2] dark:text-blue-400 font-medium mb-2">{course.category}</div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">{course.title}</h1>
              <p className="text-xl text-slate-500 dark:text-gray-400">by {course.instructor}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {(["overview", "syllabus", "reviews"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium capitalize transition-all ${tab === t ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20" : "bg-white dark:bg-white/5 border border-slate-200 dark:border-blue-500/20 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Video Preview */}
            <div className="mb-10 rounded-3xl overflow-hidden border border-slate-200 dark:border-blue-500/20 bg-white dark:bg-black/30 shadow-xl dark:shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-blue-500/20 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <PlayCircle size={18} className="text-[#0056d2] dark:text-blue-400" />
                  Course Preview
                </div>
                <span className="text-xs text-slate-400 dark:text-gray-500 uppercase tracking-wider">Free preview lesson</span>
              </div>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={course.previewVideoUrl}
                  title={`${course.title} preview`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Overview Tab */}
            {tab === "overview" && (
              <div>
                <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed mb-10">{course.longDescription}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                  <div className="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-blue-500/15 p-4 shadow-sm">
                    <div className="text-xs text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1">Rating</div>
                    <div className="text-slate-900 dark:text-white font-bold text-lg">{course.rating} / 5</div>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-blue-500/15 p-4 shadow-sm">
                    <div className="text-xs text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1">Duration</div>
                    <div className="text-slate-900 dark:text-white font-bold text-lg">{course.duration}</div>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-blue-500/15 p-4 shadow-sm">
                    <div className="text-xs text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1">Lessons</div>
                    <div className="text-slate-900 dark:text-white font-bold text-lg">{totalLessons}</div>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-blue-500/15 p-4 shadow-sm">
                    <div className="text-xs text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1">Students</div>
                    <div className="text-slate-900 dark:text-white font-bold text-lg">{course.students}</div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What you will learn</h2>
                  <div className="flex flex-wrap gap-3">
                    {course.skills.map((skill) => (
                      <span key={skill} className="text-sm bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 text-[#0056d2] dark:text-blue-400 px-4 py-2 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-12 rounded-3xl border border-slate-200 dark:border-blue-500/20 bg-white dark:bg-white/5 p-8 shadow-sm">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-[#0056d2] dark:text-blue-400 flex-shrink-0">
                      <UserRound size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{course.instructor}</h3>
                      <p className="text-sm text-[#0056d2] dark:text-blue-400 mb-4">{instructor.role}</p>
                      <p className="text-slate-500 dark:text-gray-400 leading-relaxed mb-4">{instructor.bio}</p>
                      <p className="text-sm text-slate-400 dark:text-gray-500">Taught learners: {instructor.learners}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Syllabus Tab */}
            {tab === "syllabus" && (
              <div>
                {!sectionsLoaded ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 rounded-2xl bg-white/5 border border-blue-500/10 animate-pulse" />
                    ))}
                  </div>
                ) : sections.length > 0 ? (
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div key={section.id} className="rounded-2xl border border-slate-200 dark:border-blue-500/20 bg-white dark:bg-white/5 p-6 shadow-sm">
                        <button
                          onClick={() => setOpenSectionIndex(openSectionIndex === index ? null : index)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{section.title}</h3>
                            <div className="text-sm text-slate-400 dark:text-gray-500 mt-1">
                              {section.lessons.length} lessons
                            </div>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-[#0056d2] dark:text-blue-400 transition-transform ${openSectionIndex === index ? "rotate-180" : ""}`}
                          />
                        </button>

                        {openSectionIndex === index && (
                          <ul className="mt-6 pt-6 border-t border-slate-100 dark:border-blue-500/15 space-y-4">
                            {section.lessons.map(lesson => (
                              <li key={lesson.id} className="flex items-center gap-4 text-sm">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ background: lesson.isPreview ? "rgba(59,130,246,0.15)" : "rgba(0,0,0,0.04)" }}>
                                  {lesson.isPreview
                                    ? <Play size={12} className="text-[#0056d2] dark:text-blue-500" fill="currentColor" />
                                    : <Lock size={12} className="text-slate-300 dark:text-gray-600" />
                                  }
                                </div>
                                <span className={lesson.isPreview ? "text-slate-700 dark:text-gray-200" : "text-slate-400 dark:text-gray-500"}>
                                  {lesson.title}
                                </span>
                                {lesson.durationMins && (
                                  <span className="ml-auto text-xs text-slate-400 dark:text-gray-600">{lesson.durationMins}m</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fallbackModules.map((module, index) => (
                      <div key={module.title} className="rounded-2xl border border-slate-200 dark:border-violet-500/20 bg-white dark:bg-white/5 p-6 shadow-sm">
                        <button
                          onClick={() => setOpenSectionIndex(openSectionIndex === index ? null : index)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{module.title}</h3>
                            <div className="text-sm text-slate-400 dark:text-gray-500 mt-1">{module.lessons.length} lessons</div>
                          </div>
                          <ChevronDown size={20} className={`text-violet-500 dark:text-violet-300 transition-transform ${openSectionIndex === index ? "rotate-180" : ""}`} />
                        </button>
                        {openSectionIndex === index && (
                          <ul className="mt-6 pt-6 border-t border-slate-100 dark:border-violet-500/15 space-y-4">
                            {module.lessons.map(lesson => (
                              <li key={lesson} className="text-sm text-slate-600 dark:text-gray-300 flex items-start gap-3">
                                <span className="text-[#0056d2] dark:text-blue-500 mt-0.5">•</span>
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {tab === "reviews" && (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.name} className="rounded-2xl border border-slate-200 dark:border-blue-500/20 bg-white dark:bg-white/5 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-900 dark:text-white font-semibold">{review.name}</span>
                      <span className="text-amber-500 dark:text-yellow-400 text-sm flex items-center gap-1">
                        <Star size={14} fill="currentColor" /> {review.rating}.0
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar / CTA card */}
          <aside className="lg:col-span-1 space-y-6">
            <div 
              className="sticky top-28 lumen-course-sidebar rounded-3xl border border-slate-200 dark:border-blue-500/20 overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-blue-500/10"
              style={{ background: "rgba(15,15,30,0.9)" }}
            >
              <div className="p-8">
                {/* Price Display */}
                {!isEnrolled && (
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-4xl font-black text-slate-900 dark:text-white">{course.isFree ? "Free" : formatLocalPrice(course.price.oneMonth)}</span>
                      {!course.isFree && <span className="text-slate-400 dark:text-gray-500 ml-2">/ month</span>}
                    </div>
                    {course.isFree && (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30 uppercase tracking-widest">
                        FREE
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleEnrollClick}
                    disabled={enrolling || checkingEnrollment}
                    className="w-full bg-blue-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                  >
                    {enrolling ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Enrolling...
                      </>
                    ) : checkingEnrollment ? (
                      "Checking..."
                    ) : isEnrolled ? (
                      "Go to course"
                    ) : (
                      course.isFree ? "Enroll for free" : "Enroll Now"
                    )}
                  </button>
                  {isEnrolled && (
                    <div className="flex items-center justify-center gap-2 text-sm text-emerald-400 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Already enrolled
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-blue-500/15 text-sm text-slate-500 dark:text-gray-400 space-y-4">
                  <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-[#0056d2] dark:text-blue-500" />
                    <span>{totalLessons} structured lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Play size={18} className="text-[#0056d2] dark:text-blue-500" />
                    <span>{sections.length} sections · {sections.filter(s => s.lessons.some(l => l.isPreview)).length} free previews</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-[#0056d2] dark:text-blue-500" />
                    <span>Community Q&A and mentor support</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <EnrollmentModal
        course={course}
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
      />
    </main>
  );
}
