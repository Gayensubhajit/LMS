import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getUserFromHeader } from "../lib/auth.js";

const router = Router();
const prisma = new PrismaClient();

// GET /settings - Fetch current user settings
router.get("/", async (req, res) => {
  try {
    const user = await getUserFromHeader(req, res);
    if (!user) return;

    res.json({
        id: user.id,
        clerkUserId: user.clerkUserId,
        email: user.email,
        fullName: user.fullName,
        language: user.language,
        timezone: user.timezone,
        twoFactorEnabled: user.twoFactorEnabled,
        newsletterSubscribed: user.newsletterSubscribed,
        isNameVerified: user.isNameVerified,
        verifiedName: user.verifiedName,
    });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /settings - Update user settings
router.patch("/", async (req, res) => {
  try {
    const user = await getUserFromHeader(req, res);
    if (!user) return;

    const {
      fullName,
      language,
      timezone,
      twoFactorEnabled,
      newsletterSubscribed,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { clerkUserId: user.clerkUserId },
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
