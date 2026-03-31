import { coursesData, type Course } from "./courses-data";

export type BackendCourse = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  level: string;
  instructorName: string;
  oneMonthPrice: number;
  threeMonthPrice: number;
  sixMonthPrice: number;
  imageUrl: string | null;
  isFree?: boolean;
};

const categoryEmojis: Record<string, string> = {
  Design: "🎨",
  Development: "💻",
  "AI/ML": "🤖",
  Business: "📈",
  Marketing: "🚀",
};

const defaultSkills: Record<string, string[]> = {
  Design: ["UI/UX", "Figma", "Visual Design"],
  Development: ["Programming", "Web", "Software"],
  "AI/ML": ["ML", "Data Science", "AI"],
  Business: ["Strategy", "Management", "Operations"],
  Marketing: ["SEO", "Social Media", "Content"],
};

/**
 * Merges a course record from the backend database with static metadata from courses-data.ts.
 * If the course is not found in the static file, it provides sensible defaults so it
 * can still be displayed on the website.
 */
export function mergeCourse(bc: BackendCourse): Course {
  const local = coursesData.find((c) => c.slug === bc.slug);
  
  // Format level: "BEGINNER" -> "Beginner"
  const formattedLevel = bc.level
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") as Course["level"];

  // Default skills based on category
  const skills = local?.skills || defaultSkills[bc.category] || ["Skill 1", "Skill 2"];

  return {
    slug: bc.slug,
    title: bc.title,
    category: (bc.category as Course["category"]) || "Development",
    instructor: bc.instructorName,
    duration: local?.duration || "12h",
    lessons: local?.lessons || 24,
    students: local?.students || "New",
    rating: local?.rating || 4.8,
    level: formattedLevel || "Beginner",
    emoji: local?.emoji || categoryEmojis[bc.category] || "📘",
    previewVideoUrl: local?.previewVideoUrl || "",
    shortDescription: bc.shortDescription,
    longDescription: local?.longDescription || bc.shortDescription,
    skills: skills,
    isFree: bc.isFree ?? (bc.oneMonthPrice === 0),
    img: bc.imageUrl || local?.img || "",
    price: {
      oneMonth: bc.oneMonthPrice,
      threeMonth: bc.threeMonthPrice,
      sixMonth: bc.sixMonthPrice,
    },
  };
}
