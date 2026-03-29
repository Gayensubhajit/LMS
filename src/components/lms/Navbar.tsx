"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  BookOpen,
  Search,
  TrendingUp,
  Sparkles,
  History,
  ChevronRight,
  User,
  GraduationCap,
  Settings,
  LogOut,
  ShoppingBag,
  Award,
  HelpCircle,
  Globe,
  Bell,
  ArrowLeft,
} from "lucide-react";
import { coursesData } from "@/lib/courses-data";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import { syncCourseView } from "@/lib/history-api";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Instructors", href: "/instructors" },
  { label: "Pricing", href: "/pricing" },
];

// Rich popular searches with metadata
const popularSearches = [
  {
    term: "React & Next.js",
    emoji: "⚛️",
    category: "Development",
    badge: "🔥 Trending",
  },
  {
    term: "UI/UX Design",
    emoji: "🎨",
    category: "Design",
    badge: "⭐ Top Rated",
  },
  {
    term: "AI & Machine Learning",
    emoji: "🤖",
    category: "AI/ML",
    badge: "🔥 Trending",
  },
];

// Coursera-like mobile search trending chips (shown in the search sheet)
const mobileTrendingChips = [
  "artificial intelligence",
  "python",
  "microsoft excel",
  "ai",
  "excel",
  "machine learning",
  "project management",
  "data analytics",
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Development: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  Design: { bg: "rgba(236,72,153,0.15)", text: "#f472b6" },
  "AI/ML": { bg: "rgba(139,92,246,0.15)", text: "#a78bfa" },
  Business: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24" },
  Marketing: { bg: "rgba(16,185,129,0.15)", text: "#34d399" },
};

