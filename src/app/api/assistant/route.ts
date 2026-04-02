import { NextResponse } from "next/server";

type TextContent = { type: "text"; text: string };
type ImageContent = { type: "image_url"; image_url: { url: string } };
type ChatMessage = { 
  role: "system" | "user" | "assistant"; 
  content: string | Array<TextContent | ImageContent>;
};

// Inline course knowledge to avoid import issues in edge/server context
const COURSE_KNOWLEDGE = `
Available Courses on EduNova:
**Development:**
- Frontend Fundamentals (Beginner, FREE) by Alex Chen - Covers HTML, CSS, JavaScript from scratch.
- React & Next.js Mastery 2026 (Intermediate) by Alex Chen - $29/mo. Build production-grade apps.
- Full-Stack Bootcamp (Advanced) by Marcus Lee - $49/mo. End-to-end web development.
- TypeScript Masterclass (Intermediate) by Sarah Kim - $29/mo. Type-safe JavaScript.
- Node.js Advanced (Advanced) by Marcus Lee - $39/mo. Backend/API development.

**Design:**
- Complete UI/UX Design Bootcamp (Beginner) by Jessica Willis - $29/mo. Portfolio-ready UI design.
- Mobile App Design with Figma (Intermediate) by Marcus Lee - $29/mo. Mobile interfaces.
- Brand Design & Strategy (All Levels) by Jessica Willis - $29/mo. Brand identity systems.

**AI/ML:**
- Generative AI Essentials (Beginner, FREE) by Dr. Sarah Park - LLMs and AI prompt engineering.
- Machine Learning Fundamentals (Intermediate) by Dr. Sarah Park - $39/mo. Core ML concepts.
- Deep Learning & Neural Networks (Advanced) by Dr. Sarah Park - $49/mo. Advanced AI engineering.

**Business:**
- Product Management Accelerator (All Levels) by Jordan Kim - $35/mo. PM skills and frameworks.
- Entrepreneurship Bootcamp (All Levels) by Alex Chen - $35/mo. Start and scale a business.
`.trim();

export async function POST(req: Request) {
  let payload: {
    messages?: ChatMessage[];
    model?: string;
    temperature?: number;
    userName?: string;
  };
  
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = payload.model ?? "google/gemma-3-27b-it:free";
  const temperature = payload.temperature ?? 0.5;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured in the server environment variables. Please add it to your Vercel/Railway dashboard." },
      { status: 500 },
    );
  }

  const userMessages: ChatMessage[] = payload.messages ?? [];

  const systemPrompt: ChatMessage = {
    role: "system",
    content: `You are EduNova Intel, a smart and professional AI learning assistant for the EduNova online learning platform.${payload.userName ? ` You are speaking with ${payload.userName}.` : ""}

Here is your complete knowledge about courses available on EduNova:
${COURSE_KNOWLEDGE}

RESPONSE GUIDELINES:
- Always use clear formatting with numbered steps, bullet points, or headers when listing things.
- For pricing questions, quote the monthly rate and mention annual savings if relevant.
- Recommend courses specifically based on the user's stated goals.
- Use a helpful, professional, and encouraging tone.
- Keep responses concise but complete.
- If the user shares an image, analyze it and relate it to learning if possible.`,
  };

  const finalMessages = [systemPrompt, ...userMessages.filter(m => m.role !== "system")];

  try {
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://edunova-lms.vercel.app",
        "X-Title": "EduNova AI Assistant",
      },
      body: JSON.stringify({
        model,
        messages: finalMessages,
        temperature,
        max_tokens: 1024,
      }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error("OpenRouter Error:", JSON.stringify(data));
      const errMsg = (data as { error?: { message?: string } })?.error?.message ?? `OpenRouter error (${upstream.status})`;
      return NextResponse.json({ error: errMsg }, { status: upstream.status });
    }

    const reply = (data as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Assistant fetch error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message ?? "Failed to reach OpenRouter" },
      { status: 500 },
    );
  }
}
