import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { createClerkClient } from "@clerk/backend";

export const usersRouter = Router();

import { getUserFromHeader } from "../lib/auth.js";

// GET /users/me
usersRouter.get("/me", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return; // Error already handled by helper

  return res.status(200).json({ ok: true, item: user });
});

// POST /users/sync  — called by the frontend silently when any signed-in user lands on the site.
// This handles existing Clerk users who signed up before the webhook was configured.
usersRouter.post("/sync", async (req, res) => {
  const clerkUserId = req.header("x-clerk-user-id");
  if (!clerkUserId) {
    return res.status(401).json({ ok: false, error: "Missing x-clerk-user-id header" });
  }

  // If already in DB, nothing to do
  const existing = await prisma.user.findUnique({ where: { clerkUserId }, select: { id: true } });
  if (existing) {
    return res.status(200).json({ ok: true, synced: false, reason: "already_exists" });
  }

  // Fetch user info from Clerk
  try {
    const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
    const clerkUser = await clerk.users.getUser(clerkUserId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return res.status(400).json({ ok: false, error: "No email on Clerk user" });
    }

    const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

    await prisma.user.create({
      data: {
        clerkUserId,
        email,
        fullName,
        avatarUrl: clerkUser.imageUrl || null
      }
    });

    console.log(`>>> Self-synced user to DB: ${email}`);
    return res.status(200).json({ ok: true, synced: true });
  } catch (err) {
    console.error("!!! Self-sync failed:", err);
    return res.status(500).json({ ok: false, error: "Failed to sync user" });
  }
});
