// No "use client" - this file is intentionally isomorphic (works on server AND client).
// Server Components (like /courses/[slug]/page.tsx) import BACKEND_URL from here,
// so adding "use client" would make BACKEND_URL undefined on the server and break all course pages.

const IS_PROD = typeof window !== "undefined" && (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1");
const DEFAULT_URL = "http://localhost:4000";

export const BACKEND_URL = (() => {
  let url = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_URL;
  // Strip trailing slashes to avoid double slashes in fetch
  return url.replace(/\/+$/, "");
})();

if (typeof window !== "undefined" && IS_PROD && (BACKEND_URL.includes("localhost") || BACKEND_URL.includes("127.0.0.1"))) {
  console.warn("⚠️ [LMS] API is falling back to localhost in production! Ensure NEXT_PUBLIC_API_URL is set in Vercel.");
}

import { toast } from "sonner";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  clerkUserId?: string;
  silent?: boolean; // Don't show toast on error
};

export async function backendRequest<T>(path: string, options: RequestOptions = {}) {
  const { method = "GET", body, clerkUserId, silent = false } = options;

  // If in the browser, use the Vercel Proxy to bypass carrier blocking of Railway
  if (typeof window !== "undefined") {
    try {
      const proxyResponse = await fetch("/api/backend-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, options }),
      });

      const data = await proxyResponse.json().catch(() => ({}));
      if (!proxyResponse.ok) {
        const errorMessage =
          (data && typeof data === "object" && "error" in data && String(data.error)) ||
          `Proxy request failed with status ${proxyResponse.status}`;
          
        if (!silent) {
          toast.error("Request Failed", {
            description: errorMessage
          });
        }
        throw new Error(errorMessage);
      }
      return data as T;
    } catch (err) {
      if (!silent) {
        toast.error("Network Error", {
          description: "Cannot connect to the backend server. Please check your connection."
        });
      }
      throw err;
    }
  }

  // Server-side: Call the backend directly (faster, no carrier blocking on server)
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
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage =
      (data && typeof data === "object" && "error" in data && String(data.error)) ||
      `Backend request failed with status ${response.status} at ${BACKEND_URL}${path}`;
    throw new Error(errorMessage);
  }

  return data as T;
}
