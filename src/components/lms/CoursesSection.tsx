"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Clock, Users, Play, ArrowRight, BookOpen } from "lucide-react";
import { Montserrat } from "next/font/google";
import { useAuth } from "@clerk/nextjs";
import { coursesData, type Course } from "@/lib/courses-data";
import { mergeCourse, unionCourses } from "@/lib/course-utils";
import Link from "next/link";
import { formatLocalPrice } from "@/lib/utils/currency";

const montserrat = Montserrat({ subsets: ["latin"] });

const categories = [
  "All",
  "Design",
  "Development",
  "Marketing",
  "AI/ML",
  "Business",
];

const gradientMap: Record<string, string> = {
  Design: "from-blue-900/50 to-indigo-900/30",
  Development: "from-blue-900/50 to-cyan-900/30",
  "AI/ML": "from-emerald-900/50 to-teal-900/30",
  Business: "from-indigo-900/50 to-blue-900/30",
  Marketing: "from-blue-900/50 to-indigo-900/30",
};

const accentMap: Record<string, string> = {
  Design: "rgba(59,130,246,0.5)",
  Development: "rgba(59,130,246,0.5)",
  "AI/ML": "rgba(16,185,129,0.5)",
  Business: "rgba(79,70,229,0.5)",
  Marketing: "rgba(59,130,246,0.5)",
};

