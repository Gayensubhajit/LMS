"use client";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full 
      border border-black/5 dark:border-white/10 
      bg-black/5 hover:bg-black/10 
      dark:bg-white/5 dark:hover:bg-white/10 
      transition-all duration-300 ease-in-out"
    >
      <AnimatedThemeToggler className="opacity-80" />
    </button>
  );
}
