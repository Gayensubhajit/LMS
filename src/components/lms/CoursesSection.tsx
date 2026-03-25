"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Clock, Users, Play, ArrowRight, BookOpen } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const categories = [
  "All",
  "Design",
  "Development",
  "Marketing",
  "AI/ML",
  "Business",
];

const courses = [
  {
    emoji: "🎨",
    category: "Design",
    title: "Complete UI/UX Design Bootcamp",
    instructor: "Jessica Willis",
    rating: 4.9,
    students: "12.4K",
    duration: "48h",
    lessons: 120,
    price: 89,
    badge: "Bestseller",
    badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    gradient: "from-violet-900/50 to-purple-900/30",
    accentColor: "rgba(124,58,237,0.5)",
    tags: ["Figma", "Prototyping", "User Research"],
    level: "Beginner",
  },
  {
    emoji: "⚛️",
    category: "Development",
    title: "React & Next.js Mastery 2026",
    instructor: "Alex Chen",
    rating: 4.8,
    students: "9.8K",
    duration: "62h",
    lessons: 155,
    price: 99,
    badge: "Hot",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    gradient: "from-blue-900/50 to-cyan-900/30",
    accentColor: "rgba(59,130,246,0.5)",
    tags: ["React", "Next.js", "TypeScript"],
    level: "Intermediate",
  },
  {
    emoji: "🤖",
    category: "AI/ML",
    title: "AI & Machine Learning for Designers",
    instructor: "Dr. Sarah Park",
    rating: 4.9,
    students: "7.2K",
    duration: "40h",
    lessons: 96,
    price: 119,
    badge: "New",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
    gradient: "from-emerald-900/50 to-teal-900/30",
    accentColor: "rgba(16,185,129,0.5)",
    tags: ["AI Tools", "Prompt Design", "Automation"],
    level: "All Levels",
  },
  {
    emoji: "📱",
    category: "Design",
    title: "Mobile App Design with Figma",
    instructor: "Marcus Lee",
    rating: 4.7,
    students: "6.1K",
    duration: "32h",
    lessons: 80,
    price: 79,
    badge: "Popular",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    gradient: "from-pink-900/50 to-rose-900/30",
    accentColor: "rgba(236,72,153,0.5)",
    tags: ["iOS", "Android", "Figma"],
    level: "Beginner",
  },
  {
    emoji: "🔥",
    category: "Development",
    title: "Full-Stack Development Accelerator",
    instructor: "Ryan Torres",
    rating: 4.8,
    students: "11.3K",
    duration: "80h",
    lessons: 200,
    price: 149,
    badge: "Bestseller",
    badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    gradient: "from-amber-900/50 to-orange-900/30",
    accentColor: "rgba(245,158,11,0.5)",
    tags: ["Node.js", "MongoDB", "AWS"],
    level: "Advanced",
  },
  {
    emoji: "📊",
    category: "Business",
    title: "Product Management Fundamentals",
    instructor: "Emily Watson",
    rating: 4.6,
    students: "4.8K",
    duration: "28h",
    lessons: 70,
    price: 69,
    badge: "Trending",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    gradient: "from-indigo-900/50 to-purple-900/30",
    accentColor: "rgba(99,102,241,0.5)",
    tags: ["Product", "Strategy", "Agile"],
    level: "Beginner",
  },
];

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

      <div className="relative z-10 max-w-7xl mx-auto px-6" ref={ref}>
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
          {filtered.map((course, i) => (
            <motion.div
              key={i}
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
                  hoveredCard === i
                    ? `0 20px 60px ${course.accentColor}`
                    : "none",
                borderColor:
                  hoveredCard === i
                    ? `${course.accentColor}`
                    : "rgba(124,58,237,0.2)",
              }}
            >
              {/* Thumbnail */}
              <div
                className={`relative h-44 bg-gradient-to-br ${course.gradient} flex items-center justify-center overflow-hidden`}
              >
                <motion.div
                  animate={hoveredCard === i ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-6xl"
                >
                  {course.emoji}
                </motion.div>

                {/* Play overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCard === i ? 1 : 0 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Play size={20} fill="white" className="translate-x-0.5" />
                  </div>
                </motion.div>

                {/* Badge */}
                <div
                  className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg border ${course.badgeColor}`}
                >
                  {course.badge}
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

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-md"
                    >
                      {tag}
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

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-white">
                      ${course.price}
                    </span>
                    <span className="text-xs text-gray-500 ml-1 line-through">
                      ${Math.round(course.price * 1.6)}
                    </span>
                  </div>
                  <motion.a
                    href="/courses"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    View Details <ArrowRight size={12} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
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
