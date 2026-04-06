/**
 * clerkMiddleware.ts
 *
 * Verifies the Clerk JWT from the Authorization header and attaches
 * the verified clerkUserId to res.locals. This must run before any
 * route handler that calls getUserFromHeader or requireRole.
 *
 * Usage in your Express app:
 *   import { clerkAuthMiddleware } from "./clerkMiddleware.js";
 *   app.use(clerkAuthMiddleware);
 *
 * Requirements:
 *   CLERK_SECRET_KEY must be set in your environment.
 *   npm install @clerk/backend
 */

import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";

export async function clerkAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ ok: false, error: "Missing or malformed Authorization header" });
    return;
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error("CLERK_SECRET_KEY is not set");
    }
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload?.sub) {
      res
        .status(401)
        .json({ ok: false, error: "Invalid token: missing subject" });
      return;
    }

    // Attach verified clerkUserId to res.locals — never trust a client header
    res.locals.clerkUserId = payload.sub;
    next();
  } catch (err) {
    console.error("[clerkMiddleware] Token verification failed:", err);
    res.status(401).json({ ok: false, error: "Invalid or expired token" });
  }
}
