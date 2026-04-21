/**
 * format.ts
 * Shared utility helpers for formatting values in the LMS UI.
 *
 * All functions are pure (no side effects) and easily unit-testable.
 *
 * Usage:
 *   import { formatCurrency, formatDate, truncate, formatStudentCount } from "@/lib/utils/format";
 */

// ─── Currency ────────────────────────────────────────────────────────────────

/**
 * Format an INR price for display.
 * @example formatCurrency(2099) → "₹2,099"
 * @example formatCurrency(0)    → "Free"
 */
export function formatCurrency(amountInr: number): string {
  if (amountInr === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInr);
}

/**
 * Format a USD price for display (backend amounts).
 * @example formatCurrencyUSD(14.5) → "$14.50"
 */
export function formatCurrencyUSD(amountUsd: number): string {
  if (amountUsd === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountUsd);
}

// ─── Date / Time ─────────────────────────────────────────────────────────────

/**
 * Format an ISO date string or Date to a human-readable short date.
 * @example formatDate("2026-04-21T10:00:00Z") → "Apr 21, 2026"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Return a relative time string (e.g. "2 days ago", "just now").
 * Falls back to formatDate if the date is older than 30 days.
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  const diffMs = Date.now() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return formatDate(d);
}

// ─── Text ────────────────────────────────────────────────────────────────────

/**
 * Truncate a string to `maxLength` characters, appending an ellipsis if trimmed.
 * @example truncate("Hello world", 5) → "Hello…"
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Capitalise the first letter of a string.
 * @example capitalise("hello") → "Hello"
 */
export function capitalise(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// ─── Numbers / Stats ─────────────────────────────────────────────────────────

/**
 * Format a large number with a K/M suffix.
 * @example formatCount(1200)   → "1.2K"
 * @example formatCount(23100)  → "23.1K"
 * @example formatCount(1200000) → "1.2M"
 * @example formatCount(42)     → "42"
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

/**
 * Parse a student-count string from coursesData ("23.1K", "99.9K") to a number.
 * Returns 0 if the string cannot be parsed.
 * @example parseStudentCount("23.1K") → 23100
 * @example parseStudentCount("New")   → 0
 */
export function parseStudentCount(raw: string): number {
  if (!raw) return 0;
  const clean = raw.replace(/[,\s]/g, "");
  if (clean.endsWith("M")) return parseFloat(clean) * 1_000_000;
  if (clean.endsWith("K")) return parseFloat(clean) * 1_000;
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
}

/**
 * Format a percentage as a string with a specific number of decimal places.
 * @example formatPercent(0.756)  → "75.6%"
 * @example formatPercent(1)      → "100.0%"
 */
export function formatPercent(ratio: number, decimals = 1): string {
  return `${(ratio * 100).toFixed(decimals)}%`;
}
