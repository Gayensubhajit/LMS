import { prisma } from "../lib/prisma.js";

type ActivityType = "ENROLLMENT" | "BADGE" | "CERTIFICATE" | "RANK_UP";

export async function logActivity(userId: string, type: ActivityType, content: string, metadata?: any) {
  try {
    const activity = await prisma.activity.create({
      data: {
        userId,
        type,
        content,
        metadata: metadata || {}
      }
    });
    console.log(`[Activity] Recorded: ${content}`);
    return activity;
  } catch (err) {
    console.error(`[Activity] Failed to log activity for ${userId}:`, err);
  }
}
