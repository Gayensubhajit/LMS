"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, Zap, Search } from "lucide-react";
import { coursesData } from "@/lib/courses-data";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Instructors", href: "/instructors" },
  { label: "Pricing", href: "/pricing" },
];

// Popular/quick-pick suggestions shown when search is focused but empty
const popularSearches = [
  "React & Next.js",
  "UI/UX Design",
  "AI & Machine Learning",
  "Python",
  "Full-Stack Development",
  "Figma",
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filtered course results
  const results = query.trim()
    ? coursesData.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase()) ||
          c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  const showDropdown = searchFocused && (query.trim() === "" || results.length > 0);
  const dropdownItems = query.trim() === "" ? popularSearches : results.map((r) => r.title);

  const handleSelect = useCallback(
    (item: string) => {
      setQuery("");
      setSearchFocused(false);
      setHighlightedIndex(-1);
      if (query.trim() === "") {
        // Popular search picked — pre-fill and go to courses with search hint
        router.push(`/courses?q=${encodeURIComponent(item)}`);
      } else {
        // Match against course title
        const matched = coursesData.find((c) => c.title === item);
        if (matched) {
          router.push(`/courses/${matched.slug}`);
        } else {
          router.push(`/courses?q=${encodeURIComponent(item)}`);
        }
      }
    },
    [query, router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (highlightedIndex >= 0 && highlightedIndex < dropdownItems.length) {
      handleSelect(dropdownItems[highlightedIndex]);
    } else {
      setSearchFocused(false);
      router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
    }
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, dropdownItems.length - 1));
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
        <motion.a
          href="/"
          className="flex items-center gap-2 group flex-shrink-0"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)]">
            <BookOpen size={18} className="text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-bold gradient-text-purple tracking-tight">
            EduNova
          </span>
          <span className="tag-purple hidden sm:inline-flex items-center gap-1">
            <Zap size={10} /> AI
          </span>
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
        <div className="flex-1 min-w-0 max-w-xl relative hidden md:block">
          <form onSubmit={handleSubmit}>
            <div
              className="flex items-center rounded-xl transition-all duration-300 overflow-hidden"
              style={{
                background: searchFocused
                  ? "rgba(124,58,237,0.15)"
                  : "rgba(255,255,255,0.06)",
                border: searchFocused
                  ? "1px solid rgba(124,58,237,0.6)"
                  : "1px solid rgba(255,255,255,0.1)",
                boxShadow: searchFocused ? "0 0 20px rgba(124,58,237,0.2)" : "none",
              }}
            >
              <Search
                size={16}
                className="ml-4 flex-shrink-0 transition-colors duration-200"
                style={{ color: searchFocused ? "#c084fc" : "#6b7280" }}
              />
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
                <button
                  type="button"
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="mr-2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="mr-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex-shrink-0 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
                style={{
                  background: "rgba(13,13,26,0.97)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(124,58,237,0.15)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="px-4 pt-3 pb-1">
                  <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest">
                    {query.trim() === "" ? "Popular searches" : `Results for "${query}"`}
                  </p>
                </div>
                <ul className="py-2">
                  {dropdownItems.map((item, idx) => {
                    const course = query.trim()
                      ? coursesData.find((c) => c.title === item)
                      : null;
                    const isHighlighted = idx === highlightedIndex;
                    return (
                      <li key={item}>
                        <button
                          type="button"
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          onMouseLeave={() => setHighlightedIndex(-1)}
                          onMouseDown={(e) => { e.preventDefault(); handleSelect(item); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                          style={{
                            background: isHighlighted
                              ? "rgba(124,58,237,0.15)"
                              : "transparent",
                          }}
                        >
                          <span
                            className="text-base flex-shrink-0"
                          >
                            {course ? course.emoji : "🔍"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{item}</p>
                            {course && (
                              <p className="text-gray-500 text-xs truncate">
                                {course.category} · {course.level} · by {course.instructor}
                              </p>
                            )}
                          </div>
                          {course && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                              style={{
                                background: "rgba(124,58,237,0.2)",
                                color: "#c084fc",
                                border: "1px solid rgba(124,58,237,0.3)",
                              }}
                            >
                              {course.category}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {query.trim() !== "" && results.length > 0 && (
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}
                  >
                    <span className="text-gray-500 text-xs">
                      {results.length} course{results.length !== 1 ? "s" : ""} found
                    </span>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); router.push(`/courses?q=${encodeURIComponent(query)}`); setSearchFocused(false); setQuery(""); }}
                      className="text-violet-400 hover:text-violet-300 text-xs font-semibold transition-colors"
                    >
                      View all results →
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <motion.a
            href="/auth/sign-in"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="text-sm text-gray-300 hover:text-white px-4 py-2 transition-colors"
          >
            Sign In
          </motion.a>
          <motion.a
            href="/auth/sign-up"
            whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(124,58,237,0.6)" }}
            whileTap={{ scale: 0.96 }}
            className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-300 whitespace-nowrap"
          >
            Start Free Trial
          </motion.a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-300 hover:text-white ml-auto"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
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
                onSubmit={(e) => { e.preventDefault(); if (query.trim()) { router.push(`/courses?q=${encodeURIComponent(query)}`); setQuery(""); setMobileOpen(false); } }}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                <Search size={15} className="text-violet-400 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
              </form>

              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-300 hover:text-white text-base py-1 border-b border-purple-500/10"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/auth/sign-up"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl font-semibold mt-2"
              >
                Start Free Trial
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
