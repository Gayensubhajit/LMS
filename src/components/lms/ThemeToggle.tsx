"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme("dark")}
      className="inline-flex items-center justify-center rounded-xl border border-purple-500/20 bg-background/40 px-3 py-2 text-foreground/80 shadow-[0_0_20px_rgba(124,58,237,0.12)] transition-colors hover:bg-background/60"
    >
      <Moon size={18} />
    </button>
  );
}
