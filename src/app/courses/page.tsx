"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, ArrowRight } from "lucide-react";
import { coursesData } from "@/lib/courses-data";

const categories = ["All", "Design", "Development", "AI/ML", "Business", "Marketing"] as const;

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "priceLow" | "priceHigh">("popular");

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = coursesData.filter((course) => {
      const matchesCategory = category === "All" ? true : course.category === category;
      const haystack = `${course.title} ${course.instructor} ${course.category} ${course.skills.join(" ")}`.toLowerCase();
      const matchesQuery = q.length === 0 ? true : haystack.includes(q);
      return matchesCategory && matchesQuery;
    });

    const sorted = [...base];
    if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "priceLow") {
      sorted.sort((a, b) => a.price.oneMonth - b.price.oneMonth);
    } else if (sortBy === "priceHigh") {
      sorted.sort((a, b) => b.price.oneMonth - a.price.oneMonth);
    } else {
      // popular
      sorted.sort((a, b) => Number(b.students.replace("K", "")) - Number(a.students.replace("K", "")));
    }
    return sorted;
  }, [category, query, sortBy]);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <div className="tag-purple inline-flex mb-4">All Courses</div>
            <h1 className="text-4xl font-black text-white mb-2">Browse All Available Courses</h1>
            <p className="text-gray-400">Search, filter, and pick the right course for your goal.</p>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex border border-violet-500/30 text-violet-300 px-5 py-2.5 rounded-xl font-semibold"
          >
            Back to Home
          </Link>
        </div>

        {/* Search + controls */}
        <section className="glass-card rounded-2xl border border-violet-500/20 p-4 md:p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search course, instructor, or skill..."
                className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/60"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <SlidersHorizontal size={14} />
              <span>{filteredCourses.length} courses found</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white/5 border border-violet-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="priceLow">Sort: Price Low to High</option>
              <option value="priceHigh">Sort: Price High to Low</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                  cat === category
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                    : "bg-white/5 border border-violet-500/20 text-gray-300 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Highlight strip */}
        <section className="mb-8 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-900/25 via-purple-900/15 to-transparent p-4 flex items-center gap-3">
          <Sparkles className="text-violet-300" size={18} />
          <p className="text-sm text-gray-300">
            New this month: 6 fresh courses added across AI/ML, Marketing, and Advanced Development.
          </p>
        </section>

        {/* Course cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.article
              key={course.slug}
              className="glass-card rounded-2xl border border-violet-500/20 overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.2) }}
              whileHover={{
                y: -8,
                rotateX: -4,
                rotateY: 4,
                scale: 1.01,
                boxShadow: "0 24px 56px rgba(124,58,237,0.26)",
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="h-36 bg-gradient-to-br from-violet-900/40 to-purple-900/20 flex items-center justify-center text-5xl">
                {course.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-violet-400 font-medium">{course.category}</span>
                  <span className="text-xs text-yellow-400 font-semibold">{course.rating} / 5</span>
                </div>

                <h2 className="text-lg font-bold text-white leading-snug mb-2">{course.title}</h2>
                <p className="text-sm text-gray-400 mb-3">by {course.instructor}</p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.shortDescription}</p>

                <div className="text-xs text-gray-500 mb-5">
                  {course.duration} • {course.lessons} lessons • {course.students} students
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black text-white">${course.price.oneMonth}</div>
                    <div className="text-[11px] text-gray-500">1 month plan</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="border border-violet-500/30 text-violet-300 text-sm font-semibold px-3 py-2 rounded-xl"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/checkout?slug=${encodeURIComponent(course.slug)}&plan=1month`}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-3 py-2 rounded-xl"
                    >
                      Enroll
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}

