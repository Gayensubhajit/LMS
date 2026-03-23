"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, Zap, Search, TrendingUp, Sparkles } from "lucide-react";
import { coursesData } from "@/lib/courses-data";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Instructors", href: "/instructors" },
  { label: "Pricing", href: "/pricing" },
];

// Rich popular searches with metadata
const popularSearches = [
  { term: "React & Next.js", emoji: "⚛️", category: "Development", badge: "🔥 Trending" },
  { term: "UI/UX Design", emoji: "🎨", category: "Design", badge: "⭐ Top Rated" },
  { term: "AI & Machine Learning", emoji: "🤖", category: "AI/ML", badge: "🔥 Trending" },
  { term: "Python", emoji: "🐍", category: "AI/ML", badge: "📈 Popular" },
  { term: "Full-Stack Development", emoji: "🔥", category: "Development", badge: "💼 Career Boost" },
  { term: "Figma", emoji: "✏️", category: "Design", badge: "⭐ Top Rated" },
  { term: "No-Code Automation", emoji: "⚙️", category: "AI/ML", badge: "🆕 New" },
  { term: "Product Management", emoji: "📊", category: "Business", badge: "📈 Popular" },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Development: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  Design:      { bg: "rgba(236,72,153,0.15)", text: "#f472b6" },
  "AI/ML":     { bg: "rgba(139,92,246,0.15)", text: "#a78bfa" },
  Business:    { bg: "rgba(245,158,11,0.15)", text: "#fbbf24" },
  Marketing:   { bg: "rgba(16,185,129,0.15)", text: "#34d399" },
};

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [mobileQuery, setMobileQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Live course results
  const results = query.trim()
    ? coursesData.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase()) ||
          c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  const isPopularMode = query.trim() === "";
  const showDropdown = searchFocused;
  // For keyboard navigation flattened list
  const keyboardItems = isPopularMode
    ? popularSearches.map((p) => p.term)
    : results.map((r) => r.title);

  // When a popular chip is clicked → fill query and show results
  const handlePopularClick = useCallback(
    (term: string) => {
      setQuery(term);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    },
    []
  );

  // When a live result is clicked → navigate to the course
  const handleResultClick = useCallback(
    (courseTitle: string) => {
      const matched = coursesData.find((c) => c.title === courseTitle);
      setQuery("");
      setSearchFocused(false);
      setHighlightedIndex(-1);
      if (matched) {
        router.push(`/courses/${matched.slug}`);
      } else {
        router.push(`/courses?q=${encodeURIComponent(courseTitle)}`);
      }
    },
    [router]
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

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-purple-500/20 shadow-[0_4px_30px_rgba(124,58,237,0.15)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-4 h-18 py-4">
        {/* Logo */}
        <motion.a href="/" className="flex items-center gap-2 group flex-shrink-0" whileHover={{ scale: 1.02 }}>
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)]">
            <BookOpen size={18} className="text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-bold gradient-text-purple tracking-tight">EduNova</span>
          <span className="tag-purple hidden sm:inline-flex items-center gap-1"><Zap size={10} /> AI</span>
        </motion.a>

        {/* Desktop Nav links */}
        <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition-colors relative group whitespace-nowrap"
              whileHover={{ y: -1 }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-400 group-hover:w-full transition-all duration-300 rounded-full" />
            </motion.a>
          ))}
        </div>

        {/* ── Search Bar ── */}
        <div ref={wrapperRef} className="flex-1 min-w-0 max-w-xl relative hidden md:block">
          <form onSubmit={handleSubmit}>
            <div
              className="flex items-center rounded-xl transition-all duration-300 overflow-hidden"
              style={{
                background: searchFocused ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.06)",
                border: searchFocused ? "1px solid rgba(168,85,247,0.7)" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: searchFocused ? "0 0 24px rgba(124,58,237,0.25)" : "none",
              }}
            >
              <Search size={16} className="ml-4 flex-shrink-0 transition-colors duration-200"
                style={{ color: searchFocused ? "#c084fc" : "#6b7280" }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setHighlightedIndex(-1); }}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to learn?"
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 px-3 py-2.5 outline-none"
              />
              {query && (
                <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="mr-2 text-gray-500 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              )}
              <button type="submit"
                className="mr-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex-shrink-0 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                Search
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
                className="absolute top-full left-0 right-0 mt-2 rounded-2xl z-50 overflow-hidden"
                style={{
                  background: "rgba(10,10,22,0.98)",
                  border: "1px solid rgba(124,58,237,0.35)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 50px rgba(124,58,237,0.12)",
                  backdropFilter: "blur(24px)",
                }}
              >
                {/* ── Popular Suggestions (empty state) ── */}
                {isPopularMode && (
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={13} className="text-violet-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Trending Topics
                      </span>
                    </div>

                    {/* Rich suggestion rows */}
                    <ul className="space-y-1">
                      {popularSearches.map((p, idx) => {
                        const col = categoryColors[p.category] ?? { bg: "rgba(124,58,237,0.15)", text: "#c084fc" };
                        const isHighlighted = idx === highlightedIndex;
                        return (
                          <li key={p.term}>
                            <button
                              type="button"
                              onMouseEnter={() => setHighlightedIndex(idx)}
                              onMouseLeave={() => setHighlightedIndex(-1)}
                              onMouseDown={(e) => { e.preventDefault(); handlePopularClick(p.term); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                              style={{
                                background: isHighlighted ? "rgba(124,58,237,0.18)" : "transparent",
                                border: isHighlighted ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                              }}
                            >
                              {/* Emoji icon */}
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                                style={{ background: col.bg }}
                              >
                                {p.emoji}
                              </div>

                              {/* Term + category */}
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold leading-none mb-1">{p.term}</p>
                                <p className="text-gray-500 text-xs">{p.category}</p>
                              </div>

                              {/* Badge */}
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
                                style={{ background: col.bg, color: col.text }}
                              >
                                {p.badge}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Footer hint */}
                    <div
                      className="mt-3 pt-3 flex items-center gap-2"
                      style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}
                    >
                      <Sparkles size={11} className="text-violet-500" />
                      <p className="text-gray-600 text-xs">Click a topic to see matching courses instantly</p>
                    </div>
                  </div>
                )}

                {/* ── Live Results ── */}
                {!isPopularMode && (
                  <div>
                    <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Search size={11} className="text-violet-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Results for &ldquo;{query}&rdquo;
                        </span>
                      </div>
                      <span className="text-gray-600 text-xs">{results.length} found</span>
                    </div>

                    {results.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-gray-500 text-sm">No courses match &ldquo;{query}&rdquo;</p>
                        <p className="text-gray-600 text-xs mt-1">Try a different keyword or browse all courses</p>
                      </div>
                    ) : (
                      <ul className="px-2 pb-2">
                        {results.map((course, idx) => {
                          const col = categoryColors[course.category] ?? { bg: "rgba(124,58,237,0.15)", text: "#c084fc" };
                          const isHighlighted = idx === highlightedIndex;
                          return (
                            <li key={course.slug}>
                              <button
                                type="button"
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                onMouseLeave={() => setHighlightedIndex(-1)}
                                onMouseDown={(e) => { e.preventDefault(); handleResultClick(course.title); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                                style={{
                                  background: isHighlighted ? "rgba(124,58,237,0.18)" : "transparent",
                                  border: isHighlighted ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                                }}
                              >
                                {/* Emoji */}
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                  style={{ background: col.bg, border: `1px solid ${col.text}30` }}
                                >
                                  {course.emoji}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-semibold leading-snug truncate">{course.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-gray-500 text-xs">{course.level}</span>
                                    <span className="text-gray-700 text-xs">·</span>
                                    <span className="text-gray-500 text-xs">by {course.instructor}</span>
                                    <span className="text-gray-700 text-xs">·</span>
                                    <span className="text-yellow-400 text-xs">★ {course.rating}</span>
                                  </div>
                                </div>

                                {/* Category pill */}
                                <span
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                                  style={{ background: col.bg, color: col.text }}
                                >
                                  {course.category}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {/* View all footer */}
                    <div
                      className="px-4 py-3 flex items-center justify-between"
                      style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}
                    >
                      <span className="text-gray-600 text-xs">Press Enter to search all</span>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearchFocused(false);
                          setQuery("");
                          router.push(`/courses?q=${encodeURIComponent(query)}`);
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

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <motion.a href="/auth/sign-in" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="text-sm text-gray-300 hover:text-white px-4 py-2 transition-colors">
            Sign In
          </motion.a>
          <motion.a href="/auth/sign-up"
            whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(124,58,237,0.6)" }}
            whileTap={{ scale: 0.96 }}
            className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-300 whitespace-nowrap">
            Start Free Trial
          </motion.a>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-gray-300 hover:text-white ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-purple-500/20 px-6 pb-6 overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-4">
              {/* Mobile search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (mobileQuery.trim()) {
                    router.push(`/courses?q=${encodeURIComponent(mobileQuery)}`);
                    setMobileQuery("");
                    setMobileOpen(false);
                  }
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                <Search size={15} className="text-violet-400 flex-shrink-0" />
                <input
                  type="text"
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
              </form>

              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                  className="text-gray-300 hover:text-white text-base py-1 border-b border-purple-500/10">
                  {link.label}
                </a>
              ))}
              <a href="/auth/sign-up" onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl font-semibold mt-2">
                Start Free Trial
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
