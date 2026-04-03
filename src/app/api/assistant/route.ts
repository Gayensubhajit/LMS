import { NextResponse } from "next/server";

export const runtime = "nodejs";

const COURSE_CONTEXT = `EduNova courses:
- Frontend Fundamentals: FREE, Beginner, by Alex Chen (HTML/CSS/JS)
- React & Next.js Mastery: $29/mo, Intermediate, by Alex Chen 
- Full-Stack Bootcamp: $49/mo, Advanced, by Marcus Lee
- TypeScript Masterclass: $29/mo, Intermediate, by Sarah Kim
- Node.js Advanced: $39/mo, Advanced, by Marcus Lee
- UI/UX Design Bootcamp: $29/mo, Beginner, by Jessica Willis
- Mobile App Design with Figma: $29/mo, Intermediate, by Marcus Lee
- Brand Design & Strategy: $29/mo, All Levels, by Jessica Willis
- Generative AI Essentials: FREE, Beginner, by Dr. Sarah Park
- Machine Learning Fundamentals: $39/mo, Intermediate, by Dr. Sarah Park
- Deep Learning & Neural Networks: $49/mo, Advanced, by Dr. Sarah Park
- Product Management Accelerator: $35/mo, All Levels, by Jordan Kim
- Entrepreneurship Bootcamp: $35/mo, All Levels, by Alex Chen`;

type SimpleMessage = { role: "system" | "user" | "assistant"; content: string };

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

  // Normalize incoming messages
  const userMessages: SimpleMessage[] = [];
  if (Array.isArray(body.messages)) {
    for (const m of body.messages) {
      if (
        m && typeof m === "object" &&
        ("role" in m) && ("content" in m) &&
        (m as {role: string}).role !== "system"
      ) {
        const role = (m as {role: string}).role;
        const content = (m as {content: unknown}).content;
        if (role === "user" || role === "assistant") {
          const text = typeof content === "string"
            ? content
            : Array.isArray(content)
              ? (content as {type: string; text?: string}[])
                  .filter(c => c.type === "text")
                  .map(c => c.text ?? "")
                  .join(" ")
              : "";
          if (text) userMessages.push({ role: role as "user" | "assistant", content: text });
        }
      }
    }
  }

  // Some free models on OpenRouter (especially Llama and Gemma) fail with a 400 error 
  // if you use the 'system' role. To fix this, we'll put the instructions into the 
  // very first 'user' message instead.
  const instructions = `Instructions: You are EduNova Intel, a friendly and smart AI assistant for the EduNova learning platform.${userName ? ` You are helping ${userName}.` : ""} 
Use the course info below when answering. Always format answers clearly with bullet points.
  
Course Context:
${COURSE_CONTEXT}`;

  if (userMessages.length > 0 && userMessages[0].role === "user") {
    userMessages[0].content = `${instructions}\n\nUser Question: ${userMessages[0].content}`;
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
        model: "google/gemma-3-12b-it:free",
        messages: userMessages, // No system role used here to avoid 400 errors
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
