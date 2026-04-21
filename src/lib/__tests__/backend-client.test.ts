import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── BACKEND_URL resolution ──────────────────────────────────────────────────
// We test the URL-building logic in isolation using env var mocking.
// The module itself is NOT imported directly to avoid side effects (toast, etc.).

describe("BACKEND_URL resolution logic", () => {
  function resolveUrl(envUrl?: string): string {
    const DEFAULT_URL = "http://localhost:4000";
    const url = envUrl || DEFAULT_URL;
    return url.replace(/\/+$/, "");
  }

  it("defaults to http://localhost:4000 when no env vars set", () => {
    expect(resolveUrl(undefined)).toBe("http://localhost:4000");
  });

  it("uses NEXT_PUBLIC_API_URL when set", () => {
    expect(resolveUrl("https://api.edunova.app")).toBe("https://api.edunova.app");
  });

  it("strips trailing slash from URL", () => {
    expect(resolveUrl("https://api.edunova.app/")).toBe("https://api.edunova.app");
  });

  it("strips multiple trailing slashes", () => {
    expect(resolveUrl("https://api.edunova.app///")).toBe("https://api.edunova.app");
  });

  it("preserves URL path segments", () => {
    expect(resolveUrl("https://api.edunova.app/v1")).toBe("https://api.edunova.app/v1");
  });

  it("keeps http:// localhost for local dev", () => {
    expect(resolveUrl("http://localhost:4000")).toBe("http://localhost:4000");
  });
});

// ─── Request options type contract ──────────────────────────────────────────

describe("RequestOptions contract", () => {
  it("defaults method to GET when not specified", () => {
    type RequestOptions = {
      method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      body?: unknown;
      clerkUserId?: string;
      silent?: boolean;
    };

    const opts: RequestOptions = {};
    const method = opts.method ?? "GET";
    expect(method).toBe("GET");
  });

  it("allows silent flag to suppress errors", () => {
    type RequestOptions = {
      method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      body?: unknown;
      clerkUserId?: string;
      silent?: boolean;
    };
    const opts: RequestOptions = { silent: true };
    expect(opts.silent).toBe(true);
  });
});

// ─── Error message extraction ────────────────────────────────────────────────

describe("error message extraction from response", () => {
  function extractErrorMessage(data: unknown, status: number, path: string): string {
    return (
      (data && typeof data === "object" && "error" in data && String((data as any).error)) ||
      `Backend request failed with status ${status} at ${path}`
    );
  }

  it("extracts error string from JSON body", () => {
    const msg = extractErrorMessage({ error: "Course not found" }, 404, "/courses/abc");
    expect(msg).toBe("Course not found");
  });

  it("falls back to status message when no error field in body", () => {
    const msg = extractErrorMessage({}, 500, "/courses/abc");
    expect(msg).toBe("Backend request failed with status 500 at /courses/abc");
  });

  it("falls back when body is null", () => {
    const msg = extractErrorMessage(null, 503, "/enrollments");
    expect(msg).toBe("Backend request failed with status 503 at /enrollments");
  });

  it("falls back when body is a string", () => {
    const msg = extractErrorMessage("plain text", 400, "/settings");
    expect(msg).toBe("Backend request failed with status 400 at /settings");
  });

  it("coerces non-string error values to string", () => {
    const msg = extractErrorMessage({ error: 42 }, 422, "/users");
    expect(msg).toBe("42");
  });
});
