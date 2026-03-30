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
import { Montserrat } from "next/font/google";
import Navbar from "@/components/lms/Navbar";

const montserrat = Montserrat({ subsets: ["latin"] });
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

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
  imageUrl: string | null;
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
    img: bc.imageUrl ?? local.img,
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
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "priceLow" | "priceHigh">("popular");
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [backendLoaded, setBackendLoaded] = useState(false);
  const [enrolledSlugs, setEnrolledSlugs] = useState<Set<string>>(new Set());

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/courses`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && data.items?.length) {
        const merged = data.items.map(mergeCourse).filter((c: any): c is Course => c !== null);
        if (merged.length > 0) setCourses(merged);
      }
    } catch (err) {} finally { setBackendLoaded(true); }
  }, []);

  const fetchEnrollments = useCallback(async () => {
    if (!userId) { setEnrolledSlugs(new Set()); return; }
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/enrollments/me`, {
        headers: { Authorization: `Bearer ${token}`, "x-clerk-user-id": userId },
      });
      const data = await res.json();
      if (data.ok && data.items) {
        setEnrolledSlugs(new Set(data.items.map((e: any) => e.course.slug)));
      }
    } catch (err) {}
  }, [userId, getToken]);

  useEffect(() => { void fetchCourses(); }, [fetchCourses]);
  useEffect(() => { void fetchEnrollments(); }, [fetchEnrollments]);
  useEffect(() => { setQuery(searchParams.get("q") ?? ""); }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return courses
      .filter((c) => {
        const matchesFree = category === "Free" ? c.isFree : true;
        const matchesCat = category === "All" || category === "Free" || c.category === category;
        const hay = `${c.title} ${c.instructor} ${c.category} ${c.skills.join(" ")}`.toLowerCase();
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
      <main className={`${montserrat.className} mb-16 min-h-screen bg-background text-foreground pt-20 px-6`}>
        <div className="max-w-7xl mx-auto py-10">
          
          {/* Header & Search */}
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="tag-purple inline-flex mb-3">EDU-NOVA Academy</div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                  {isSearchMode ? "Search Results" : "Explore Our Catalog"}
                </h1>
                <p className="text-gray-400 max-w-xl text-lg">
                  {backendLoaded ? `Showing ${filtered.length} courses powered by our live learning database.` : "Loading verified expert-led courses..."}
                </p>
              </div>
              <Link href="/" className="text-sm text-violet-300 hover:text-white transition-colors border border-violet-500/30 px-6 py-2.5 rounded-full">
                ← Back to Home
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 bg-white/5 p-2 rounded-3xl border border-violet-500/20">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What do you want to learn today?"
                    className="w-full bg-transparent text-white px-12 py-4 outline-none placeholder:text-gray-600"
                  />
               </div>
               <div className="flex items-center gap-2 p-2">
                 <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-background/50 border border-violet-500/20 text-gray-300 text-sm px-4 py-2 rounded-2xl outline-none"
                  >
                   <option value="popular">Popular</option>
                   <option value="rating">Top Rated</option>
                   <option value="priceLow">Price: Low to High</option>
                   <option value="priceHigh">Price: High to Low</option>
                 </select>
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block space-y-8">
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-violet-400" /> Categories
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
                   <p className="text-gray-500">No courses matching your search. Try another keyword!</p>
                   <button onClick={() => setQuery("")} className="mt-4 text-violet-400 underline underline-offset-4">Clear all filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((course, i) => {
                    const col = categoryColors[course.category] ?? { text: "#a78bfa", bg: "rgba(139,92,246,0.12)" };
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
                             <img src={course.img} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-8xl bg-indigo-900/20">{course.emoji}</div>
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                           <div className="absolute top-4 left-4">
                             <span className="bg-black/60 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest font-bold">
                               {course.level}
                             </span>
                           </div>
                           {course.isFree && (
                             <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">FREE</div>
                           )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: col.text }}>{course.category}</span>
                            <span className="text-gray-600 text-xs">•</span>
                            <span className="text-gray-400 text-xs flex items-center gap-1"><BookOpen size={12} /> {course.lessons} Lessons</span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-violet-300 transition-colors">{course.title}</h3>
                          <p className="text-sm text-gray-500 mb-6 line-clamp-2">by {course.instructor} • {course.shortDescription}</p>

                          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                             <div>
                               <p className="text-xs text-gray-600 uppercase font-bold tracking-wider mb-1">Pricing</p>
                               <p className="text-xl font-black text-white">
                                  {course.isFree ? <span className="text-emerald-400">Free</span> : `$${course.price.oneMonth}`}
                                  {!course.isFree && <span className="text-[10px] text-gray-600 ml-1 font-normal">/mo</span>}
                               </p>
                             </div>
                             
                             <div className="flex items-center gap-2">
                                <Link href={`/courses/${course.slug}`} className="px-4 py-2 rounded-xl text-[10px] font-bold text-violet-300 border border-violet-500/20 hover:bg-violet-500/10 transition-all">Details</Link>
                                {enrolledSlugs.has(course.slug) ? (
                                  <Link href={`/learn/${course.slug}`} className="px-4 py-2 rounded-xl text-[10px] font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all">Go to course</Link>
                                ) : (
                                  <Link 
                                    href={course.isFree ? `/learn/${course.slug}` : `/checkout?slug=${course.slug}&plan=1month`} 
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
    <Suspense fallback={<div className="min-h-screen bg-background text-white flex items-center justify-center pt-20">Loading EduNova Library...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
