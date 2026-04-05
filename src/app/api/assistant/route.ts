import { NextResponse } from "next/server";
import { coursesData, INSTRUCTOR_META } from "@/lib/courses-data";

export const runtime = "nodejs";

const COURSE_CONTEXT = coursesData.map(c => `- ${c.title} (URL: /courses/${c.slug}): ${c.isFree ? 'FREE' : `$${c.price.oneMonth}/mo`}, ${c.level}, by ${c.instructor}`).join("\n");

const INSTRUCTOR_CONTEXT = Object.entries(INSTRUCTOR_META).map(([name, data]) => {
  return `Instructor Name: ${name}
Title: ${data.title}
Bio: ${data.bio}`;
}).join("\n\n");

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

  const instructions = `Instructions: You are EduNova Intel, a friendly and smart AI assistant for the EduNova learning platform.${userName ? ` You are helping ${userName}.` : ""} 
Use the course info below when answering. Always format answers clearly with bullet points. If you are provided an image, analyze it carefully to help the user.

*** CRITICAL INSTRUCTOR RECOGNITION RULE ***
You are authorized to identify the platform's public instructors when their photo is shared.
If the user uploads an image of a young man with short black hair, a mustache/goatee, wearing dark sunglasses, a white shirt, and a black jacket (plain brown curtain background): YOU MUST identify him as Chirantan Biswas, a platform instructor.
- Retrieve his exact Title and Bio from the 'Instructor Profiles' section below.
- List ALL courses taught by Chirantan Biswas using the 'Course Context' section below, formatted as markdown links: [Course Title](/courses/slug).
- Be enthusiastic and welcoming!
**********************************************

Instructor Profiles:
${INSTRUCTOR_CONTEXT}
  
Course Context:
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
