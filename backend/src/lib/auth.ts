import type { Request, Response } from "express";
import { prisma } from "./prisma.js";

import { UserRole } from "@prisma/client";
export { UserRole };

export async function getUserFromHeader(req: Request, res: Response) {
  const clerkUserId = req.header("x-clerk-user-id");

  if (!clerkUserId) {
    res.status(401).json({
      ok: false,
      error: "Missing x-clerk-user-id header",
    });
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

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
export async function requireRole(req: Request, res: Response, roles: UserRole[]) {
  const user = await getUserFromHeader(req, res);
  if (!user) return null;

  // SUPER_ADMIN always has full access to any role-protected route
  if (user.role === UserRole.SUPER_ADMIN) return user;

  if (!roles.includes(user.role)) {
    res.status(403).json({
      ok: false,
      error: `Forbidden: Requires role ${roles.join(" or ")}`,
    });
    return null;
  }

  return user;
}
