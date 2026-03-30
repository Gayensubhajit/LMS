"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Clock, Users, Play, ArrowRight, BookOpen } from "lucide-react";
import { Montserrat } from "next/font/google";
import { coursesData } from "@/lib/courses-data";
import Link from "next/link";

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
  Design: "from-violet-900/50 to-purple-900/30",
  Development: "from-blue-900/50 to-cyan-900/30",
  "AI/ML": "from-emerald-900/50 to-teal-900/30",
  Business: "from-indigo-900/50 to-purple-900/30",
  Marketing: "from-pink-900/50 to-rose-900/30",
};

const accentMap: Record<string, string> = {
  Design: "rgba(124,58,237,0.5)",
  Development: "rgba(59,130,246,0.5)",
  "AI/ML": "rgba(16,185,129,0.5)",
  Business: "rgba(99,102,241,0.5)",
  Marketing: "rgba(236,72,153,0.5)",
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
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
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

// Show all relevant courses from local data (now 12+)
const courses = coursesData;

export default function CoursesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const filtered =
    activeCategory === "All"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <section className="relative py-28 overflow-hidden" id="courses">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)",
        }}
      />

      <div
        className={`${montserrat.className} relative z-10 max-w-7xl mx-auto px-6`}
        ref={ref}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 tag-purple mb-4">
            Top Rated Courses
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-white mb-4">
            Level Up with Our
            <br />
            <span className={`${montserrat.className} gradient-text`}>
              Most Popular Courses
            </span>
          </h2>
          <p
            className={`${montserrat.className} text-gray-400 text-lg max-w-xl mx-auto`}
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
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                  : "glass-card text-gray-400 hover:text-white hover:border-violet-500/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Course cards */}
        <div
          className={`${montserrat.className} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}
        >
          {filtered.map((course, i) => {
            const accent = accentMap[course.category] ?? "rgba(124,58,237,0.5)";
            const gradient =
              gradientMap[course.category] ??
              "from-violet-900/50 to-purple-900/30";
            const badge = badgeMap[course.slug] ?? {
              label: "Featured",
              color: "bg-violet-500/20 text-violet-400 border-violet-500/30",
            };
            return (
              <motion.div
                key={course.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  transition: "all 0.3s ease",
                  transform:
                    hoveredCard === i ? "translateY(-8px)" : "translateY(0)",
                  boxShadow:
                    hoveredCard === i ? `0 20px 60px ${accent}` : "none",
                  borderColor:
                    hoveredCard === i ? accent : "rgba(124,58,237,0.2)",
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
                      className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <motion.div
                      animate={hoveredCard === i ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="text-6xl"
                    >
                      {course.emoji}
                    </motion.div>
                  )}
                  {course.img && (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl transform group-hover:scale-125 transition-transform duration-700 drop-shadow-2xl">
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
                    <span className="text-xs text-violet-400 font-medium">
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

                  <h3 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    by {course.instructor}
                  </p>

                  {/* Skills as tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.skills
                      .slice(0, 3)
                      .map((skill: string, j: number) => (
                        <span
                          key={j}
                          className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
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
                          className="flex-1 flex items-center justify-center gap-1.5 h-10 border border-violet-500/30 text-violet-300 text-[11px] font-bold rounded-xl hover:bg-violet-500/10 transition-all"
                        >
                          Details
                        </Link>
                        {course.isFree ? (
                           <Link
                              href={`/learn/${course.slug}`}
                              className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                            >
                              Enroll Free
                           </Link>
                        ) : (
                           <Link
                              href={`/checkout?slug=${course.slug}&plan=1month`}
                              className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[11px] font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
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
            className="inline-flex items-center gap-2 border border-violet-500/40 text-violet-300 px-8 py-3.5 rounded-2xl text-sm font-semibold hover:bg-violet-600/10 transition-colors"
          >
            Browse All 100+ Courses <ArrowRight size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
