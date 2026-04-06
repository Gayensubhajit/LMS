/**
 * Lightweight in-memory cache for user lookups.
 * Keyed by clerkUserId. TTL default: 60 seconds.
 * On role change, call invalidate(clerkUserId) immediately.
 */

import type { User } from "@prisma/client";

interface CacheEntry {
  user: User;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

const TTL_MS = 60_000; // 60 seconds

export function getCachedUser(clerkUserId: string): User | null {
  const entry = cache.get(clerkUserId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(clerkUserId);
    return null;
  }
  return entry.user;
}

export function setCachedUser(user: User): void {
  cache.set(user.clerkUserId, {
    user,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function invalidateCachedUser(clerkUserId: string): void {
  cache.delete(clerkUserId);
}

// Periodic cleanup to prevent unbounded memory growth
// Runs every 5 minutes, removes all expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) cache.delete(key);
  }
}, 5 * 60_000).unref(); // .unref() so this timer doesn't keep the process alive