import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend-client";

/**
 * API Proxy Route
 * Relays requests to the Railway backend to bypass carrier blocking of the .up.railway.app domain.
 */
export async function POST(req: NextRequest) {
  try {
    const { path, options } = await req.json();
    
    if (!path) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    const { method = "GET", body, clerkUserId } = options || {};
    const targetUrl = `${BACKEND_URL}${path}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (clerkUserId) {
      headers["x-clerk-user-id"] = clerkUserId;
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Proxy Error]:", error);
    return NextResponse.json(
      { error: "Proxy connection failed", details: (error as Error).message },
      { status: 502 }
    );
  }
}

// Also support GET for simple health checks if needed
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "/health";
  
  try {
    const response = await fetch(`${BACKEND_URL}${path}`);
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: "Proxy GET failed" }, { status: 502 });
  }
}
