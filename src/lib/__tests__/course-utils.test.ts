import { describe, it, expect } from "vitest";
import { mergeCourse, unionCourses, type BackendCourse } from "../course-utils";
import { coursesData } from "../courses-data";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeBackendCourse(overrides: Partial<BackendCourse> = {}): BackendCourse {
  return {
    id: "test-id-1",
    slug: "react-nextjs-mastery-2026",
    title: "React & Next.js Mastery 2026",
    shortDescription: "Build production-grade apps.",
    category: "Development",
    level: "INTERMEDIATE",
    instructorName: "Chirantan Biswas",
    oneMonthPrice: 14,
    threeMonthPrice: 39,
    sixMonthPrice: 69,
    imageUrl: null,
    ...overrides,
  };
}

// ─── mergeCourse ────────────────────────────────────────────────────────────

describe("mergeCourse", () => {
  it("merges a known slug and picks up static metadata", () => {
    const bc = makeBackendCourse();
    const result = mergeCourse(bc);

    expect(result.slug).toBe("react-nextjs-mastery-2026");
    expect(result.title).toBe("React & Next.js Mastery 2026");
    expect(result.instructor).toBe("Chirantan Biswas");
    // Static data has lessons defined
    expect(result.lessons).toBeGreaterThan(0);
  });

  it("formats BEGINNER level correctly", () => {
    const bc = makeBackendCourse({ level: "BEGINNER" });
    const result = mergeCourse(bc);
    expect(result.level).toBe("Beginner");
  });

  it("formats ADVANCED level correctly", () => {
    const bc = makeBackendCourse({ level: "ADVANCED" });
    const result = mergeCourse(bc);
    expect(result.level).toBe("Advanced");
  });

  it("formats ALL_LEVELS level correctly (underscore handling)", () => {
    const bc = makeBackendCourse({ level: "ALL_LEVELS" });
    const result = mergeCourse(bc);
    expect(result.level).toBe("All Levels");
  });

  it("uses backend imageUrl when provided", () => {
    const bc = makeBackendCourse({ imageUrl: "https://cdn.example.com/img.jpg" });
    const result = mergeCourse(bc);
    expect(result.img).toBe("https://cdn.example.com/img.jpg");
  });

  it("falls back to empty string when no image available and slug unknown", () => {
    const bc = makeBackendCourse({ slug: "unknown-new-course", imageUrl: null });
    const result = mergeCourse(bc);
    expect(result.img).toBe("");
  });

  it("maps prices correctly", () => {
    const bc = makeBackendCourse({ oneMonthPrice: 5, threeMonthPrice: 12, sixMonthPrice: 20 });
    const result = mergeCourse(bc);
    expect(result.price.oneMonth).toBe(5);
    expect(result.price.threeMonth).toBe(12);
    expect(result.price.sixMonth).toBe(20);
  });

  it("marks course as free when oneMonthPrice is 0", () => {
    const bc = makeBackendCourse({
      slug: "gen-ai-essentials-free",
      oneMonthPrice: 0,
      threeMonthPrice: 0,
      sixMonthPrice: 0,
    });
    const result = mergeCourse(bc);
    expect(result.isFree).toBe(true);
  });

  it("marks course as NOT free when oneMonthPrice > 0 and isFree not set", () => {
    const bc = makeBackendCourse({ oneMonthPrice: 14 });
    const result = mergeCourse(bc);
    expect(result.isFree).toBe(false);
  });

  it("uses explicit isFree=true even when price > 0", () => {
    const bc = makeBackendCourse({ oneMonthPrice: 99, isFree: true });
    const result = mergeCourse(bc);
    expect(result.isFree).toBe(true);
  });

  it("provides default skills for unknown slug based on category", () => {
    const bc = makeBackendCourse({ slug: "brand-new-unknown-course", category: "Marketing" });
    const result = mergeCourse(bc);
    expect(result.skills).toContain("SEO");
    expect(result.skills).toContain("Social Media");
  });

  it("provides fallback skills when category is also unknown", () => {
    const bc = makeBackendCourse({ slug: "totally-new", category: "Unknown Category" as any });
    const result = mergeCourse(bc);
    expect(result.skills.length).toBeGreaterThan(0);
  });

  it("uses the category emoji when slug has no local match", () => {
    const bc = makeBackendCourse({ slug: "new-dev-course", category: "Development" });
    const result = mergeCourse(bc);
    expect(result.emoji).toBe("💻");
  });

  it("provides sensible defaults for duration and lessons on unknown slugs", () => {
    const bc = makeBackendCourse({ slug: "completely-unknown-course" });
    const result = mergeCourse(bc);
    expect(result.duration).toBe("12h");
    expect(result.lessons).toBe(24);
    expect(result.rating).toBe(4.8);
    expect(result.students).toBe("New");
  });

  it("uses longDescription from backend when slug has no static match", () => {
    const bc = makeBackendCourse({
      slug: "no-local-match",
      shortDescription: "Short desc from backend.",
    });
    const result = mergeCourse(bc);
    expect(result.longDescription).toBe("Short desc from backend.");
  });
});

