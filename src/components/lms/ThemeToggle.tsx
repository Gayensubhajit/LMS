"use client";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <AnimatedThemeToggler className="opacity-75 hover:opacity-100 transition-opacity border border-black/50 dark:border-white/50 p-1 rounded-full" />
  );
}
