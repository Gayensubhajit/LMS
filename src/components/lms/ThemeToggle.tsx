"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 bg-black/5 hover:bg-black/10 transition-all duration-300"
    >
      <Sun
        size={16}
        className="absolute text-black transition-all duration-500 rotate-0 scale-100 dark:rotate-90 dark:scale-0"
      />
      <Moon
        size={16}
        className="absolute text-white transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100"
      />
    </button>

  );
}
