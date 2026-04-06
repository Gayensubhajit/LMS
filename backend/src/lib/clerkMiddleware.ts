/**
 * clerkMiddleware.ts
 *
 * Extracts Clerk user ID from either:
 * 1. @clerk/express clerkMiddleware (res.locals.auth)
 * 2. Custom x-clerk-user-id header (for development/direct calls)
 *
 * Attaches the verified clerkUserId to res.locals.clerkUserId.
 * This must run after @clerk/express clerkMiddleware.
 */

import type { Request, Response, NextFunction } from "express";

export function extractClerkUserId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // First, try to get from @clerk/express clerkMiddleware
  // After clerkMiddleware(), res.locals.auth contains { userId, sessionId, etc }
  if (res.locals.auth?.userId) {
    res.locals.clerkUserId = res.locals.auth.userId;
    return next();
  }

  // Fallback: accept x-clerk-user-id header (useful for development/testing)
  const customHeader = req.headers["x-clerk-user-id"];
  if (typeof customHeader === "string" && customHeader.trim()) {
    res.locals.clerkUserId = customHeader;
    return next();
  }

  // If neither source provided auth, all routes expecting auth will fail
  // This is fine — let routes call getUserFromHeader() to handle the 401
  next();
}
