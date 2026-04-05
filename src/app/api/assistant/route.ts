import { NextResponse } from "next/server";
import { coursesData, INSTRUCTOR_META } from "@/lib/courses-data";

export const runtime = "nodejs";

const COURSE_CONTEXT = coursesData.map(c => `- ${c.title} (URL: /courses/${c.slug}): ${c.isFree ? 'FREE' : `$${c.price.oneMonth}/mo`}, ${c.level}, by ${c.instructor}`).join("\n");

const INSTRUCTOR_CONTEXT = Object.entries(INSTRUCTOR_META).map(([name, data]) => {
  const visualPart = data.visualDescription ? `\nVisual Description: ${data.visualDescription}` : "";
  return `Instructor Name: ${name}\nTitle: ${data.title}\nBio: ${data.bio}${visualPart}`;
}).join("\n\n");

// Build dynamic visual recognition rules for instructors who have real photos
const VISUAL_RECOGNITION_RULES = Object.entries(INSTRUCTOR_META)
  .filter(([, data]) => data.visualDescription)
  .map(([name, data]) => {
    const courses = coursesData
      .filter(c => c.instructor === name)
      .map(c => `  - [${c.title}](/courses/${c.slug})`)
      .join("\n");
    return `- If the photo matches: "${data.visualDescription}" → This is **${name}** (${data.title}).\n  Their courses:\n${courses || "  (No courses yet)"}`;
  })
  .join("\n\n");

type AiMessage = { role: "system" | "user" | "assistant"; content: string | any[] };

export async function POST(req: Request) {
  let body: { messages?: unknown[]; userName?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set OPENROUTER_API_KEY." },
      { status: 500 }
    );
  }

  const userName = typeof body.userName === "string" ? body.userName : null;

  // Normalize incoming messages to support both text and vision (image_url arrays)
  const userMessages: AiMessage[] = [];
  if (Array.isArray(body.messages)) {
    for (const m of body.messages) {
      if (
        m && typeof m === "object" &&
        ("role" in m) && ("content" in m) &&
        (m as {role: string}).role !== "system"
      ) {
        const role = (m as {role: string}).role as "user" | "assistant";
        const content = (m as {content: unknown}).content;
        if (content) {
          userMessages.push({ role, content: content as any });
        }
      }
    }
  }

  const instructions = `You are EduNova Intel, a friendly and smart AI assistant for the EduNova learning platform.${userName ? ` You are helping ${userName}.` : ""}
Always format answers clearly. Use markdown. When listing courses, always format them as markdown links: [Course Title](/courses/slug).

*** INSTRUCTOR PHOTO RECOGNITION ***
You are authorized to identify EduNova's real instructors from photos. When a user uploads a photo, carefully compare the person's appearance against the visual descriptions below and identify which instructor it is. Then enthusiastically share their full name, title, bio, and all their courses as markdown links.

${VISUAL_RECOGNITION_RULES}

If none of the visual descriptions match, say you're not sure which instructor this is but offer to help with something else.
*********************************************

Instructor Profiles:
${INSTRUCTOR_CONTEXT}

Course Catalog (with URLs):
${COURSE_CONTEXT}`;

  if (userMessages.length > 0 && userMessages[0].role === "user") {
    if (typeof userMessages[0].content === "string") {
      userMessages[0].content = `${instructions}\n\nUser Question: ${userMessages[0].content}`;
    } else if (Array.isArray(userMessages[0].content)) {
      // Find the text part of the multimodel array to inject instructions
      const textItem = userMessages[0].content.find((c: any) => c.type === "text");
      if (textItem) {
        textItem.text = `${instructions}\n\nUser Question: ${textItem.text}`;
      } else {
        userMessages[0].content.unshift({ type: "text", text: instructions });
      }
    }
  } else {
    userMessages.unshift({ role: "user", content: instructions });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://edunova-lms.vercel.app",
        "X-OpenRouter-Title": "EduNova AI Assistant",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-nano-12b-v2-vl:free", // Valid Vision-Language Free Tier model
        messages: userMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    let data: any;
    try {
      data = await response.json();
    } catch {
      return NextResponse.json({ error: "Failed to parse OpenRouter response" }, { status: 502 });
    }

    if (!response.ok) {
      const errMsg = data?.error?.message ?? `OpenRouter error ${response.status}`;
      console.error("Open Router Response Error:", JSON.stringify(data));
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const reply = data?.choices?.[0]?.message?.content ?? "";

    if (!reply) {
      return NextResponse.json({ error: "AI returned an empty response." }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "Network error reaching AI service" },
      { status: 502 }
    );
  }
}
