import type { Request, Response } from "express";
import { prisma } from "./prisma.js";
import { UserRole } from "@prisma/client";
export { UserRole };
import { NextFunction } from "express";
import { getCachedUser, setCachedUser, invalidateCachedUser } from "./userCache.js";

export async function getUserFromHeader(req: Request, res: Response) {
  const clerkUserId = res.locals.clerkUserId;

  if (!clerkUserId) {
    res.status(401).json({
      ok: false,
      error:
        "User is unauthenticated. Ensure Clerk webhook sync is configured.",
    });
    return null;
  }

  // Try cache first (60 second TTL) — dramatically reduces DB queries
  let user = getCachedUser(clerkUserId);
  
  if (!user) {
    // Cache miss — query database and then cache it
    user = await prisma.user.findUnique({
      where: { clerkUserId },
    });
    
    if (user) {
      setCachedUser(user);
    }
  }

  if (!user) {
    res.status(404).json({
      ok: false,
      error: "User not found. Ensure Clerk webhook sync is configured.",
    });
    return null;
  }

  return user;
}

/**
 * Ensures user has at least one of the allowed roles.
 * Super Admin is automatically allowed if Admin is required.
 */
export async function requireRole(
  req: Request,
  res: Response,
  roles: UserRole[]
) {
  const clerkUserId = res.locals.clerkUserId;

  if (!clerkUserId) {
    res.status(401).json({
      ok: false,
      error: "Unauthorized: Missing authentication context.",
    });
    return null;
  }

  // Try cache first (60 second TTL)
  let user = getCachedUser(clerkUserId);

  if (!user) {
    user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (user) {
      setCachedUser(user);
    }
  }

  if (!user) {
    res.status(404).json({
      ok: false,
      error: "User not found in system.",
    });
    return null;
  }

  if (user.role === UserRole.SUPER_ADMIN || roles.includes(user.role)) {
    return user; // ✅ Continues if allowed
  }

  res.status(403).json({
    ok: false,
    error: `Forbidden: This action requires ${roles.join(" or ")} permissions.`,
  });
  return null;
}