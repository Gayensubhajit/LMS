"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronDown, Lock, MessageSquare, Play, PlayCircle, Star, UserRound, Loader2 } from "lucide-react";
import type { Course } from "@/lib/courses-data";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import EnrollmentModal from "./EnrollmentModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

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
    <main className="min-h-screen bg-background text-foreground px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <Link href="/courses" className="inline-flex mb-6 text-violet-300 hover:text-violet-200 text-sm">
          ← Back to courses
        </Link>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="lg:col-span-2 glass-card rounded-3xl border border-violet-500/20 overflow-hidden">
            <div className="h-52 bg-gradient-to-br from-violet-900/40 to-purple-900/20 flex items-center justify-center text-7xl">
              {course.emoji}
            </div>

            <div className="p-7">
              <div className="text-xs text-violet-400 font-medium mb-2">{course.category}</div>
              <h1 className="text-3xl font-black text-white mb-2">{course.title}</h1>
              <p className="text-gray-400 mb-6">by {course.instructor}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(["overview", "syllabus", "reviews"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${tab === t ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white" : "bg-white/5 border border-violet-500/20 text-gray-300"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Video Preview */}
              <div className="mb-7 rounded-2xl overflow-hidden border border-violet-500/20 bg-black/30">
                <div className="px-4 py-3 border-b border-violet-500/20 flex items-center justify-between">
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <PlayCircle size={16} className="text-violet-300" />
                    Course Preview
                  </div>
                  <span className="text-xs text-gray-500">Free preview lesson</span>
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
                  <p className="text-gray-300 leading-relaxed mb-6">{course.longDescription}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="rounded-xl bg-white/5 border border-violet-500/15 p-3">
                      <div className="text-xs text-gray-500">Rating</div>
                      <div className="text-white font-bold">{course.rating} / 5</div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-violet-500/15 p-3">
                      <div className="text-xs text-gray-500">Duration</div>
                      <div className="text-white font-bold">{course.duration}</div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-violet-500/15 p-3">
                      <div className="text-xs text-gray-500">Lessons</div>
                      <div className="text-white font-bold">{totalLessons}</div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-violet-500/15 p-3">
                      <div className="text-xs text-gray-500">Students</div>
                      <div className="text-white font-bold">{course.students}</div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white mb-3">What you will learn</h2>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill) => (
                        <span key={skill} className="text-sm bg-violet-600/15 border border-violet-500/20 text-violet-300 px-3 py-1.5 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-violet-500/20 bg-white/5 p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                        <UserRound size={18} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{course.instructor}</h3>
                        <p className="text-xs text-violet-300 mb-2">{instructor.role}</p>
                        <p className="text-sm text-gray-400 leading-relaxed mb-2">{instructor.bio}</p>
                        <p className="text-xs text-gray-500">Taught learners: {instructor.learners}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Syllabus Tab — Real sections from backend */}
              {tab === "syllabus" && (
                <div>
                  {!sectionsLoaded ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 rounded-2xl bg-white/5 border border-violet-500/10 animate-pulse" />
                      ))}
                    </div>
                  ) : sections.length > 0 ? (
                    <div className="space-y-3">
                      {sections.map((section, index) => (
                        <div key={section.id} className="rounded-2xl border border-violet-500/20 bg-white/5 p-4">
                          <button
                            onClick={() => setOpenSectionIndex(openSectionIndex === index ? null : index)}
                            className="w-full flex items-center justify-between text-left"
                          >
                            <div>
                              <h3 className="text-white font-semibold">{section.title}</h3>
                              <div className="text-xs text-gray-500 mt-1">
                                {section.lessons.length} lessons
                                {section.lessons.some(l => l.isPreview) && (
                                  <span className="ml-2 text-violet-400">• Some free previews</span>
                                )}
                              </div>
                            </div>
                            <ChevronDown
                              size={18}
                              className={`text-violet-300 transition-transform flex-shrink-0 ml-2 ${openSectionIndex === index ? "rotate-180" : ""}`}
                            />
                          </button>

                          {openSectionIndex === index && (
                            <ul className="mt-4 pt-3 border-t border-violet-500/15 space-y-2">
                              {section.lessons.map(lesson => (
                                <li key={lesson.id} className="flex items-center gap-3 text-sm py-1">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: lesson.isPreview ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)" }}>
                                    {lesson.isPreview
                                      ? <Play size={10} className="text-violet-400" fill="currentColor" />
                                      : <Lock size={10} className="text-gray-600" />
                                    }
                                  </div>
                                  <span className={lesson.isPreview ? "text-gray-200" : "text-gray-500"}>
                                    {lesson.title}
                                  </span>
                                  {lesson.durationMins && (
                                    <span className="ml-auto text-xs text-gray-600">{lesson.durationMins}m</span>
                                  )}
                                  {lesson.isPreview && (
                                    <span className="text-[10px] text-violet-400 border border-violet-500/30 px-1.5 py-0.5 rounded-md">Free</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Fallback to generated modules
                    <div className="space-y-3">
                      {fallbackModules.map((module, index) => (
                        <div key={module.title} className="rounded-2xl border border-violet-500/20 bg-white/5 p-4">
                          <button
                            onClick={() => setOpenSectionIndex(openSectionIndex === index ? null : index)}
                            className="w-full flex items-center justify-between text-left"
                          >
                            <div>
                              <h3 className="text-white font-semibold">{module.title}</h3>
                              <div className="text-xs text-gray-500 mt-1">{module.lessons.length} lessons</div>
                            </div>
                            <ChevronDown size={18} className={`text-violet-300 transition-transform ${openSectionIndex === index ? "rotate-180" : ""}`} />
                          </button>
                          {openSectionIndex === index && (
                            <ul className="mt-4 pt-3 border-t border-violet-500/15 space-y-2">
                              {module.lessons.map(lesson => (
                                <li key={lesson} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span className="text-violet-400 mt-0.5">•</span>
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
                <div className="space-y-3">
                  {reviews.map(review => (
                    <div key={review.name} className="rounded-2xl border border-violet-500/20 bg-white/5 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">{review.name}</span>
                        <span className="text-yellow-400 text-sm flex items-center gap-1">
                          <Star size={13} fill="currentColor" /> {review.rating}.0
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="glass-card rounded-3xl border border-violet-500/20 p-6 h-fit sticky top-8">
            <h2 className="text-xl font-black text-white mb-2">Enroll in this course</h2>
            <p className="text-sm text-gray-500 mb-6">Choose your subscription duration and get started today</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleEnrollClick}
                disabled={enrolling || checkingEnrollment}
                className="w-full bg-blue-600 text-white font-bold px-4 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 text-base"
              >
                {enrolling ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enrolling...
                  </>
                ) : checkingEnrollment ? (
                  "Checking enrollment..."
                ) : isEnrolled ? (
                  "Go to course"
                ) : (
                  course.isFree ? "Enroll for free" : "Enroll Now"
                )}
              </button>
              {isEnrolled && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Already enrolled
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-violet-500/15 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen size={14} />
                <span>{totalLessons} structured lessons</span>
              </div>
              {sections.length > 0 && (
                <div className="flex items-center gap-2">
                  <Play size={14} />
                  <span>{sections.length} sections · {sections.filter(s => s.lessons.some(l => l.isPreview)).length} free previews</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MessageSquare size={14} />
                <span>Community Q&A and mentor support</span>
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
