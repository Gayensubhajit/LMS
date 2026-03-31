import { backendRequest } from "./backend-client";

export interface UserSettings {
  id: string;
  clerkUserId: string;
  email: string;
  fullName: string | null;
  language: string;
  timezone: string | null;
  twoFactorEnabled: boolean;
  newsletterSubscribed: boolean;
  isNameVerified: boolean;
  verifiedName: string | null;
}

export async function getUserSettings(clerkUserId: string): Promise<UserSettings> {
  return backendRequest<UserSettings>("/settings", {
    clerkUserId,
  });
}

export async function updateUserSettings(
  clerkUserId: string,
  updates: Partial<UserSettings>
): Promise<{ ok: boolean; user: Partial<UserSettings> }> {
  return backendRequest("/settings", {
    method: "PATCH",
    clerkUserId,
    body: JSON.stringify(updates),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
