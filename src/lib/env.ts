/**
 * env.ts
 * Runtime environment variable validation using Zod.
 * Validates and exports typed env variables so that missing config
 * causes a hard fail at startup rather than a cryptic runtime error.
 *
 * Usage:
 *   import { env } from "@/lib/env";
 *   console.log(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
 */

import { z } from "zod";

const envSchema = z.object({
  // ── Clerk ────────────────────────────────────────────────────────────────
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),

  // ── Backend / API ────────────────────────────────────────────────────────
  NEXT_PUBLIC_API_URL: z
    .string()
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
    .optional()
    .or(z.literal("")),

  // ── App ──────────────────────────────────────────────────────────────────
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .optional()
    .or(z.literal("")),

  // ── Vercel Analytics ────────────────────────────────────────────────────
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([key, msgs]) => `  ❌ ${key}: ${(msgs ?? []).join(", ")}`)
      .join("\n");

    // In production this should throw; in dev we warn so local workflow isn't blocked.
    const isProduction = process.env.NODE_ENV === "production";
    const message = `\n[LMS] Environment validation failed:\n${messages}\n`;

    if (isProduction) {
      throw new Error(message);
    } else {
      console.warn(message);
    }

    // Return a partial object to not crash during local development
    return parsed.error.issues.reduce((acc, _) => acc, {}) as Env;
  }

  return parsed.data;
}

export const env = validateEnv();
