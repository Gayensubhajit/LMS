import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatCurrencyUSD,
  formatDate,
  formatRelativeTime,
  truncate,
  capitalise,
  formatCount,
  parseStudentCount,
  formatPercent,
} from "../utils/format";

// ─── formatCurrency ──────────────────────────────────────────────────────────

describe("formatCurrency (INR)", () => {
  it('returns "Free" for 0', () => {
    expect(formatCurrency(0)).toBe("Free");
  });

  it("formats 2099 as ₹2,099", () => {
    expect(formatCurrency(2099)).toContain("2,099");
    expect(formatCurrency(2099)).toContain("₹");
  });

  it("formats 9 as ₹9", () => {
    expect(formatCurrency(9)).toContain("9");
    expect(formatCurrency(9)).toContain("₹");
  });

  it("formats large amounts correctly", () => {
    expect(formatCurrency(19999)).toContain("19,999");
  });
});

// ─── formatCurrencyUSD ───────────────────────────────────────────────────────

describe("formatCurrencyUSD", () => {
  it('returns "Free" for 0', () => {
    expect(formatCurrencyUSD(0)).toBe("Free");
  });

  it("formats 14.5 as $14.50", () => {
    expect(formatCurrencyUSD(14.5)).toBe("$14.50");
  });

  it("formats 212.75 as $212.75", () => {
    expect(formatCurrencyUSD(212.75)).toBe("$212.75");
  });
});

// ─── formatDate ──────────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("formats an ISO string to a readable date", () => {
    expect(formatDate("2026-04-21T10:00:00Z")).toMatch(/Apr\s+21,?\s+2026/);
  });

  it("accepts a Date object", () => {
    const d = new Date("2025-01-15T00:00:00Z");
    expect(formatDate(d)).toMatch(/Jan\s+15,?\s+2025/);
  });

  it('returns "Invalid date" for bad input', () => {
    expect(formatDate("not-a-date")).toBe("Invalid date");
  });
});

// ─── formatRelativeTime ──────────────────────────────────────────────────────

describe("formatRelativeTime", () => {
  it('returns "just now" for very recent dates', () => {
    expect(formatRelativeTime(new Date())).toBe("just now");
  });

  it("returns minutes ago for recent dates", () => {
    const d = new Date(Date.now() - 5 * 60 * 1000); // 5 min ago
    expect(formatRelativeTime(d)).toBe("5 minutes ago");
  });

  it("returns singular for 1 minute", () => {
    const d = new Date(Date.now() - 1 * 60 * 1000);
    expect(formatRelativeTime(d)).toBe("1 minute ago");
  });

  it("returns hours ago for dates within 24h", () => {
    const d = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
    expect(formatRelativeTime(d)).toBe("3 hours ago");
  });

  it("returns days ago for dates within 30 days", () => {
    const d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    expect(formatRelativeTime(d)).toBe("7 days ago");
  });

  it("falls back to formatDate for dates older than 30 days", () => {
    const d = new Date("2024-01-01T00:00:00Z");
    expect(formatRelativeTime(d)).toMatch(/Jan/);
  });

  it('returns "Invalid date" for bad input', () => {
    expect(formatRelativeTime("bad")).toBe("Invalid date");
  });
});

// ─── truncate ────────────────────────────────────────────────────────────────

describe("truncate", () => {
  it("returns the original string when shorter than maxLength", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });

  it("returns the original string when exactly maxLength", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("truncates and appends ellipsis", () => {
    expect(truncate("Hello world", 5)).toBe("Hello…");
  });

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });

  it("truncates long course descriptions", () => {
    const desc = "Build production-grade apps with React and Next.js from scratch.";
    const result = truncate(desc, 30);
    expect(result.length).toBeLessThanOrEqual(31); // 30 chars + ellipsis
    expect(result.endsWith("…")).toBe(true);
  });
});

// ─── capitalise ──────────────────────────────────────────────────────────────

describe("capitalise", () => {
  it("capitalises the first letter", () => {
    expect(capitalise("hello")).toBe("Hello");
  });

  it("lowercases the rest of the string", () => {
    expect(capitalise("HELLO WORLD")).toBe("Hello world");
  });

  it("handles empty string", () => {
    expect(capitalise("")).toBe("");
  });
});

// ─── formatCount ─────────────────────────────────────────────────────────────

describe("formatCount", () => {
  it("returns plain number for small values", () => {
    expect(formatCount(42)).toBe("42");
  });

  it("formats 1200 as 1.2K", () => {
    expect(formatCount(1200)).toBe("1.2K");
  });

  it("formats 10000 as 10K (no decimal)", () => {
    expect(formatCount(10000)).toBe("10K");
  });

  it("formats 23100 as 23.1K", () => {
    expect(formatCount(23100)).toBe("23.1K");
  });

  it("formats 1200000 as 1.2M", () => {
    expect(formatCount(1200000)).toBe("1.2M");
  });

  it("formats 1000000 as 1M", () => {
    expect(formatCount(1000000)).toBe("1M");
  });
});

// ─── parseStudentCount ───────────────────────────────────────────────────────

describe("parseStudentCount", () => {
  it('parses "23.1K" to 23100', () => {
    expect(parseStudentCount("23.1K")).toBe(23100);
  });

  it('parses "99.9K" to 99900', () => {
    expect(parseStudentCount("99.9K")).toBe(99900);
  });

  it('parses "1.2M" to 1200000', () => {
    expect(parseStudentCount("1.2M")).toBe(1200000);
  });

  it('returns 0 for "New"', () => {
    expect(parseStudentCount("New")).toBe(0);
  });

  it("returns 0 for empty string", () => {
    expect(parseStudentCount("")).toBe(0);
  });

  it("parses plain numbers", () => {
    expect(parseStudentCount("42")).toBe(42);
  });
});

// ─── formatPercent ───────────────────────────────────────────────────────────

describe("formatPercent", () => {
  it("formats 0.756 as 75.6%", () => {
    expect(formatPercent(0.756)).toBe("75.6%");
  });

  it("formats 1 as 100.0%", () => {
    expect(formatPercent(1)).toBe("100.0%");
  });

  it("formats 0 as 0.0%", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });

  it("respects custom decimal places", () => {
    expect(formatPercent(0.5, 0)).toBe("50%");
    expect(formatPercent(0.3333, 2)).toBe("33.33%");
  });
});
