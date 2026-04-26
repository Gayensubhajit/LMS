"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
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
} from "@/lib/course-utils";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/lms/Navbar";
import { formatLocalPrice } from "@/lib/utils/currency";
import { backendRequest } from "@/lib/backend-client";
import { CourseCardSkeleton } from "@/components/lms/Skeletons";

const montserrat = Montserrat({ subsets: ["latin"] });

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

const categoryColors: Record<
  string,
  { text: string; bg: string; lightText: string; lightBg: string }
> = {
  Development: {
    text: "#60a5fa",
    bg: "rgba(59,130,246,0.12)",
    lightText: "#1d4ed8",
    lightBg: "rgba(29,78,216,0.08)",
  },
  Design: {
    text: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    lightText: "#0369a1",
    lightBg: "rgba(3,105,161,0.08)",
  },
  "AI/ML": {
    text: "#818cf8",
    bg: "rgba(129,140,248,0.12)",
    lightText: "#4338ca",
    lightBg: "rgba(67,56,202,0.08)",
  },
  Business: {
    text: "#fbbf24",
    bg: "rgba(245,158,11,0.12)",
    lightText: "#b45309",
    lightBg: "rgba(180,83,9,0.08)",
  },
  Marketing: {
    text: "#34d399",
    bg: "rgba(16,185,129,0.12)",
    lightText: "#047857",
    lightBg: "rgba(0,120,87,0.08)",
  },
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

export default function CoursesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken, userId } = useAuth();

  const urlQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQ);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [category, setCategory] = useState<Category>("All");
  const [level, setLevel] = useState<string>("All");
  const [priceType, setPriceType] = useState<"All" | "Free" | "Premium">("All");
  const [sortBy, setSortBy] = useState<
    "popular" | "rating" | "priceLow" | "priceHigh"
  >("popular");
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [backendLoaded, setBackendLoaded] = useState(false);
  const [enrolledSlugs, setEnrolledSlugs] = useState<Set<string>>(new Set());
  const [isPlusMember, setIsPlusMember] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const data = await backendRequest<{ ok: boolean; items: any[] }>("/courses");
      if (data && data.ok && data.items?.length) {
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
      const data = await backendRequest<{ ok: boolean; items: any[] }>("/enrollments/me", {
        clerkUserId: userId,
      });
      if (data.ok && data.items) {
        const activeSlugs = data.items
          .filter((e: any) => e.status === "ACTIVE" || e.status === "TRIALING")
          .map((e: any) => e.course.slug);
        setEnrolledSlugs(new Set(activeSlugs));
 
        // Check for Plus Membership (Active or Trialing)
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
        if (c.isHidden) return false;
        
        // Category Facet
        const matchesCat = category === "All" || c.category === category || (category === "Free" && c.isFree);
        
        // Level Facet
        const matchesLevel = level === "All" || c.level === level;

        // Price Type Facet
        const matchesPrice = priceType === "All" || (priceType === "Free" ? c.isFree : !c.isFree);

        // Search Query
        const hay = `${c.title} ${c.instructor} ${c.category} ${c.skills.join(" ")}`.toLowerCase();
        const matchesSearch = q === "" || hay.includes(q);

        return matchesCat && matchesLevel && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "priceLow") return a.price.oneMonth - b.price.oneMonth;
        if (sortBy === "priceHigh") return b.price.oneMonth - a.price.oneMonth;
        return parseFloat(b.students) - parseFloat(a.students);
      });
  }, [debouncedQuery, category, sortBy, courses]);

  const isSearchMode = query.trim().length > 0;

  return (
    <>
      <Navbar />
      <main
        className={`${montserrat.className} mb-16 min-h-screen bg-[#f6f8ff] dark:bg-background text-foreground pt-20 px-6`}
      >
        <div className="max-w-7xl mx-auto py-10">
          {/* Header & Search */}
          <div className="px-6 hidden md:flex items-center justify-end">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-[#0056d2] transition-colors border border-slate-200 hover:border-[#0056d2]/30 px-6 py-2.5 rounded-full bg-white shadow-sm dark:text-blue-400 dark:hover:text-white dark:border-blue-500/30 dark:bg-transparent dark:shadow-none"
            >
              ← Back to Home
            </Link>
          </div>
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-center gap-6 mb-8">
              <div className="flex flex-col items-center justify-center">
                <span
                  className={`${montserrat.className} inline-flex items-center gap-2 px-2 py-1 border border-gray-900/50 dark:border-violet-500/50 rounded-lg text-xs font-black tracking-[0.25em] text-black dark:text-violet-400 uppercase mb-4`}
                >
                  EDU-NOVA Academy
                </span>
                <div className="flex items-center justify-center">
                  <h1 className="font-serif text-center text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">
                    {isSearchMode ? "Search Results" : "Explore Our Catalog"}
                  </h1>
                </div>
                <p className="text-slate-600 dark:text-gray-400 max-w-xl text-lg">
                  {backendLoaded
                    ? `Showing ${filtered.length} courses powered by our live learning database.`
                    : "Loading verified expert-led courses..."}
                </p>
              </div>
            </div>

            <div className="flex justify-center w-full px-3">
              <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-blue-500/20 shadow-md dark:shadow-none backdrop-blur-xl overflow-hidden">
                {/* Search */}
                <div className="relative flex-1 min-w-0 flex items-center">
                  <Search
                    className="absolute left-3 text-slate-400 dark:text-gray-500"
                    size={16}
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full min-w-0 bg-transparent text-slate-900 dark:text-white pl-9 pr-3 py-2.5 outline-none placeholder-slate-400 dark:placeholder-gray-500 text-sm font-medium"
                  />
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-white/10" />

                {/* Sort */}
                <div className="flex items-center gap-2 px-3 py-2 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 min-w-0">
                  <TrendingUp
                    size={14}
                    className="text-blue-500 dark:text-blue-400 shrink-0"
                  />

                  {/* Hide label on very small screens */}
                  <span className="hidden sm:block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                    Sort
                  </span>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 min-w-0 bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-blue-500/20 text-slate-700 dark:text-gray-300 text-xs font-semibold px-3 py-2 rounded-lg outline-none cursor-pointer hover:border-blue-500/40 transition-all appearance-none pr-7"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
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
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
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
                {/* Category Facet */}
                <div>
                  <h3 className="text-slate-900 dark:text-white font-black mb-4 flex items-center gap-2 uppercase tracking-tight text-sm">
                    <SlidersHorizontal
                      size={16}
                      className="text-blue-500 dark:text-blue-400"
                    />{" "}
                    Categories
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${category === cat ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold" : "text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Facet */}
                <div>
                  <h3 className="text-slate-900 dark:text-white font-black mb-4 uppercase tracking-tight text-sm">
                    Difficulty Level
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${level === l ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold" : "text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price facet */}
                <div>
                  <h3 className="text-slate-900 dark:text-white font-black mb-4 uppercase tracking-tight text-sm">
                    Price Type
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {["All", "Free", "Premium"].map((p: any) => (
                      <button
                        key={p}
                        onClick={() => setPriceType(p)}
                        className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${priceType === p ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold" : "text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-linear-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/10">
                  <Sparkles
                    className="text-blue-600 dark:text-blue-400 mb-3"
                    size={20}
                  />
                  <h4 className="text-slate-900 dark:text-white font-bold mb-1 leading-tight">
                    Personalized Path
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-gray-500 leading-relaxed font-medium">
                    Our AI evaluates your goals to recommend the perfect learning track.
                  </p>
                </div>
              </aside>

            {/* Course Grid */}
            <div className="lg:col-span-3">
              {!backendLoaded ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <CourseCardSkeleton key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 rounded-3xl border border-dashed border-slate-200 dark:border-blue-500/20 bg-white dark:bg-white/5 shadow-sm">
                  <p className="text-slate-500 dark:text-gray-400">
                    No courses matching your search. Try another keyword!
                  </p>
                  <button
                    onClick={() => {
                        setQuery("");
                        setCategory("All");
                        setLevel("All");
                        setPriceType("All");
                    }}
                    className="mt-4 text-[#0056d2] dark:text-blue-400 underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filtered.map((course, i) => {
                    const col = categoryColors[course.category] ?? {
                      text: "#60a5fa",
                      bg: "rgba(59,130,246,0.12)",
                      lightText: "#1d4ed8",
                      lightBg: "rgba(29,78,216,0.08)",
                    };
                    return (
                      <motion.article
                        key={course.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative flex flex-col bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-blue-500/10 overflow-hidden hover:border-[#0056d2]/30 dark:hover:border-blue-500/40 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                      >
                        <div className="relative h-56 overflow-hidden">
                          {course.img ? (
                            <img
                              src={course.img}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl bg-slate-100 dark:bg-indigo-900/20">
                              {course.emoji}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-slate-900/90 via-transparent to-transparent" />
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
                              className="text-[10px] font-black uppercase tracking-widest"
                              style={{
                                color: col.lightText,
                              }}
                            >
                              <span className="dark:hidden">
                                {course.category}
                              </span>
                              <span
                                className="hidden dark:inline"
                                style={{ color: col.text }}
                              >
                                {course.category}
                              </span>
                            </span>
                            <span className="text-slate-300 dark:text-gray-600 text-xs">
                              •
                            </span>
                            <span className="text-slate-400 dark:text-gray-400 text-xs flex items-center gap-1">
                              <BookOpen size={12} /> {course.lessons} Lessons
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-gray-400 mb-6 line-clamp-2">
                            by {course.instructor} • {course.shortDescription}
                          </p>

                          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xl font-black text-slate-900 dark:text-white">
                                {course.isFree ? (
                                  <span className="text-emerald-600 dark:text-emerald-400">
                                    Free
                                  </span>
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
                                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 hover:bg-slate-50 dark:text-violet-400 dark:border-blue-500/20 dark:hover:bg-blue-500/10 transition-all"
                              >
                                Details
                              </Link>
                              {enrolledSlugs.has(course.slug) ? (
                                <Link
                                  href={`/learn/${course.slug}`}
                                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#0056d2] text-white shadow-lg shadow-blue-500/20 hover:bg-[#00419e] transition-all"
                                >
                                  Go to course
                                </Link>
                                ) : isPlusMember ? (
                                  <Link
                                    href={`/learn/${course.slug}`}
                                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all font-sans"
                                  >
                                    Enroll Now
                                  </Link>
                                ) : (
                                  <Link
                                    href={
                                      course.isFree
                                        ? `/learn/${course.slug}`
                                        : `/checkout?slug=${course.slug}&plan=1month`
                                    }
                                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#0056d2] text-white shadow-lg shadow-blue-500/20 hover:bg-[#00419e] transition-all flex items-center gap-1.5"
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
