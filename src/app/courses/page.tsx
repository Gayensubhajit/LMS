"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { coursesData, type Course } from "@/lib/courses-data";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";

const montserrat = Montserrat({ subsets: ["latin"] });
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type BackendCourse = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  level: string;
  instructorName: string;
  oneMonthPrice: number;
  threeMonthPrice: number;
  sixMonthPrice: number;
};

// Merge backend DB fields on top of local display metadata (emoji, skills, duration, etc.)
function mergeCourse(bc: BackendCourse): Course | null {
  const local = coursesData.find((c) => c.slug === bc.slug);
  if (!local) return null;
  const levelRaw = bc.level.replace("_", " ");
  const level = (levelRaw.charAt(0) +
    levelRaw.slice(1).toLowerCase()) as Course["level"];
  return {
    ...local,
    title: bc.title,
    shortDescription: bc.shortDescription,
    category: bc.category as Course["category"],
    level,
    instructor: bc.instructorName,
    price: {
      oneMonth: bc.oneMonthPrice,
      threeMonth: bc.threeMonthPrice,
      sixMonth: bc.sixMonthPrice,
    },
  };
}

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
    return [
      "data analysis",
      "pandas",
      "machine learning",
      "statistics",
      "visualization",
    ];
  if (l.includes("react") || l.includes("next"))
    return [
      "typescript",
      "next.js",
      "full-stack",
      "api design",
      "server components",
    ];
  if (
    l.includes("ui") ||
    l.includes("ux") ||
    l.includes("design") ||
    l.includes("figma")
  )
    return [
      "wireframing",
      "prototyping",
      "design systems",
      "user research",
      "interaction",
    ];
  if (l.includes("ai") || l.includes("ml") || l.includes("machine"))
    return ["deep learning", "llm", "prompt engineering", "automation", "nlp"];
  if (l.includes("full") || l.includes("stack"))
    return [
      "node.js",
      "databases",
      "cloud deploy",
      "rest api",
      "system design",
    ];
  if (l.includes("market") || l.includes("growth"))
    return ["seo", "a/b testing", "funnel design", "analytics", "ads"];
  return [];
}

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQ);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [category, setCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<
    "popular" | "rating" | "priceLow" | "priceHigh"
  >("popular");

  // Backend-fetched courses merged with local metadata
  const [courses, setCourses] = useState<Course[]>(coursesData); // start with local
  const [backendLoaded, setBackendLoaded] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/courses`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        ok: boolean;
        items: BackendCourse[];
      };
      if (!data.ok || !data.items?.length) return;
      const merged = data.items
        .map(mergeCourse)
        .filter((c): c is Course => c !== null);
      if (merged.length > 0) setCourses(merged);
    } catch {
      // Backend unreachable — keep local data
    } finally {
      setBackendLoaded(true);
    }
  }, []);

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const isSearchMode = query.trim().length > 0;
  const chips = isSearchMode ? getRelatedChips(query) : [];

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const base = courses.filter((c) => {
      const matchesFree = category === "Free" ? c.isFree === true : true;
      const matchesCat =
        category === "All" || category === "Free" || c.category === category;
      const hay =
        `${c.title} ${c.instructor} ${c.category} ${c.skills.join(" ")} ${c.shortDescription}`.toLowerCase();
      return matchesFree && matchesCat && (q === "" || hay.includes(q));
    });
    const s = [...base];
    if (sortBy === "rating") s.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "priceLow")
      s.sort((a, b) => a.price.oneMonth - b.price.oneMonth);
    else if (sortBy === "priceHigh")
      s.sort((a, b) => b.price.oneMonth - a.price.oneMonth);
    else s.sort((a, b) => parseFloat(b.students) - parseFloat(a.students));
    // Always bubble free courses to top when not filtering by price
    if (sortBy === "popular" || sortBy === "rating")
      s.sort((a, b) => (b.isFree ? 1 : 0) - (a.isFree ? 1 : 0));
    return s;
  }, [debouncedQuery, category, sortBy, courses]);

  const chipClick = (chip: string) =>
    router.push(`/courses?q=${encodeURIComponent(chip)}`);
  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  const { getToken, userId } = useAuth();
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [enrolledSlugs, setEnrolledSlugs] = useState<Set<string>>(new Set());

  // Fetch enrolled courses for the user
  useEffect(() => {
    if (!userId) {
      setEnrolledSlugs(new Set());
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/enrollments/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-clerk-user-id": userId
          }
        });
        const data = await res.json();
        if (data.ok && data.items) {
          const slugs = new Set<string>(data.items.map((e: { course: { slug: string } }) => e.course.slug));
          setEnrolledSlugs(slugs);
        }
      } catch (err) {
        console.error("Fetch enrollments error:", err);
      }
    };

    fetchEnrollments();
  }, [userId, getToken]);

  const handleEnrollFree = async (courseSlug: string) => {
    if (!userId) {
      router.push("/auth/sign-in?redirect_url=/courses");
      return;
    }

    try {
      setEnrolling(courseSlug);
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-clerk-user-id": userId,
        },
        body: JSON.stringify({ courseSlug }),
      });

      const data = await res.json();
      if (data.ok) {
        router.push(`/courses/${courseSlug}`);
      } else {
        alert(data.error || "Enrollment failed");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Something went wrong during enrollment.");
    } finally {
      setEnrolling(null);
    }
  };

  useEffect(() => {
    const t: ReturnType<typeof setTimeout> = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => window.clearTimeout(t);
  }, [query]);

  return (
    <>
      <Navbar />
      <main className={`${montserrat.className} min-h-screen bg-background text-foreground pt-20`}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <AnimatePresence mode="wait">
            {isSearchMode ? (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2 }}
              >
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
                    {filtered.length} course{filtered.length !== 1 ? "s" : ""}{" "}
                    found
                    {category !== "All" ? ` · filtered by ${category}` : ""}
                  </p>
                </div>

                <div
                  className="flex items-center rounded-xl mb-5 overflow-hidden"
                  style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(168,85,247,0.4)" }}
                >
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && query.trim()) {
                        router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
                      }
                    }}
                    placeholder="Refine your search…"
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 px-4 py-3 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => query.trim() && router.push(`/courses?q=${encodeURIComponent(query.trim())}`)}
                    className="mr-1.5 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <Search size={16} className="text-white" />
                  </button>
                  <button
                    onClick={clearSearch}
                    className="text-xs text-violet-400 hover:text-violet-200 px-4 py-3 transition-colors border-l border-violet-500/20 whitespace-nowrap"
                  >
                    Clear ×
                  </button>
                </div>

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
                          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", color: "#c084fc" }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                    <p className="text-gray-400 text-sm">
                      {backendLoaded
                        ? `${courses.length} courses available · prices from real database`
                        : "Search, filter, and find the right course for your goal."}
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="hidden sm:inline-flex text-sm border border-violet-500/30 text-violet-300 px-5 py-2.5 rounded-xl font-semibold hover:bg-violet-500/10 transition-colors"
                  >
                    ← Home
                  </Link>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (query.trim()) router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="flex items-center rounded-xl mb-5 overflow-hidden"
                  style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(168,85,247,0.35)" }}
                >
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search courses, skills, instructors…"
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 px-4 py-3 outline-none"
                  />
                  <button
                    type="submit"
                    className="mr-1.5 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <Search size={16} className="text-white" />
                  </button>
                </form>

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

                <div
                  className="rounded-2xl px-5 py-3.5 flex items-center gap-3 mb-2"
                  style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.18)" }}
                >
                  <Sparkles size={15} className="text-violet-400 flex-shrink-0" />
                  <p className="text-sm text-gray-400">
                    {backendLoaded
                      ? `Showing ${courses.length} live courses with real-time pricing from our database`
                      : "New this month: fresh courses across AI/ML, Marketing, and Advanced Development."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Course Grid ── */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-white mb-2">No courses found</h2>
              <p className="text-gray-500 text-sm mb-6">
                No results for &ldquo;<span className="text-violet-300">{query}</span>&rdquo;. Try a related keyword or browse all.
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
                    style={{ background: "rgba(15,15,30,0.85)", border: "1px solid rgba(124,58,237,0.18)" }}
                  >
                    <div className="relative h-36 flex items-center justify-center text-5xl flex-shrink-0" style={{ background: `linear-gradient(135deg,${col.bg},rgba(124,58,237,0.08))` }}>
                      {course.emoji}
                      {course.isFree && (
                        <span className="absolute top-3 left-3 text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-500 text-white tracking-wide">FREE</span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-[11px] font-semibold" style={{ color: col.text }}>{course.category}</span>
                        <span className="text-gray-700 text-xs">·</span>
                        <span className="text-gray-600 text-[11px]">{course.duration} · {course.lessons} lessons</span>
                      </div>
                      <h2 className="text-base font-bold text-white leading-snug mb-1">{course.title}</h2>
                      <p className="text-[11px] text-gray-500 mb-2">by {course.instructor}</p>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{course.shortDescription}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {course.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: col.bg, color: col.text, border: `1px solid ${col.text}25` }}>{skill}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 mb-4">
                        < BookOpen size={10} className="text-gray-600" />
                        <span className="text-[11px] text-gray-600">{course.students} enrolled</span>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          {course.isFree ? (
                            <span className="text-xl font-black text-emerald-400">Free</span>
                          ) : (
                            <>
                              <span className="text-xl font-black text-white">${course.price.oneMonth}</span>
                              <span className="text-gray-600 text-xs ml-1">/mo</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {enrolledSlugs.has(course.slug) ? (
                             <Link href={`/learn/${course.slug}`} className="text-xs font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 shadow-lg shadow-blue-500/20" style={{ background: "linear-gradient(135deg,#2563eb,#3b82f6)" }}>Go to course</Link>
                          ) : (
                            <>
                              <Link href={`/courses/${course.slug}`} className="text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:bg-violet-500/10" style={{ border: "1px solid rgba(124,58,237,0.3)", color: "#c084fc" }}>Details</Link>
                              {course.isFree ? (
                                <button onClick={() => handleEnrollFree(course.slug)} disabled={enrolling === course.slug} className="text-xs font-semibold px-3.5 py-2 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>{enrolling === course.slug ? "Enrolling..." : "Enroll for free"}</button>
                              ) : (
                                <Link href={`/checkout?slug=${encodeURIComponent(course.slug)}&plan=1month`} className="text-xs font-semibold px-3.5 py-2 rounded-xl text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>Enroll</Link>
                              )}
                            </>
                          )}
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
      <Footer />
    </>
  );
}
