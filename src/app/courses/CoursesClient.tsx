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
import {
  mergeCourse,
  unionCourses,
  type BackendCourse,
} from "@/lib/course-utils";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/lms/Navbar";
import { formatLocalPrice } from "@/lib/utils/currency";

const montserrat = Montserrat({ subsets: ["latin"] });
import { backendRequest } from "@/lib/backend-client";
import { CourseCardSkeleton } from "@/components/lms/Skeletons";

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

const categoryColors: Record<
  string,
  { text: string; bg: string; lightText: string; lightBg: string }
> = {
  Development: {
    text: "#60a5fa",
    bg: "rgba(59,130,246,0.12)",
    lightText: "#1d4ed8",
    lightBg: "rgba(29,78,216,0.08)",
  },
  Design: {
    text: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    lightText: "#0369a1",
    lightBg: "rgba(3,105,161,0.08)",
  },
  "AI/ML": {
    text: "#818cf8",
    bg: "rgba(129,140,248,0.12)",
    lightText: "#4338ca",
    lightBg: "rgba(67,56,202,0.08)",
  },
  Business: {
    text: "#fbbf24",
    bg: "rgba(245,158,11,0.12)",
    lightText: "#b45309",
    lightBg: "rgba(180,83,9,0.08)",
  },
  Marketing: {
    text: "#34d399",
    bg: "rgba(16,185,129,0.12)",
    lightText: "#047857",
    lightBg: "rgba(4,120,87,0.08)",
  },
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

export default function CoursesClient() {
  const searchParams = useSearchParams();
  // ... (rest of the logic)
nse>
  );
}
