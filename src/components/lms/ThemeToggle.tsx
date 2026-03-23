"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = resolvedTheme ?? theme;
  const isDark = activeTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center rounded-xl border border-purple-500/20 bg-background/40 px-3 py-2 text-gray-300 shadow-[0_0_20px_rgba(124,58,237,0.12)] transition-colors hover:bg-background/60 dark:text-gray-200"
    >
      {/* Avoid icon flicker on first hydration */}
      {mounted ? (isDark ? <Moon size={18} /> : <Sun size={18} />) : null}
    </button>
  );
}

