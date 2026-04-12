import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";

export const gamificationRouter = Router();

// GET /gamification/me - Get current user's XP and badges
gamificationRouter.get("/me", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        xp: true,
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!userData) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    // Simple level formula: Level 1 starts at 0 XP, Level 2 at 1000 XP, etc.
    const level = Math.floor(userData.xp / 1000) + 1;
    const currentLevelXp = userData.xp % 1000;
    const nextLevelXp = 1000;
    const progressPercent = Math.min(100, Math.floor((currentLevelXp / nextLevelXp) * 100));

    return res.json({
      ok: true,
      item: {
        xp: userData.xp,
        level,
        progressPercent,
        badges: userData.badges.map(ub => ub.badge)
      }
    });
  } catch (err) {
    console.error("Gamification fetch error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// GET /gamification/badges - List all available badges
gamificationRouter.get("/badges", async (req, res) => {
  try {
    const badges = await prisma.badge.findMany();
    return res.json({ ok: true, badges });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// GET /gamification/leaderboard - Get top users by XP
gamificationRouter.get("/leaderboard", async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 50,
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        xp: true,
        clerkUserId: true
      }
    });

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.fullName || "Student",
      avatar: user.avatarUrl,
      xp: user.xp,
      level: Math.floor(user.xp / 1000) + 1,
      isCurrent: false // Will be determined by frontend based on session
    }));

    return res.json({
      ok: true,
      leaderboard
    });
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