const badgeMap: Record<string, { label: string; color: string }> = {
  "complete-ui-ux-design-bootcamp": {
    label: "Bestseller",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  "react-nextjs-mastery-2026": {
    label: "Hot",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  "ai-machine-learning-for-designers": {
    label: "New",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  "mobile-app-design-with-figma": {
    label: "Popular",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  "full-stack-development-accelerator": {
    label: "Bestseller",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  "product-management-fundamentals": {
    label: "Trending",
    color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
};

// Show all relevant courses from live database
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

export default function CoursesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [enrolledSlugs, setEnrolledSlugs] = useState<Set<string>>(new Set());
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [isPlusMember, setIsPlusMember] = useState(false);
  const { getToken, userId } = useAuth();

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/courses`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && data.items?.length) {
        const merged = data.items.map(mergeCourse);
        if (merged.length > 0) setCourses(unionCourses(coursesData, merged));
      }
    } catch (err) {}
  }, []);

  const fetchEnrollments = useCallback(async () => {
    if (!userId) {
      setEnrolledSlugs(new Set());
      return;
    }
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/enrollments/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-clerk-user-id": userId,
        },
      });
      const data = await res.json();
      if (data.ok && data.items) {
        const activeSlugs = data.items
          .filter((e: any) => e.status === "ACTIVE")
          .map((e: any) => e.course.slug);
        setEnrolledSlugs(new Set(activeSlugs));

        // Check if Plus Membership is in the list (including trials)
        const hasPlus = data.items.some((e: any) => 
          e.course.slug === "plus-membership" && 
          (e.status === "ACTIVE" || e.status === "TRIALING")
        );
        if (hasPlus) setIsPlusMember(true);
      }
    } catch (err) {}
  }, [userId, getToken]);

  useEffect(() => {
    void fetchCourses();
    void fetchEnrollments();
  }, [fetchCourses, fetchEnrollments]);

  const filtered = (
    activeCategory === "All"
      ? courses
      : courses.filter((c) => c.category === activeCategory)
  )
    .filter((c) => !c.isHidden)
    .slice(0, 4);

  return (
    <section
      className="relative py-28 overflow-hidden bg-white dark:bg-[#030712]"
      id="courses"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)",
        }}
      />

      <div
        className={`${montserrat.className} relative z-10 max-w-5xl mx-auto px-6`}
        ref={ref}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className={`${montserrat.className} inline-flex items-center gap-2 px-2 py-1 border border-gray-900/50 dark:border-violet-500/50 rounded-lg text-xs font-black tracking-[0.25em] text-black dark:text-violet-400 uppercase mb-4`}
          >
            Top Rated Courses
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-black dark:text-white mb-4">
            Level Up with Our
            <br />
            <span
              className={`${montserrat.className} text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-zinc-800 to-indigo-600 dark:from-blue-400 dark:via-white dark:to-indigo-400 dark:gradient-text`}
            >
              Most Popular Courses
            </span>
          </h2>
          <p
            className={`${montserrat.className} text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto`}
          >
            Hand-picked courses taught by industry experts. Updated regularly to
            stay ahead of the curve.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 justify-center flex-wrap mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${montserrat.className} px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-black dark:bg-linear-to-r dark:from-blue-600 dark:to-indigo-600 text-white shadow-md dark:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  : "bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-blue-500/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Course cards */}
        <div
          className={`${montserrat.className} grid grid-cols-1 md:grid-cols-2 gap-8`}
        >
          {filtered.map((course, i) => {
            const accent = accentMap[course.category] ?? "rgba(59,130,246,0.5)";
            const gradient =
              gradientMap[course.category] ??
              "from-blue-900/50 to-indigo-900/30";
            const badge = badgeMap[course.slug] ?? {
              label: "Featured",
              color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            };
            return (
              <motion.div
                key={course.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-[#111827] border border-black/[0.06] dark:border-white/[0.06] shadow-lg dark:shadow-black/40"
                style={{
                  transition: "all 0.3s ease",
                  transform:
                    hoveredCard === i ? "translateY(-8px)" : "translateY(0)",
                  boxShadow:
                    hoveredCard === i ? `0 20px 60px ${accent}` : "none",
                  borderColor:
                    hoveredCard === i ? accent : "rgba(59,130,246,0.2)",
                }}
              >
                {/* Thumbnail */}
                <div
                  className={`relative h-44 bg-linear-to-br ${gradient} flex items-center justify-center overflow-hidden`}
                >
                  {course.img ? (
                    <img
                      src={course.img}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <motion.div
                      animate={
                        hoveredCard === i ? { scale: 1.1 } : { scale: 1 }
                      }
                      transition={{ duration: 0.4 }}
                      className="text-6xl"
                    >
                      {course.emoji}
                    </motion.div>
                  )}
                  {course.img && (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl transform group-hover:scale-125 transition-all duration-700 drop-shadow-2xl opacity-0 group-hover:opacity-100">
                      {course.emoji}
                    </div>
                  )}

                  {/* Badge */}
                  <div
                    className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg border ${badge.color}`}
                  >
                    {badge.label}
                  </div>

                  {/* Level */}
                  <div className="absolute top-3 right-3 text-xs bg-black/50 text-gray-300 px-2.5 py-1 rounded-lg">
                    {course.level}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-blue-500 font-medium">
                      {course.category}
                    </span>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-1">
                      <Star
                        size={11}
                        fill="#facc15"
                        className="text-yellow-400"
                      />
                      <span className="text-xs text-yellow-400 font-bold">
                        {course.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({course.students})
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-black dark:text-white mb-2 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    by {course.instructor}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills
                        .slice(0, 3)
                        .map((skill: string, j: number) => (
                          <span
                            key={j}
                            className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                    <div className="text-sm font-bold text-black dark:text-blue-400">
                      {course.isFree
                        ? "Free"
                        : `${formatLocalPrice(course.price.oneMonth)}/mo`}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} />
                      {course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {course.students}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 h-10 border border-black/10 dark:border-blue-500/30 text-black dark:text-blue-600 text-[11px] font-bold rounded-xl hover:bg-black/5 dark:hover:bg-blue-500/10 transition-all font-sans"
                    >
                      Details
                    </Link>
                    {enrolledSlugs.has(course.slug) ? (
                      <Link
                        href={`/learn/${course.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-black dark:bg-violet-600 hover:bg-zinc-800 dark:hover:bg-violet-500 text-white text-[11px] font-bold rounded-xl transition-all shadow-md dark:shadow-violet-500/20 font-sans"
                      >
                        Go to Course
                      </Link>
                    ) : isPlusMember ? (
                      <Link
                        href={`/learn/${course.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl transition-all shadow-md dark:shadow-emerald-500/20 font-sans"
                      >
                        Start Learning
                      </Link>
                    ) : course.isFree ? (
                      <Link
                        href={`/learn/${course.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-black dark:bg-emerald-600 hover:bg-zinc-800 dark:hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl transition-all shadow-md dark:shadow-emerald-500/20 font-sans"
                      >
                        Enroll Free
                      </Link>
                    ) : (
                      <Link
                        href={`/checkout?slug=${course.slug}&plan=1month`}
                        className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-black dark:bg-linear-to-r dark:from-blue-600 dark:to-indigo-600 text-white text-[11px] font-bold rounded-xl hover:opacity-90 transition-all shadow-md dark:shadow-blue-500/20 font-sans"
                      >
                        Enroll <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/courses"
            whileHover={{ scale: 1.04 }}
            className="inline-flex items-center gap-2 border border-black/10 dark:border-blue-500/40 text-black dark:text-blue-600 px-8 py-3.5 rounded-2xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-blue-600/10 transition-colors"
          >
            Browse All 100+ Courses <ArrowRight size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
