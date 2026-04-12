import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";
import { logActivity } from "../services/activity.js";

export const gamificationRouter = Router();

// POST /gamification/award-xp - Award XP and optionally a badge, logging activity
gamificationRouter.post("/award-xp", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const { amount, reason, badgeName } = req.body as { amount: number; reason: string; badgeName?: string };
  if (!amount || !reason) {
    return res.status(400).json({ ok: false, error: "amount and reason are required" });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: amount } },
      select: { xp: true, fullName: true, isNameVerified: true, verifiedName: true }
    });

    const displayName = updated.isNameVerified ? updated.verifiedName : (updated.fullName || "A student");
    const prevLevel = Math.floor((updated.xp - amount) / 1000) + 1;
    const newLevel  = Math.floor(updated.xp / 1000) + 1;

    // Log XP gain
    await logActivity(user.id, "RANK_UP", `${displayName} earned ${amount} XP for: ${reason}`, { xp: amount });

    // Level-up notification
    if (newLevel > prevLevel) {
      await logActivity(user.id, "RANK_UP", `🎉 ${displayName} levelled up to Level ${newLevel}!`, { level: newLevel });
    }

    // Badge award
    if (badgeName) {
      const badge = await prisma.badge.findUnique({ where: { name: badgeName } });
      if (badge) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
          create: { userId: user.id, badgeId: badge.id },
          update: {}
        });
        await logActivity(user.id, "BADGE", `🏅 ${displayName} earned the "${badge.name}" badge!`, { badgeIcon: badge.icon });
      }
    }

    return res.json({ ok: true, xp: updated.xp });
  } catch (err) {
    console.error("Award XP error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

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
        clerkUserId: true,
        isNameVerified: true,
        verifiedName: true
      }
    });

    const leaderboard = topUsers.map((user, index) => ({
      id: user.id,
      rank: index + 1,
      name: user.isNameVerified ? user.verifiedName : (user.fullName || "Student"),
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
// GET /gamification/profiles/:id - Get public profile data
gamificationRouter.get("/profiles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        xp: true,
        isNameVerified: true,
        verifiedName: true,
        badges: {
          include: {
            badge: true
          }
        },
        certificates: {
          include: {
            course: {
              select: {
                title: true,
                instructorName: true
              }
            }
          }
        }
      }
    });

    if (!userData) {
      return res.status(404).json({ ok: false, error: "Student not found" });
    }

    const level = Math.floor(userData.xp / 1000) + 1;
    const name = userData.isNameVerified ? userData.verifiedName : (userData.fullName || "Student");

    return res.json({
      ok: true,
      profile: {
        id: userData.id,
        name,
        avatar: userData.avatarUrl,
        xp: userData.xp,
        level,
        badges: userData.badges.map(ub => ({
          ...ub.badge,
          earnedAt: ub.earnedAt
        })),
        certificates: userData.certificates.map(cert => ({
          id: cert.id,
          certificateId: cert.certificateId,
          issuedAt: cert.issuedAt,
          course: cert.course
        }))
      }
    });
  } catch (err) {
    console.error("Public profile fetch error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
// GET /gamification/activity - Get recent global activity
gamificationRouter.get("/activity", async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
            isNameVerified: true,
            verifiedName: true
          }
        }
      }
    });

    const feed = activities.map(act => ({
      id: act.id,
      userId: act.userId,
      userName: act.user.isNameVerified ? act.user.verifiedName : (act.user.fullName || "Student"),
      userAvatar: act.user.avatarUrl,
      type: act.type,
      text: act.content,
      metadata: act.metadata,
      createdAt: act.createdAt
    }));

    return res.json({ ok: true, feed });
  } catch (err) {
    console.error("Activity feed error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
