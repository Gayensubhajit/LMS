import type { Request, Response } from "express";
import { prisma } from "./prisma.js";

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