const profileMenuItems = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "My Learning", href: "/my-courses", icon: GraduationCap },
  { label: "My Purchases", href: "/purchases", icon: ShoppingBag },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Accomplishments", href: "/accomplishments", icon: Award },
  { label: "Help Center", href: "/support", icon: HelpCircle },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [scrolled, setScrolled] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<
    "none" | "main" | "account" | "search"
  >("none");
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [mobileQuery, setMobileQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [hasEnrollments, setHasEnrollments] = useState(false);
  const [focusMobileSearch, setFocusMobileSearch] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const RECENT_SEARCHES_KEY = "lms_recent_searches";

  // Load saved searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentSearches(parsed);
      }
    } catch {}
  }, []);

  // Persist to localStorage whenever recentSearches changes
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus mobile search when opened via the search icon
  useEffect(() => {
    if (mobilePanel !== "search" || !focusMobileSearch) return;
    requestAnimationFrame(() => {
      mobileSearchRef.current?.focus();
    });
    setFocusMobileSearch(false);
  }, [mobilePanel, focusMobileSearch]);

  // Load/save recent searches for the mobile search sheet
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed))
        setRecentSearches(parsed.filter((x) => typeof x === "string"));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(recentSearches),
      );
    } catch {
      // ignore
    }
  }, [recentSearches]);

  // Check enrollments to show "My Learning" link + silently sync user to DB if not yet there
  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    // Silently sync existing Clerk users who signed up before the webhook was configured
    backendRequest<{ ok: boolean; synced: boolean }>("/users/sync", {
      method: "POST",
      clerkUserId: user.id,
    }).catch(() => {
      /* silent — not critical */
    });

    backendRequest<{ ok: boolean; items: unknown[] }>("/dashboard/my-courses", {
      clerkUserId: user.id,
    })
      .then((res) => setHasEnrollments(res.items.length > 0))
      .catch(() => setHasEnrollments(false));
  }, [isLoaded, user?.id]);

  const addRecentSearch = (term: string, slug?: string) => {
    const t = term.trim();
    if (!t) return;
    const tLower = t.toLowerCase();

    // Update React state for in-session display
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== tLower);
      return [t, ...filtered].slice(0, 7);
    });

    // Write directly to localStorage for cross-page / cross-refresh persistence
    try {
      const RECENT_KEY = "lms_recent_searches";
      const existing: string[] = JSON.parse(
        localStorage.getItem(RECENT_KEY) || "[]",
      );
      const filtered = existing.filter((s) => s.toLowerCase() !== tLower);
      const updated = [t, ...filtered].slice(0, 7);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {}

    // NEW: Sync to backend if logged in and it's a real course
    if (user?.id && slug) {
      syncCourseView(user.id, slug);
    }
  };

  const runMobileSearch = (term: string) => {
    const t = term.trim();
    if (!t) return;
    addRecentSearch(t);
    setMobilePanel("none");
    setMobileQuery("");
    router.push(`/courses?q=${encodeURIComponent(t)}`);
  };

  // Live course search results
  const results = query.trim()
    ? coursesData
        .filter(
          (c) =>
            c.title.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase()) ||
            c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())),
        )
        .slice(0, 6)
    : [];

  const isPopularMode = query.trim() === "";
  const showDropdown = searchFocused;
  const keyboardItems = isPopularMode
    ? popularSearches.map((p) => p.term)
    : results.map((r) => r.title);

  const handlePopularClick = useCallback((term: string) => {
    setQuery(term);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleResultClick = useCallback(
    (courseTitle: string) => {
      const matched = coursesData.find((c) => c.title === courseTitle);
      addRecentSearch(courseTitle, matched?.slug);
      setQuery("");
      setSearchFocused(false);
      setHighlightedIndex(-1);
      if (matched) {
        router.push(`/courses/${matched.slug}`);
      } else {
        router.push(`/courses?q=${encodeURIComponent(courseTitle)}`);
      }
    },
    [router],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (highlightedIndex >= 0 && highlightedIndex < keyboardItems.length) {
      if (isPopularMode) {
        handlePopularClick(keyboardItems[highlightedIndex]);
      } else {
        handleResultClick(keyboardItems[highlightedIndex]);
      }
    } else {
      setSearchFocused(false);
      addRecentSearch(query.trim());
      router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, keyboardItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setSearchFocused(false);
      setHighlightedIndex(-1);
    }
  };

  // Avatar initials
  const initials = user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "") ||
      user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
      "?"
    : "";

  const avatarUrl = user?.imageUrl;
  const showMyLearning = isLoaded && user && hasEnrollments;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background with blur separated to prevent containing block bug on fixed children */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-purple-300/50 shadow-[0_4px_30px_rgba(124,58,237,0.15)]"
            : "bg-transparent"
        }`}
      />
      {/* Header Content Animation wrapper */}
      <motion.div
        className="relative z-10"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl w-full mx-auto px-6 flex items-center gap-4 h-18 py-4">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 group shrink-0 mr-4 lg:mr-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)]">
              <BookOpen size={18} className="text-white relative z-10" />
              <div className="absolute z-0 inset-0 rounded-xl bg-linear-to-br from-violet-500 to-purple-700 opacity-10 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold gradient-text-purple tracking-tight">
              EduNova
            </span>
          </motion.a>

          {/* Desktop Nav links */}
          {/* Show nav links starting at lg+ so they don't disappear between md and lg. */}
          <div className="hidden lg:flex items-center gap-10 xl:gap-14 shrink-0">
            {navLinks.slice(0, 1).map((link) => {
              const isActive = pathname === link.href;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className={`text-sm transition-colors relative group whitespace-nowrap ${isActive ? "text-white" : "text-gray-300 hover:text-white"}`}
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-violet-500 to-purple-400 transition-all duration-300 rounded-full ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </motion.a>
              );
            })}

            {isLoaded && user && (
              <motion.a
                href="/my-courses"
                className={`text-sm transition-colors relative group whitespace-nowrap font-medium ${
                  pathname === "/my-courses"
                    ? "text-violet-300"
                    : "text-gray-300 hover:text-white"
                }`}
                whileHover={{ y: -1 }}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                My Learning
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-300 ${pathname === "/my-courses" ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </motion.a>
            )}

            {navLinks.slice(1).map((link) => {
              const isActive = pathname === link.href;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className={`text-sm transition-colors relative group whitespace-nowrap ${isActive ? "text-white" : "text-gray-300 hover:text-white"}`}
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-violet-500 to-purple-400 transition-all duration-300 rounded-full ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </motion.a>
              );
            })}
          </div>

          {/* ── Search Bar ── */}
          <div className="flex-1 flex justify-center">
            <div
              ref={wrapperRef}
              className="w-full relative hidden lg:block max-w-90"
            >
              <form onSubmit={handleSubmit}>
                <div
                  className="flex items-center rounded-full transition-all duration-300 overflow-hidden"
                  style={{
                    background: searchFocused
                      ? "rgba(124,58,237,0.12)"
                      : "rgba(255,255,255,0.06)",
                    border: searchFocused
                      ? "1px solid rgba(168,85,247,0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: searchFocused
                      ? "0 0 20px rgba(124,58,237,0.2)"
                      : "none",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setHighlightedIndex(-1);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder="What do you want to learn?"
                    className="flex-1 bg-transparent text-[13px] text-white placeholder-gray-500 px-5 py-2.5 outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      className="mr-2 text-gray-500 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="mr-1.5 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <Search size={14} className="text-white" />
                  </button>
                </div>
              </form>

              {/* ── Premium Dropdown ── */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl z-50 max-h-[60vh] overflow-y-auto"
                    style={{
                      background: "rgba(10,10,22,0.98)",
                      border: "1px solid rgba(124,58,237,0.35)",
                      boxShadow:
                        "0 24px 64px rgba(0,0,0,0.8), 0 0 50px rgba(124,58,237,0.12)",
                      backdropFilter: "blur(24px)",
                    }}
                  >
                    {/* Popular Suggestions */}
                    {isPopularMode && (
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp size={13} className="text-violet-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Trending Topics
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {popularSearches.map((p, idx) => {
                            const col = categoryColors[p.category] ?? {
                              bg: "rgba(124,58,237,0.15)",
                              text: "#c084fc",
                            };
                            const isHighlighted = idx === highlightedIndex;
                            return (
                              <li key={p.term}>
                                <button
                                  type="button"
                                  onMouseEnter={() => setHighlightedIndex(idx)}
                                  onMouseLeave={() => setHighlightedIndex(-1)}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handlePopularClick(p.term);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                                  style={{
                                    background: isHighlighted
                                      ? "rgba(124,58,237,0.18)"
                                      : "transparent",
                                    border: isHighlighted
                                      ? "1px solid rgba(124,58,237,0.3)"
                                      : "1px solid transparent",
                                  }}
                                >
                                  <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                                    style={{ background: col.bg }}
                                  >
                                    {p.emoji}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-semibold leading-none mb-1">
                                      {p.term}
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                      {p.category}
                                    </p>
                                  </div>
                                  <span
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap"
                                    style={{
                                      background: col.bg,
                                      color: col.text,
                                    }}
                                  >
                                    {p.badge}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        <div
                          className="mt-3 pt-3 flex items-center gap-2"
                          style={{
                            borderTop: "1px solid rgba(124,58,237,0.15)",
                          }}
                        >
                          <Sparkles size={11} className="text-violet-500" />
                          <p className="text-gray-600 text-xs">
                            Click a topic to see matching courses instantly
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Live Results */}
                    {!isPopularMode && (
                      <div>
                        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Search size={11} className="text-violet-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                              Results for &ldquo;{query}&rdquo;
                            </span>
                          </div>
                          <span className="text-gray-600 text-xs">
                            {results.length} found
                          </span>
                        </div>
                        {results.length === 0 ? (
                          <div className="px-4 py-6 text-center">
                            <p className="text-gray-500 text-sm">
                              No courses match &ldquo;{query}&rdquo;
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              Try a different keyword or browse all courses
                            </p>
                          </div>
                        ) : (
                          <ul className="px-2 pb-2">
                            {results.map((course, idx) => {
                              const col = categoryColors[course.category] ?? {
                                bg: "rgba(124,58,237,0.15)",
                                text: "#c084fc",
                              };
                              const isHighlighted = idx === highlightedIndex;
                              return (
                                <li key={course.slug}>
                                  <button
                                    type="button"
                                    onMouseEnter={() =>
                                      setHighlightedIndex(idx)
                                    }
                                    onMouseLeave={() => setHighlightedIndex(-1)}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleResultClick(course.title);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                                    style={{
                                      background: isHighlighted
                                        ? "rgba(124,58,237,0.18)"
                                        : "transparent",
                                      border: isHighlighted
                                        ? "1px solid rgba(124,58,237,0.3)"
                                        : "1px solid transparent",
                                    }}
                                  >
                                    <div
                                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                                      style={{
                                        background: col.bg,
                                        border: `1px solid ${col.text}30`,
                                      }}
                                    >
                                      {course.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white text-sm font-semibold leading-snug truncate">
                                        {course.title}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-gray-500 text-xs">
                                          {course.level}
                                        </span>
                                        <span className="text-gray-700 text-xs">
                                          ·
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                          by {course.instructor}
                                        </span>
                                        <span className="text-gray-700 text-xs">
                                          ·
                                        </span>
                                        <span className="text-yellow-400 text-xs">
                                          ★ {course.rating}
                                        </span>
                                      </div>
                                    </div>
                                    <span
                                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                                      style={{
                                        background: col.bg,
                                        color: col.text,
                                      }}
                                    >
                                      {course.category}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        <div
                          className="px-4 py-3 flex items-center justify-between"
                          style={{
                            borderTop: "1px solid rgba(124,58,237,0.15)",
                          }}
                        >
                          <span className="text-gray-600 text-xs">
                            Press Enter to search all
                          </span>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSearchFocused(false);
                              setQuery("");
                              router.push(
                                `/courses?q=${encodeURIComponent(query)}`,
                              );
                            }}
                            className="text-violet-400 hover:text-violet-300 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            View all results <span className="text-xs">→</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Side: Auth ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Not signed in */}
            {isLoaded && !user && (
              <>
                <motion.a
                  href="/auth/sign-in"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-xs font-bold text-gray-300 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </motion.a>
                <motion.a
                  href="/auth/sign-up"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="text-xs font-bold bg-linear-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-[0_0_10px_rgba(124,58,237,0.2)] transition-all duration-300 whitespace-nowrap"
                >
                  Start Free Trial
                </motion.a>
              </>
            )}

            {/* Signed in — Profile Avatar */}
            {isLoaded && user && (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-colors group"
                >
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-violet-500/40 group-hover:border-violet-400/70 transition-colors flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    }}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={initials}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {initials}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm font-medium hidden lg:block">
                    {user.firstName ??
                      user.emailAddresses[0]?.emailAddress.split("@")[0]}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
                      style={{
                        background: "rgba(10,10,22,0.98)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        boxShadow:
                          "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(124,58,237,0.1)",
                        backdropFilter: "blur(24px)",
                      }}
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-white/6">
                        <p className="text-white text-sm font-semibold truncate">
                          {user.fullName ??
                            user.emailAddresses[0]?.emailAddress.split("@")[0]}
                        </p>
                        <p className="text-gray-500 text-xs truncate mt-0.5">
                          {user.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        {profileMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.label}
                              href={item.href}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-violet-500/10 transition-all duration-150"
                            >
                              <Icon
                                size={15}
                                className="text-gray-500 shrink-0"
                              />
                              {item.label}
                            </a>
                          );
                        })}
                      </div>

                      {/* Sign out */}
                      <div className="py-1.5 border-t border-white/6">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            void signOut({ redirectUrl: "/" });
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
                        >
                          <LogOut size={15} className="shrink-0" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Actions (Search first, then Account menu) */}
          <div className="lg:hidden ml-auto flex items-center gap-3">
            <button
              className="text-gray-300 hover:text-white cursor-pointer"
              onClick={() => {
                setMobilePanel("search");
                setFocusMobileSearch(true);
              }}
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            <button
              className="text-gray-300 hover:text-white cursor-pointer"
              onClick={() => {
                setMobilePanel((p) =>
                  p === "main" || p === "account" ? "none" : "main",
                );
              }}
              aria-label="Toggle navigation menu"
            >
              {mobilePanel !== "none" ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Panel */}
      <AnimatePresence>
        {mobilePanel !== "none" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden fixed left-0 right-0 top-18 bottom-0 z-50 overflow-y-auto"
            style={{
              background: "rgba(10,10,22,1)",
              borderTop: "1px solid rgba(124,58,237,0.1)",
              backdropFilter: "blur(24px)",
            }}
          >
            {mobilePanel === "search" ? (
              <div className="px-4 pb-6">
                {/* Search header */}
                <div className="pt-4 flex items-center gap-3">
                  <div
                    className="flex-1 flex items-center rounded-full pl-5 pr-1.5 py-1.5"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(124,58,237,0.25)",
                    }}
                  >
                    <input
                      ref={mobileSearchRef}
                      type="text"
                      value={mobileQuery}
                      onChange={(e) => setMobileQuery(e.target.value)}
                      placeholder="What do you want to learn?"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          runMobileSearch(mobileQuery);
                        }
                      }}
                      className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => runMobileSearch(mobileQuery)}
                      className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 hover:bg-blue-500 transition-colors"
                    >
                      <Search size={18} className="text-white" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobilePanel("none")}
                    className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>

                {/* Recent searches */}
                <div className="mt-5 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    Recent searches
                  </h3>
                  <button
                    type="button"
                    onClick={() => setRecentSearches([])}
                    className="text-sm font-semibold text-violet-400 hover:text-violet-300"
                  >
                    Clear all
                  </button>
                </div>

                <div className="mt-2">
                  {recentSearches.length === 0 ? (
                    <div className="py-3 text-sm text-gray-500">
                      No recent searches
                    </div>
                  ) : (
                    recentSearches.map((term) => (
                      <div
                        key={term}
                        className="flex items-center gap-3 py-3"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <History
                          size={18}
                          className="text-gray-500 shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() => runMobileSearch(term)}
                          className="flex-1 text-left text-sm font-semibold text-gray-300"
                        >
                          {term}
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${term}`}
                          onClick={() => {
                            const lower = term.toLowerCase();
                            setRecentSearches((prev) =>
                              prev.filter((s) => s.toLowerCase() !== lower),
                            );
                          }}
                          className="text-gray-500 hover:text-white p-1 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Trending */}
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-white">
                    Trending on EduNova
                  </h3>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 pb-2">
                  {mobileTrendingChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => runMobileSearch(chip)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:border-violet-500/50 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : mobilePanel === "main" ? (
              // Main menu panel (formerly account but rebranded to main)
              <div className="px-5 pb-6">
                {/* Start content immediately with small top padding */}
                <div className="pt-2" />

                {/* Profile section — only when signed in */}
                {isLoaded && user && (
                  <button
                    onClick={() => setMobilePanel("account")}
                    className="w-full flex items-center gap-3 mt-1 mb-2 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <div
                      className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center border-2 border-violet-500/40"
                      style={{
                        background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                      }}
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={initials}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {initials}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">
                        {user.fullName ??
                          user.emailAddresses[0]?.emailAddress?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-500 shrink-0"
                    />
                  </button>
                )}

                {/* Divider */}
                <div
                  className="h-px w-full"
                  style={{ background: "rgba(124,58,237,0.2)" }}
                />

                {/* Navigation links — always shown */}
                <div className="mt-4 space-y-0">
                  {/* Show 'Courses' first */}
                  {navLinks.slice(0, 1).map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobilePanel("none")}
                      className={`flex items-center gap-3 py-3.5 transition-colors ${
                        pathname === link.href
                          ? "text-violet-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      <BookOpen
                        size={18}
                        className="text-violet-400 shrink-0"
                      />
                      <span className="text-[15px] font-medium">
                        {link.label}
                      </span>
                    </a>
                  ))}

                  {/* Show 'My Learning' below 'Courses' if user is signed in */}
                  {isLoaded && user && (
                    <a
                      href="/my-courses"
                      onClick={() => setMobilePanel("none")}
                      className="flex items-center gap-3 py-3.5 text-gray-300 hover:text-white transition-colors"
                    >
                      <GraduationCap
                        size={18}
                        className="text-violet-400 shrink-0"
                      />
                      <span className="text-[15px] font-medium">
                        My Learning
                      </span>
                    </a>
                  )}

                  {/* Show the rest of the nav links */}
                  {navLinks.slice(1).map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobilePanel("none")}
                      className={`flex items-center gap-3 py-3.5 transition-colors ${
                        pathname === link.href
                          ? "text-violet-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      <BookOpen
                        size={18}
                        className="text-violet-400 shrink-0"
                      />
                      <span className="text-[15px] font-medium">
                        {link.label}
                      </span>
                    </a>
                  ))}
                </div>

                {/* Bottom section */}
                <div
                  className="mt-4 h-px w-full"
                  style={{ background: "rgba(124,58,237,0.2)" }}
                />

                {isLoaded && user ? (
                  /* Log Out */
                  <button
                    type="button"
                    onClick={() => {
                      setMobilePanel("none");
                      void signOut({ redirectUrl: "/" });
                    }}
                    className="w-full flex items-center gap-3 mt-4 py-3.5 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut size={18} className="shrink-0" />
                    <span className="text-[15px] font-medium">Log Out</span>
                  </button>
                ) : (
                  /* Auth buttons for guests */
                  <div className="mt-5 space-y-3">
                    <a
                      href="/auth/sign-in"
                      onClick={() => setMobilePanel("none")}
                      className="block text-center text-white border border-violet-500/40 py-3 rounded-xl font-semibold hover:bg-violet-500/10 transition-colors"
                    >
                      Sign In
                    </a>
                    <a
                      href="/auth/sign-up"
                      onClick={() => setMobilePanel("none")}
                      className="block text-center bg-linear-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                    >
                      Start Free Trial
                    </a>
                  </div>
                )}
              </div>
            ) : (
              // Enhanced Account Panel matching target UI but with Celestial Dark Theme
              <div className="flex flex-col h-full bg-[#0a0a16] text-white">
                {/* Header: Back & X */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-[#0d0d1f]">
                  <button
                    className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-colors"
                    onClick={() => setMobilePanel("main")}
                  >
                    <ArrowLeft size={20} />
                    <span className="text-sm uppercase tracking-widest">
                      Back
                    </span>
                  </button>
                  <button
                    className="text-gray-500 hover:text-white"
                    onClick={() => setMobilePanel("none")}
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="px-6 py-8 overflow-y-auto pb-24">
                  <h2 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase">
                    Your Account
                  </h2>

                  <div className="space-y-2">
                    {[
                      { label: "Profile", href: "/profile", icon: User },
                      {
                        label: "My Purchases",
                        href: "/my-courses",
                        icon: ShoppingBag,
                      },
                      { label: "Settings", href: "/settings", icon: Settings },
                      {
                        label: "Preferred language: English",
                        href: "/settings",
                        icon: Globe,
                        arrow: true,
                      },
                      { label: "Updates", href: "/updates", icon: Bell },
                      {
                        label: "Accomplishments",
                        href: "/profile",
                        icon: Award,
                      },
                      {
                        label: "Help Center",
                        href: "/support",
                        icon: HelpCircle,
                      },
                    ].map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        onClick={() => setMobilePanel("none")}
                        className="flex items-center justify-between py-4 group hover:bg-white/5 rounded-2xl transition-all px-3 border border-transparent hover:border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                            <item.icon
                              size={20}
                              className="text-violet-400 group-hover:text-violet-300 transition-colors"
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                            {item.label}
                          </span>
                        </div>
                        {item.arrow && (
                          <ChevronRight
                            size={18}
                            className="text-gray-600 group-hover:text-gray-400"
                          />
                        )}
                      </a>
                    ))}

                    {/* Log Out */}
                    <button
                      onClick={() => {
                        setMobilePanel("none");
                        void signOut({ redirectUrl: "/" });
                      }}
                      className="w-full flex items-center gap-4 py-5 px-3 group hover:bg-red-500/5 rounded-2xl transition-colors mt-4 border border-transparent hover:border-red-500/10"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <LogOut size={20} className="text-red-400" />
                      </div>
                      <span className="text-sm font-bold text-red-400 group-hover:text-red-300">
                        Log Out
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
