"use client";

export type EnrollmentPlan = "1month" | "3month" | "6month";

export type Enrollment = {
  slug: string;
  title: string;
  plan: EnrollmentPlan;
  amount: number;
  purchasedAt: string;
  progress: number;
};

const STORAGE_KEY = "lms_enrollments_v1";

function readRaw(): Enrollment[] {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as Enrollment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(data: Enrollment[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getEnrollments(): Enrollment[] {
  return readRaw();
}

export function addEnrollment(entry: Omit<Enrollment, "purchasedAt" | "progress">) {
  const current = readRaw();
  const existingIndex = current.findIndex((e) => e.slug === entry.slug);

  const record: Enrollment = {
    ...entry,
    purchasedAt: new Date().toISOString(),
    progress: existingIndex >= 0 ? current[existingIndex].progress : 0,
  };

  if (existingIndex >= 0) {
    current[existingIndex] = record;
  } else {
    current.unshift(record);
  }
  writeRaw(current);
}

export function updateEnrollmentProgress(slug: string, progress: number) {
  const current = readRaw();
  const index = current.findIndex((e) => e.slug === slug);
  if (index < 0) return;
  current[index].progress = Math.max(0, Math.min(100, Math.round(progress)));
  writeRaw(current);
}

