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
  LayoutDashboard,
} from "lucide-react";
import { coursesData } from "@/lib/courses-data";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import { syncCourseView } from "@/lib/history-api";
import ThemeToggle from "@/components/lms/ThemeToggle";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Instructors", href: "/instructors" },
  { label: "Pricing", href: "/pricing" },
];

const popularSearches = [
  { term: "React & Next.js", emoji: "⚛️", category: "Development", badge: "🔥 Trending" },
  { term: "UI/UX Design", emoji: "🎨", category: "Design", badge: "⭐ Top Rated" },
  { term: "AI & Machine Learning", emoji: "🤖", category: "AI/ML", badge: "🔥 Trending" },
];

const mobileTrendingChips = [
  "artificial intelligence", "python", "microsoft excel", "ai", "excel", "machine learning", "project management", "data analytics"
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
  const [mobilePanel, setMobilePanel] = useState<"none" | "main" | "account" | "search">("none");
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [mobileQuery, setMobileQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [hasEnrollments, setHasEnrollments] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [focusMobileSearch, setFocusMobileSearch] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const RECENT_SEARCHES_KEY = "lms_recent_searches";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentSearches(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (mobilePanel !== "search" || !focusMobileSearch) return;
    requestAnimationFrame(() => { mobileSearchRef.current?.focus(); });
    setFocusMobileSearch(false);
  }, [mobilePanel, focusMobileSearch]);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    backendRequest<{ ok: boolean; synced: boolean }>("/users/sync", {
      method: "POST",
      clerkUserId: user.id,
    }).catch(() => {});

    backendRequest<{ ok: boolean; items: any[] }>("/dashboard/my-courses", {
      clerkUserId: user.id,
    })
      .then((res) => setHasEnrollments(res.items.length > 0))
      .catch(() => setHasEnrollments(false));

    backendRequest<{ ok: boolean; item: { role: string } }>("/users/me", {
      clerkUserId: user.id,
    })
      .then((res) => {
        if (res.ok) setUserRole(res.item.role);
      })
      .catch(() => setUserRole(null));
  }, [isLoaded, user?.id]);

  const addRecentSearch = (term: string, slug?: string) => {
    const t = term.trim();
    if (!t) return;
    const tLower = t.toLowerCase();
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== tLower);
      return [t, ...filtered].slice(0, 7);
    });
    if (user?.id && slug) { syncCourseView(user.id, slug); }
  };

  const runMobileSearch = (term: string) => {
    const t = term.trim();
    if (!t) return;
    addRecentSearch(t);
    setMobilePanel("none");
    setMobileQuery("");
    router.push(`/courses?q=${encodeURIComponent(t)}`);
  };

  const results = query.trim()
    ? coursesData.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
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
      if (matched) { router.push(`/courses/${matched.slug}`); }
      else { router.push(`/courses?q=${encodeURIComponent(courseTitle)}`); }
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (highlightedIndex >= 0 && highlightedIndex < keyboardItems.length) {
      if (isPopularMode) { handlePopularClick(keyboardItems[highlightedIndex]); }
      else { handleResultClick(keyboardItems[highlightedIndex]); }
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

  const initials = user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "") ||
      user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "?"
    : "";

  const avatarUrl = user?.imageUrl;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div 
        className={`absolute inset-0 transition-all duration-700 border-b ${
          scrolled 
            ? "bg-white/60 dark:bg-[#050510]/60 backdrop-blur-2xl border-black/5 dark:border-white/5 opacity-100" 
            : "bg-transparent border-transparent opacity-0"
        }`} 
      />
      <motion.div className="relative z-10" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="max-w-7xl w-full mx-auto px-6 flex items-center gap-4 h-18 py-4">
          <motion.a href="/" className="flex items-center gap-2 group shrink-0 mr-8" whileHover={{ scale: 1.02 }}>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
              <GraduationCap className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black tracking-tighter drop-shadow-sm text-black dark:text-white">
              Edu<span className="text-blue-600 dark:text-blue-400">Nova</span>
            </span>
          </motion.a>

          <div className="hidden lg:flex items-center gap-8 shrink-0">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold transition-all relative group whitespace-nowrap ${
                  pathname === link.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-900 dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          <div className="flex-1 hidden lg:flex justify-center">
            <div ref={wrapperRef} className="w-full relative max-w-90">
              <form onSubmit={handleSubmit}>
                <div
                   className="flex items-center rounded-full transition-all duration-300 overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500/30"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setHighlightedIndex(-1); }}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search courses..."
                    className="flex-1 bg-transparent text-[13px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 px-5 py-2.5 outline-none"
                  />
                  <button type="submit" className="mr-1.5 w-8 h-8 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity">
                    <Search size={14} className="text-white dark:text-slate-900" />
                  </button>
                </div>
              </form>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 rounded-2xl z-50 bg-white dark:bg-[#0a0a16] border border-black/10 dark:border-white/10 backdrop-blur-3xl p-4 shadow-2xl">
                    {isPopularMode ? (
                      <ul>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-3 ml-2">Trending Topics</p>
                        {popularSearches.map((p) => (
                          <li key={p.term}>
                            <button onClick={() => handlePopularClick(p.term)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left group">
                              <span className="text-lg">{p.emoji}</span>
                              <div className="flex-1">
                                <p className="text-slate-900 dark:text-white text-sm font-semibold">{p.term}</p>
                                <p className="text-slate-500 dark:text-gray-500 text-xs">{p.category}</p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {results.map((course) => (
                          <li key={course.slug}>
                            <button onClick={() => handleResultClick(course.title)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left group">
                              <span className="text-xl">{course.emoji}</span>
                              <div className="flex-1">
                                <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">{course.title}</p>
                                <p className="text-slate-500 dark:text-gray-500 text-xs">{course.level} · by {course.instructor}</p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {isLoaded && !user && (
              <>
                <ThemeToggle />
                <a href="/auth/sign-in" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Sign in</a>
                <a href="/auth/sign-up" className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-full hover:opacity-85 transition-opacity">Get started</a>
              </>
            )}
            {isLoaded && user && (
              <div ref={profileRef} className="relative">
                <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-colors group">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-violet-500/40 flex items-center justify-center bg-violet-600">
                    {avatarUrl ? <img src={avatarUrl} alt={initials} className="w-full h-full object-cover" /> : <span className="text-white text-sm font-bold">{initials}</span>}
                  </div>
                  <ChevronRight size={14} className={`text-gray-500 transition-transform ${profileOpen ? "rotate-90" : ""}`} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-[#0a0a16] border border-black/10 dark:border-white/10 p-2 shadow-2xl">
                      <div className="px-4 py-2 mb-2 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                        <span className="text-xs font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">Theme</span>
                        <ThemeToggle />
                      </div>
                      {(userRole === "ADMIN" || userRole === "INSTRUCTOR" || userRole === "SUPER_ADMIN") && (
                        <a href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-violet-600 dark:text-violet-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors border-b border-black/5 dark:border-white/5 bg-violet-600/5 mb-2">
                          <LayoutDashboard size={15} /> Admin Dashboard
                        </a>
                      )}
                      {profileMenuItems.map((item) => (
                        <a key={item.label} href={item.href} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
                          <item.icon size={15} className="text-slate-400 dark:text-gray-500" /> {item.label}
                        </a>
                      ))}
                      <button onClick={() => { setProfileOpen(false); void signOut({ redirectUrl: "/" }); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors border-t border-black/5 dark:border-white/5 mt-2">
                        <LogOut size={15} /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="lg:hidden ml-auto flex items-center gap-4">
            <button onClick={() => { setMobilePanel("search"); setFocusMobileSearch(true); }}>
              <Search size={22} className="text-slate-900 dark:text-gray-300" />
            </button>
            <button onClick={() => setMobilePanel(mobilePanel !== "none" ? "none" : "main")}>
              {mobilePanel === "none" ? (
                <Menu size={22} className="text-slate-900 dark:text-gray-300" />
              ) : (
                <X size={22} className="text-slate-900 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobilePanel !== "none" && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="lg:hidden fixed inset-0 top-18 bg-white dark:bg-[#050510] z-50 overflow-y-auto px-6 py-8"
          >
            {mobilePanel === "search" ? (
              <div>
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3">
                  <input autoFocus ref={mobileSearchRef} type="text" value={mobileQuery} onChange={(e) => setMobileQuery(e.target.value)} placeholder="Search courses..." className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white" onKeyDown={(e) => e.key === "Enter" && runMobileSearch(mobileQuery)} />
                  <button onClick={() => runMobileSearch(mobileQuery)} className="text-violet-600 dark:text-violet-400"><Search size={20} /></button>
                </div>
                <div className="mt-8">
                  <p className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-4">Trending</p>
                  <div className="flex flex-wrap gap-2">
                    {mobileTrendingChips.map(c => <button key={c} onClick={() => runMobileSearch(c)} className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-700 dark:text-gray-300">{c}</button>)}
                  </div>
                </div>
                <button onClick={() => setMobilePanel("none")} className="mt-10 text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px] w-full text-center">Close Search</button>
              </div>
            ) : mobilePanel === "main" ? (
              <div className="space-y-6">
                {isLoaded && user && (
                  <button onClick={() => setMobilePanel("account")} className="w-full flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-4 rounded-3xl text-left transition-colors hover:bg-slate-100 dark:hover:bg-white/10 group">
                    <div className="w-12 h-12 rounded-full bg-violet-600 border-2 border-violet-400/30 overflow-hidden shrink-0">
                      {avatarUrl ? <img src={avatarUrl} alt={initials} className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-white font-bold">{initials}</span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white font-black truncate">{user.fullName}</p>
                      <p className="text-slate-500 dark:text-gray-500 text-xs truncate">View Account Details</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400 dark:text-gray-600 group-hover:text-slate-600 dark:group-hover:text-white" />
                  </button>
                )}

                <div className="space-y-1">
                  {navLinks.map(l => (
                    <a key={l.label} href={l.href} className="block py-3.5 text-lg font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/5 flex items-center justify-between group">
                      {l.label} <ChevronRight size={18} className="text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                  {isLoaded && user && (
                    <a href="/my-courses" className="block py-3.5 text-lg font-black text-violet-600 dark:text-violet-400 border-b border-slate-200 dark:border-white/5 flex items-center justify-between group">
                      My Learning <ChevronRight size={18} className="text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                  {isLoaded && user && (userRole === "ADMIN" || userRole === "INSTRUCTOR" || userRole === "SUPER_ADMIN") && (
                    <a href="/admin" className="block py-3.5 text-lg font-black text-amber-600 dark:text-amber-500 border-b border-slate-200 dark:border-white/5 flex items-center justify-between group">
                      Admin Dashboard <ChevronRight size={18} className="text-amber-600 dark:text-amber-500 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>

                {isLoaded && user ? (
                  <button onClick={() => void signOut({ redirectUrl: "/" })} className="w-full py-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-10">
                    <LogOut size={16} /> Sign Out
                  </button>
                ) : (
                  <div className="space-y-4 pt-10">
                    <a href="/auth/sign-in" className="block w-full py-4 bg-violet-600 text-white rounded-2xl font-black uppercase tracking-widest text-center">Sign In</a>
                    <a href="/auth/sign-up" className="block w-full py-4 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-center">Create Free Account</a>
                  </div>
                )}
                
                {isLoaded && !user && (
                   <div className="flex items-center justify-between py-4 border-t border-slate-200 dark:border-white/5 mt-8 bg-slate-50 dark:bg-white/5 px-4 rounded-2xl">
                     <span className="text-sm font-black text-slate-700 dark:text-gray-300 uppercase tracking-widest">Theme Switch</span>
                     <ThemeToggle />
                   </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <button onClick={() => setMobilePanel("main")} className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-6 font-bold uppercase tracking-widest text-[10px]"><ArrowLeft size={14} /> Back to Menu</button>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight">Your Account</h3>
                <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-white/5 mb-4 bg-slate-50 dark:bg-white/5 px-4 rounded-2xl">
                  <span className="text-sm font-black text-slate-700 dark:text-gray-300 uppercase tracking-widest">Switch Theme</span>
                  <ThemeToggle />
                </div>
                {[
                  { label: "Profile", href: "/profile", icon: User },
                  { label: "My Purchases", href: "/my-courses", icon: ShoppingBag },
                  { label: "Settings", href: "/settings", icon: Settings },
                  { label: "Updates", href: "/updates", icon: Bell },
                  { label: "Accomplishments", href: "/profile", icon: Award },
                  { label: "Help Center", href: "/support", icon: HelpCircle },
                ].map((item) => (
                  <a key={item.label} href={item.href} className="flex items-center gap-4 py-4 border-b border-slate-200 dark:border-white/5 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-violet-600 transition-colors"><item.icon size={20} className="text-slate-400 dark:text-gray-400 group-hover:text-white" /></div>
                    <span className="text-sm font-bold text-slate-700 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white">{item.label}</span>
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
