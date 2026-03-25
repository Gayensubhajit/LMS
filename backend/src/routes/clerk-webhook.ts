import type { Request, Response } from "express";
import { Webhook } from "svix";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

type ClerkWebhookPayload = {
  data?: {
    id?: string;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
    email_addresses?: Array<{ email_address?: string }>;
  };
  type?: string;
};

function getPrimaryEmail(payload: ClerkWebhookPayload): string | null {
  const email = payload.data?.email_addresses?.[0]?.email_address;
  return email ?? null;
}

function getFullName(payload: ClerkWebhookPayload): string | null {
  const first = payload.data?.first_name ?? "";
  const last = payload.data?.last_name ?? "";
  const fullName = `${first} ${last}`.trim();
  return fullName.length > 0 ? fullName : null;
}

export async function handleClerkWebhook(req: Request, res: Response) {
  console.log(">>> Received Clerk Webhook");
  if (!env.CLERK_WEBHOOK_SECRET) {
    console.error("!!! CLERK_WEBHOOK_SECRET missing");
    return res.status(500).json({
      ok: false,
      error: "CLERK_WEBHOOK_SECRET is not configured"
    });
  }

  const svixId = req.header("svix-id");
  const svixTimestamp = req.header("svix-timestamp");
  const svixSignature = req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("!!! Missing Svix headers", { svixId, svixTimestamp, svixSignature });
    return res.status(400).json({
      ok: false,
      error: "Missing Svix headers"
    });
  }

  const rawBody = req.body?.toString?.();
  if (!rawBody) {
    return res.status(400).json({
      ok: false,
      error: "Invalid webhook body"
    });
  }

  let payload: ClerkWebhookPayload;
  try {
    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
    payload = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature
    }) as ClerkWebhookPayload;
    console.log(">>> Webhook verified successfully, event type:", payload.type);
  } catch (err) {
    console.error("!!! Webhook signature verification failed:", err);
    return res.status(400).json({
      ok: false,
      error: "Webhook signature verification failed"
    });
  }

  const eventType = payload.type;
  const clerkUserId = payload.data?.id;
  if (!eventType || !clerkUserId) {
    return res.status(400).json({
      ok: false,
      error: "Missing event type or clerk user id"
    });
  }

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = getPrimaryEmail(payload);
      if (!email) {
        return res.status(400).json({
          ok: false,
          error: "Email is required for user sync"
        });
      }

      await prisma.user.upsert({
        where: { clerkUserId },
        create: {
          clerkUserId,
          email,
          fullName: getFullName(payload),
          avatarUrl: payload.data?.image_url ?? null
        },
        update: {
          email,
          fullName: getFullName(payload),
          avatarUrl: payload.data?.image_url ?? null
        }
      });
    } else if (eventType === "user.deleted") {
      await prisma.user.deleteMany({
        where: { clerkUserId }
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Clerk webhook sync failed:", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to sync user"
    });
  }
}

