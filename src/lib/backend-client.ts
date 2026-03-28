"use client";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  clerkUserId?: string;
};

export async function backendRequest<T>(path: string, options: RequestOptions = {}) {
  const { method = "GET", body, clerkUserId } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (clerkUserId) {
    headers["x-clerk-user-id"] = clerkUserId;
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    keepalive: true, // Ensure request finishes if page navigates
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage =
      (data && typeof data === "object" && "error" in data && String(data.error)) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

