"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, BookOpen, TrendingUp } from "lucide-react";
import { coursesData } from "@/lib/courses-data";

const categories = ["All", "Design", "Development", "AI/ML", "Business", "Marketing"] as const;
type Category = (typeof categories)[number];

const categoryColors: Record<string, { text: string; bg: string }> = {
  Development: { text: "#60a5fa", bg: "rgba(59,130,246,0.12)" },
  Design:      { text: "#f472b6", bg: "rgba(236,72,153,0.12)" },
  "AI/ML":     { text: "#a78bfa", bg: "rgba(139,92,246,0.12)" },
  Business:    { text: "#fbbf24", bg: "rgba(245,158,11,0.12)" },
  Marketing:   { text: "#34d399", bg: "rgba(16,185,129,0.12)" },
};

function getRelatedChips(q: string): string[] {
  const l = q.toLowerCase();
  if (l.includes("python") || l.includes("data"))
    return ["data analysis", "pandas", "machine learning", "statistics", "visualization"];
  if (l.includes("react") || l.includes("next"))
    return ["typescript", "next.js", "full-stack", "api design", "server components"];
  if (l.includes("ui") || l.includes("ux") || l.includes("design") || l.includes("figma"))
    return ["wireframing", "prototyping", "design systems", "user research", "interaction"];
  if (l.includes("ai") || l.includes("ml") || l.includes("machine"))
    return ["deep learning", "llm", "prompt engineering", "automation", "nlp"];
  if (l.includes("full") || l.includes("stack"))
    return ["node.js", "databases", "cloud deploy", "rest api", "system design"];
  if (l.includes("market") || l.includes("growth"))
    return ["seo", "a/b testing", "funnel design", "analytics", "ads"];
  return [];
}

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQ);
  const [category, setCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "priceLow" | "priceHigh">("popular");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setCategory("All");
  }, [searchParams]);

  const isSearchMode = query.trim().length > 0;
  const chips = isSearchMode ? getRelatedChips(query) : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = coursesData.filter((c) => {
      const matchesCat = category === "All" || c.category === category;
      const hay = `${c.title} ${c.instructor} ${c.category} ${c.skills.join(" ")} ${c.shortDescription}`.toLowerCase();
      return matchesCat && (q === "" || hay.includes(q));
    });
    const s = [...base];
    if (sortBy === "rating") s.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "priceLow") s.sort((a, b) => a.price.oneMonth - b.price.oneMonth);
    else if (sortBy === "priceHigh") s.sort((a, b) => b.price.oneMonth - a.price.oneMonth);
    else s.sort((a, b) => parseFloat(b.students) - parseFloat(a.students));
    return s;
  }, [query, category, sortBy]);

  const chipClick = (chip: string) => router.push(`/courses?q=${encodeURIComponent(chip)}`);
  const clearSearch  = () => router.push("/courses");

  return (
    <main className="min-h-screen bg-background text-foreground pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ────────────────────────────────────────────────
            SEARCH MODE — Coursera-style results header
        ──────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {isSearchMode ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── Heading ── */}
              <div className="mb-6">
                <h1 className="text-4xl font-black text-white leading-tight mb-1">
                  Results for{" "}
                  <span
                    className="italic"
                    style={{
                      background: "linear-gradient(135deg,#c084fc,#7c3aed)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    &ldquo;{query}&rdquo;
                  </span>
                </h1>
                <p className="text-gray-500 text-sm">
                  {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
                  {category !== "All" ? ` · filtered by ${category}` : ""}
                </p>
              </div>

              {/* ── Inline search bar (scoped to this page) ── */}
              <div
                className="flex items-center rounded-xl mb-5 overflow-hidden"
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(168,85,247,0.4)",
                }}
              >
                <Search size={15} className="ml-4 text-violet-400 flex-shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
                    }
                  }}
                  placeholder="Refine your search…"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 px-3 py-3 outline-none"
                />
                <button
                  onClick={clearSearch}
                  className="text-xs text-violet-400 hover:text-violet-200 px-4 py-3 transition-colors border-l border-violet-500/20 whitespace-nowrap"
                >
                  Clear ×
                </button>
              </div>

              {/* ── "More to explore" chips ── */}
              {chips.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2.5 flex items-center gap-1.5">
                    <TrendingUp size={11} className="text-violet-500" /> More to explore
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => chipClick(chip)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-90"
                        style={{
                          background: "rgba(124,58,237,0.1)",
                          border: "1px solid rgba(124,58,237,0.3)",
                          color: "#c084fc",
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Filter + sort bar ── */}
              <div
                className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-2xl mb-8"
                style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}
              >
                <span className="text-gray-600 text-[11px] flex items-center gap-1 mr-1">
                  <SlidersHorizontal size={11} /> Filter:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: cat === category ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(255,255,255,0.04)",
                      border: cat === category ? "none" : "1px solid rgba(124,58,237,0.18)",
                      color: cat === category ? "#fff" : "#9ca3af",
                    }}
                  >
                    {cat}
                  </button>
                ))}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="ml-auto bg-transparent border border-violet-500/20 text-gray-400 text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="priceLow">Price ↑</option>
                  <option value="priceHigh">Price ↓</option>
                </select>
              </div>
            </motion.div>
          ) : (
            /* ────────────────────────────────────────────────
                BROWSE-ALL header
            ──────────────────────────────────────────────── */
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="tag-purple inline-flex mb-3">All Courses</div>
                  <h1 className="text-4xl font-black text-white mb-2">Browse All Courses</h1>
                  <p className="text-gray-400 text-sm">Search, filter, and find the right course for your goal.</p>
                </div>
                <Link
                  href="/"
                  className="hidden sm:inline-flex text-sm border border-violet-500/30 text-violet-300 px-5 py-2.5 rounded-xl font-semibold hover:bg-violet-500/10 transition-colors"
                >
                  ← Home
                </Link>
              </div>

              {/* Search bar for browse mode */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (query.trim()) router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
                }}
                className="flex items-center rounded-xl mb-5 overflow-hidden"
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(168,85,247,0.35)",
                }}
              >
                <Search size={15} className="ml-4 text-violet-400 flex-shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, skills, instructors…"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 px-3 py-3 outline-none"
                />
                <button
                  type="submit"
                  className="text-xs text-white font-semibold px-5 py-3 transition-all hover:opacity-90 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                >
                  Search
                </button>
              </form>

              {/* Filters */}
              <div
                className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-2xl mb-5"
                style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(124,58,237,0.15)" }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: cat === category ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(255,255,255,0.04)",
                      border: cat === category ? "none" : "1px solid rgba(124,58,237,0.18)",
                      color: cat === category ? "#fff" : "#9ca3af",
                    }}
                  >
                    {cat}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-gray-600 text-[11px]">{filtered.length} courses</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-transparent border border-violet-500/20 text-gray-400 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="priceLow">Price ↑</option>
                    <option value="priceHigh">Price ↓</option>
                  </select>
                </div>
              </div>

              {/* New content strip */}
              <div
                className="rounded-2xl px-5 py-3.5 flex items-center gap-3 mb-2"
                style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.18)" }}
              >
                <Sparkles size={15} className="text-violet-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  New this month: 6 fresh courses across <span className="text-violet-300">AI/ML</span>,{" "}
                  <span className="text-violet-300">Marketing</span>, and{" "}
                  <span className="text-violet-300">Advanced Development</span>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ────────────────────────────────────────────────
            COURSE GRID
        ──────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-white mb-2">No courses found</h2>
            <p className="text-gray-500 text-sm mb-6">
              No results for &ldquo;<span className="text-violet-300">{query}</span>&rdquo;.
              Try a related keyword or browse all.
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
            >
              Browse all courses
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course, i) => {
              const col = categoryColors[course.category] ?? { text: "#c084fc", bg: "rgba(124,58,237,0.12)" };
              return (
                <motion.article
                  key={course.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(i * 0.04, 0.28) }}
                  whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(124,58,237,0.2)" }}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: "rgba(15,15,30,0.85)",
                    border: "1px solid rgba(124,58,237,0.18)",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative h-36 flex items-center justify-center text-5xl flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,${col.bg},rgba(124,58,237,0.08))` }}
                  >
                    {course.emoji}
                    {/* Level */}
                    <span
                      className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-lg"
                      style={{ background: "rgba(8,8,15,0.75)", color: col.text, border: `1px solid ${col.text}35` }}
                    >
                      {course.level}
                    </span>
                    {/* Rating */}
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-lg"
                      style={{ background: "rgba(8,8,15,0.75)", color: "#fbbf24" }}>
                      ★ {course.rating}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Category + duration */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-[11px] font-semibold" style={{ color: col.text }}>{course.category}</span>
                      <span className="text-gray-700 text-xs">·</span>
                      <span className="text-gray-600 text-[11px]">{course.duration} · {course.lessons} lessons</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-bold text-white leading-snug mb-1">{course.title}</h2>
                    <p className="text-[11px] text-gray-500 mb-2">by {course.instructor}</p>

                    {/* Description */}
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{course.shortDescription}</p>

                    {/* Skill chips */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {course.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: col.bg, color: col.text, border: `1px solid ${col.text}25` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Enrolled */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <BookOpen size={10} className="text-gray-600" />
                      <span className="text-[11px] text-gray-600">{course.students} enrolled</span>
                    </div>

                    {/* Price + CTAs */}
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-xl font-black text-white">${course.price.oneMonth}</span>
                        <span className="text-gray-600 text-xs ml-1">/mo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:bg-violet-500/10"
                          style={{ border: "1px solid rgba(124,58,237,0.3)", color: "#c084fc" }}
                        >
                          Details
                        </Link>
                        <Link
                          href={`/checkout?slug=${encodeURIComponent(course.slug)}&plan=1month`}
                          className="text-xs font-semibold px-3.5 py-2 rounded-xl text-white transition-all hover:opacity-90"
                          style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                        >
                          Enroll
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