// ─── unionCourses ───────────────────────────────────────────────────────────

describe("unionCourses", () => {
  const staticCourses = coursesData.map((c) => ({
    ...c,
    // Normalize to Course shape used by mergeCourse output
  }));

  it("returns all static courses when no backend courses provided", () => {
    const result = unionCourses(staticCourses, []);
    expect(result.length).toBe(staticCourses.length);
  });

  it("adds new backend courses not in static list", () => {
    const backendOnly = mergeCourse(
      makeBackendCourse({ slug: "brand-new-backend-course", title: "New Course" })
    );
    const result = unionCourses(staticCourses, [backendOnly]);
    const found = result.find((c) => c.slug === "brand-new-backend-course");
    expect(found).toBeDefined();
    expect(result.length).toBe(staticCourses.length + 1);
  });

  it("backend version overrides static version for the same slug", () => {
    const updatedTitle = "UPDATED React & Next.js Mastery 2026";
    const backendCourse = mergeCourse(makeBackendCourse({ title: updatedTitle }));
    const result = unionCourses(staticCourses, [backendCourse]);
    const found = result.find((c) => c.slug === "react-nextjs-mastery-2026");
    expect(found).toBeDefined();
    expect(found?.title).toBe(updatedTitle);
  });

  it("does not duplicate courses when backend slug matches static slug", () => {
    const backendCourse = mergeCourse(makeBackendCourse());
    const result = unionCourses(staticCourses, [backendCourse]);
    const matches = result.filter((c) => c.slug === "react-nextjs-mastery-2026");
    expect(matches.length).toBe(1);
  });

  it("handles empty static list gracefully", () => {
    const backendCourse = mergeCourse(makeBackendCourse());
    const result = unionCourses([], [backendCourse]);
    expect(result.length).toBe(1);
    expect(result[0].slug).toBe("react-nextjs-mastery-2026");
  });

  it("handles empty backend list gracefully", () => {
    const result = unionCourses(staticCourses, []);
    expect(result).toEqual(staticCourses);
  });

  it("preserves all static course fields not overridden by backend", () => {
    const backendCourse = mergeCourse(makeBackendCourse({ title: "Modified Title" }));
    const original = staticCourses.find((c) => c.slug === "react-nextjs-mastery-2026")!;
    const result = unionCourses(staticCourses, [backendCourse]);
    const found = result.find((c) => c.slug === "react-nextjs-mastery-2026")!;

    // Original emoji should be preserved (merged in, backend emoji matches static)
    expect(found.emoji).toBeDefined();
    // Price should come from backend course
    expect(found.price.oneMonth).toBe(14);
  });

  it("processes multiple backend courses at once", () => {
    const b1 = mergeCourse(makeBackendCourse({ slug: "new-course-a", title: "Course A" }));
    const b2 = mergeCourse(makeBackendCourse({ slug: "new-course-b", title: "Course B" }));
    const result = unionCourses([], [b1, b2]);
    expect(result.length).toBe(2);
    expect(result.map((c) => c.slug)).toContain("new-course-a");
    expect(result.map((c) => c.slug)).toContain("new-course-b");
  });
});
