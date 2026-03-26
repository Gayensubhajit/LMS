import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getUserFromHeader } from "../lib/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /settings - Fetch current user settings
router.get("/", async (req, res) => {
  try {
    const clerkUserId = getUserFromHeader(req);
    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        fullName: true,
        language: true,
        timezone: true,
        twoFactorEnabled: true,
        newsletterSubscribed: true,
        isNameVerified: true,
        verifiedName: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /settings - Update user settings
router.patch("/", async (req, res) => {
  try {
    const clerkUserId = getUserFromHeader(req);
    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      fullName,
      language,
      timezone,
      twoFactorEnabled,
      newsletterSubscribed,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { clerkUserId },
      data: {
        fullName,
        language,
        timezone,
        twoFactorEnabled,
        newsletterSubscribed,
      },
      select: {
        id: true,
        fullName: true,
        language: true,
        timezone: true,
        twoFactorEnabled: true,
        newsletterSubscribed: true,
      },
    });

    res.json({ ok: true, user: updatedUser });
  } catch (error) {
    console.error("Failed to update settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
