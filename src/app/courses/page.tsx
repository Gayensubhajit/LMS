"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { coursesData, type Course } from "@/lib/courses-data";
import {
  mergeCourse,
  unionCourses,
  type BackendCourse,
} from "@/lib/course-utils";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/lms/Navbar";
import { formatLocalPrice } from "@/lib/utils/currency";

const montserrat = Montserrat({ subsets: ["latin"] });
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

const categories = [
  "All",
  "Free",
  "Design",
  "Development",
  "AI/ML",
  "Business",
  "Marketing",
] as const;
type Category = (typeof categories)[number];

const categoryColors: Record<string, { text: string; bg: string }> = {
  Development: { text: "#60a5fa", bg: "rgba(59,130,246,0.12)" },
  Design: { text: "#f472b6", bg: "rgba(236,72,153,0.12)" },
  "AI/ML": { text: "#a78bfa", bg: "rgba(139,92,246,0.12)" },
  Business: { text: "#fbbf24", bg: "rgba(245,158,11,0.12)" },
  Marketing: { text: "#34d399", bg: "rgba(16,185,129,0.12)" },
};

function getRelatedChips(q: string): string[] {
  const l = q.toLowerCase();
  if (l.includes("python") || l.includes("data"))
    return ["data analysis", "pandas", "machine learning", "statistics"];
  if (l.includes("react") || l.includes("next"))
    return ["typescript", "next.js", "full-stack", "api design"];
  if (l.includes("ui") || l.includes("ux") || l.includes("design"))
    return ["wireframing", "prototyping", "design systems", "user research"];
  return ["development", "ai tools", "growth strategy"];
}

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken, userId } = useAuth();

  const urlQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQ);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [category, setCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<
    "popular" | "rating" | "priceLow" | "priceHigh"
  >("popular");
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [backendLoaded, setBackendLoaded] = useState(false);
  const [enrolledSlugs, setEnrolledSlugs] = useState<Set<string>>(new Set());

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/courses`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && data.items?.length) {
        const merged = data.items
          .map(mergeCourse)
          .filter((c: any): c is Course => c !== null);
        if (merged.length > 0) setCourses(unionCourses(coursesData, merged));
      }
    } catch (err) {
    } finally {
      setBackendLoaded(true);
    }
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
      }
    } catch (err) {}
  }, [userId, getToken]);

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);
  useEffect(() => {
    void fetchEnrollments();
  }, [fetchEnrollments]);
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return courses
      .filter((c) => {
        const matchesFree = category === "Free" ? c.isFree : true;
        const matchesCat =
          category === "All" || category === "Free" || c.category === category;
        const hay =
          `${c.title} ${c.instructor} ${c.category} ${c.skills.join(" ")}`.toLowerCase();
        return matchesFree && matchesCat && (q === "" || hay.includes(q));
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "priceLow") return a.price.oneMonth - b.price.oneMonth;
        if (sortBy === "priceHigh") return b.price.oneMonth - a.price.oneMonth;
        return parseFloat(b.students) - parseFloat(a.students);
      });
  }, [debouncedQuery, category, sortBy, courses]);

  const isSearchMode = query.trim().length > 0;
  const chips = isSearchMode ? getRelatedChips(query) : [];

  return (
    <>
      <Navbar />
      <main
        className={`${montserrat.className} mb-16 min-h-screen bg-background text-foreground pt-20 px-6`}
      >
        <div className="max-w-7xl mx-auto py-10">
          {/* Header & Search */}
          <div className="px-6 hidden md:flex items-center justify-end">
            <Link
              href="/"
              className="text-sm text-violet-300 hover:text-white transition-colors border border-violet-500/30 px-6 py-2.5 rounded-full"
            >
              ← Back to Home
            </Link>
          </div>
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-center gap-6 mb-8">
              <div className="flex flex-col items-center justify-center">
                <div className="tag-purple inline-flex mb-3">
                  EDU-NOVA Academy
                </div>
                <div className="flex items-center justify-center">
                  <h1 className="text-center text-4xl md:text-6xl font-black text-white mb-4">
                    {isSearchMode ? "Search Results" : "Explore Our Catalog"}
                  </h1>
                </div>
                <p className="text-gray-400 max-w-xl text-lg">
                  {backendLoaded
                    ? `Showing ${filtered.length} courses powered by our live learning database.`
                    : "Loading verified expert-led courses..."}
                </p>
              </div>
            </div>

            <div className="flex justify-center w-full px-3">
              <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white/5 rounded-xl border border-violet-500/20 backdrop-blur-xl overflow-hidden">
                {/* Search */}
                <div className="relative flex-1 min-w-0 flex items-center">
                  <Search className="absolute left-3 text-gray-500" size={16} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full min-w-0 bg-transparent text-white pl-9 pr-3 py-2.5 outline-none placeholder-gray-500 text-sm font-medium"
                  />
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-white/10" />

                {/* Sort */}
                <div className="flex items-center gap-2 px-3 py-2 border-t md:border-t-0 md:border-l border-white/10 min-w-0">
                  <TrendingUp size={14} className="text-violet-400 shrink-0" />

                  {/* Hide label on very small screens */}
                  <span className="hidden sm:block text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                    Sort
                  </span>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 min-w-0 bg-[#0a0a1a] border border-violet-500/20 text-gray-300 text-xs font-semibold px-3 py-2 rounded-lg outline-none cursor-pointer hover:border-violet-500/40 transition-all appearance-none pr-7"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237c3aed'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 8px center",
                      backgroundSize: "12px",
                    }}
                  >
                    <option value="popular">Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="priceLow">Low → High</option>
                    <option value="priceHigh">High → Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Categories (Horizontal Scroll) */}
            <div className="lg:hidden mt-8 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
              <div className="flex items-center gap-3 min-w-max">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border ${
                      category === cat
                        ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/20"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block space-y-8 sticky top-28 self-start">
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-violet-400" />{" "}
                  Categories
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all ${category === cat ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-600/10 to-purple-600/5 border border-violet-500/10">
                <Sparkles className="text-violet-400 mb-3" size={20} />
                <h4 className="text-white font-bold mb-1">Elite Learning</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Join 45,000+ students leveling up their careers with EduNova.
                </p>
              </div>
            </aside>

            {/* Course Grid */}
            <div className="lg:col-span-3">
              {filtered.length === 0 ? (
                <div className="text-center py-20 rounded-3xl border border-dashed border-violet-500/20 bg-white/5">
                  <p className="text-gray-500">
                    No courses matching your search. Try another keyword!
                  </p>
                  <button
                    onClick={() => setQuery("")}
                    className="mt-4 text-violet-400 underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((course, i) => {
                    const col = categoryColors[course.category] ?? {
                      text: "#a78bfa",
                      bg: "rgba(139,92,246,0.12)",
                    };
                    return (
                      <motion.article
                        key={course.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative flex flex-col bg-white/5 rounded-3xl border border-violet-500/10 overflow-hidden hover:border-violet-500/40 transition-all shadow-xl hover:shadow-violet-500/10"
                      >
                        <div className="relative h-56 overflow-hidden">
                          {course.img ? (
                            <img
                              src={course.img}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl bg-indigo-900/20">
                              {course.emoji}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="bg-black/60 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest font-bold">
                              {course.level}
                            </span>
                          </div>
                          {course.isFree && (
                            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                              FREE
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className="text-[10px] font-bold uppercase tracking-widest"
                              style={{ color: col.text }}
                            >
                              {course.category}
                            </span>
                            <span className="text-gray-600 text-xs">•</span>
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <BookOpen size={12} /> {course.lessons} Lessons
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-violet-300 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                            by {course.instructor} • {course.shortDescription}
                          </p>

                          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-gray-600 uppercase font-bold tracking-wider mb-1">
                                Pricing
                              </p>
                              <p className="text-xl font-black text-white">
                                {course.isFree ? (
                                  <span className="text-emerald-400">Free</span>
                                ) : (
                                  formatLocalPrice(course.price.oneMonth)
                                )}
                                {!course.isFree && (
                                  <span className="text-[10px] text-gray-600 ml-1 font-normal">
                                    /mo
                                  </span>
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                href={`/courses/${course.slug}`}
                                className="px-4 py-2 rounded-xl text-[10px] font-bold text-violet-300 border border-violet-500/20 hover:bg-violet-500/10 transition-all"
                              >
                                Details
                              </Link>
                              {enrolledSlugs.has(course.slug) ? (
                                <Link
                                  href={`/learn/${course.slug}`}
                                  className="px-4 py-2 rounded-xl text-[10px] font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all"
                                >
                                  Go to course
                                </Link>
                              ) : (
                                <Link
                                  href={
                                    course.isFree
                                      ? `/learn/${course.slug}`
                                      : `/checkout?slug=${course.slug}&plan=1month`
                                  }
                                  className="px-4 py-2 rounded-xl text-[10px] font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600 hover:text-white transition-all flex items-center gap-1.5"
                                >
                                  Enroll <ArrowRight size={10} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-white flex items-center justify-center pt-20">
          Loading EduNova Library...
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}
