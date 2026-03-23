"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, MessageSquare, PlayCircle, Star, UserRound } from "lucide-react";
import type { Course } from "@/lib/courses-data";
import EnrollmentModal from "./EnrollmentModal";

const planConfig = [
  { key: "oneMonth", label: "1 Month", valueKey: "oneMonth" as const, desc: "Best for quick upskilling" },
  { key: "threeMonth", label: "3 Months", valueKey: "threeMonth" as const, desc: "Most popular for career switchers" },
  { key: "sixMonth", label: "6 Months", valueKey: "sixMonth" as const, desc: "Best value for deep mastery" },
];

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
  const [tab, setTab] = useState<"overview" | "syllabus" | "reviews">("overview");
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const modules = useMemo(() => {
    // Build a simple curriculum from course skills.
    return course.skills.map((skill, index) => ({
      title: `Module ${index + 1}: ${skill}`,
      lessons: Math.max(4, Math.round(course.lessons / Math.max(course.skills.length, 1))),
      duration: `${Math.max(2, Math.round(Number(course.duration.replace("h", "")) / Math.max(course.skills.length, 1)))}h`,
      summary: `Hands-on exercises and practical workflows focused on ${skill.toLowerCase()}.`,
      lessonList: [
        `Introduction to ${skill}`,
        `${skill} core concepts and framework`,
        `Guided project: applying ${skill.toLowerCase()}`,
        `${skill} best practices and review`,
      ],
    }));
  }, [course]);

  const reviews = useMemo(
    () => [
      {
        name: "Rahul D.",
        rating: 5,
        text: `Excellent structure. I finally understood ${course.skills[0]} with practical examples.`,
      },
      {
        name: "Ananya S.",
        rating: 5,
        text: "One of the cleanest course experiences I have used. Great pace and clear explanations.",
      },
      {
        name: "Michael K.",
        rating: 4,
        text: "Strong content depth and modern tooling. Worth it for career-focused learning.",
      },
    ],
    [course.skills]
  );

  const instructor = instructorProfiles[course.instructor] ?? {
    role: "Industry Instructor",
    bio: "Experienced mentor delivering practical, project-based learning.",
    learners: course.students,
  };

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
                <button
                  onClick={() => setTab("overview")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === "overview" ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white" : "bg-white/5 border border-violet-500/20 text-gray-300"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setTab("syllabus")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === "syllabus" ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white" : "bg-white/5 border border-violet-500/20 text-gray-300"}`}
                >
                  Syllabus
                </button>
                <button
                  onClick={() => setTab("reviews")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === "reviews" ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white" : "bg-white/5 border border-violet-500/20 text-gray-300"}`}
                >
                  Reviews
                </button>
              </div>

              {/* Real video preview */}
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
                      <div className="text-white font-bold">{course.lessons}</div>
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
                        <span
                          key={skill}
                          className="text-sm bg-violet-600/15 border border-violet-500/20 text-violet-300 px-3 py-1.5 rounded-lg"
                        >
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

              {tab === "syllabus" && (
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div
                      key={module.title}
                      className="rounded-2xl border border-violet-500/20 bg-white/5 p-4"
                    >
                      <button
                        onClick={() =>
                          setOpenModuleIndex(openModuleIndex === index ? null : index)
                        }
                        className="w-full flex items-center justify-between text-left"
                      >
                        <div>
                          <h3 className="text-white font-semibold">{module.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{module.summary}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {module.lessons} lessons • {module.duration} • Week {index + 1}
                          </div>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-violet-300 transition-transform ${
                            openModuleIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openModuleIndex === index ? (
                        <ul className="mt-4 pt-3 border-t border-violet-500/15 space-y-2">
                          {module.lessonList.map((lesson) => (
                            <li
                              key={lesson}
                              className="text-sm text-gray-300 flex items-start gap-2"
                            >
                              <span className="text-violet-400 mt-0.5">•</span>
                              <span>{lesson}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              {tab === "reviews" && (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review.name}
                      className="rounded-2xl border border-violet-500/20 bg-white/5 p-4"
                    >
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

          <aside className="glass-card rounded-3xl border border-violet-500/20 p-6 h-fit sticky top-8">
            <h2 className="text-xl font-black text-white mb-2">Enroll in this course</h2>
            <p className="text-sm text-gray-500 mb-6">Choose your subscription duration and get started today</p>

            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-4 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Enroll Now
            </button>

            <div className="mt-5 pt-4 border-t border-violet-500/15 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen size={14} />
                <span>{course.lessons} structured lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={14} />
                <span>Community Q&A and mentor support</span>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {/* Enrollment Modal */}
      <EnrollmentModal
        course={course}
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
      />
    </main>
  );
}

