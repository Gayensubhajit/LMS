import { backendRequest } from "./backend-client";

export async function syncCourseView(clerkUserId: string, courseSlug: string) {
  try {
    return await backendRequest("/history", {
      method: "POST",
      clerkUserId,
      body: { courseSlug },
    });
  } catch (err) {
    console.error("Failed to sync course view:", err);
    return null;
  }
}

export async function getRecentViews(clerkUserId: string) {
  try {
    const data = await backendRequest<{ items: any[] }>("/history", {
      clerkUserId,
    });
    return data.items || [];
  } catch (err) {
    console.error("Failed to fetch recent views:", err);
    return [];
  }
}
