import { NextResponse } from "next/server";
import { coursesData } from "@/lib/courses-data";

type ChatMessage = { 
  role: "system" | "user" | "assistant"; 
  content: string | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
};

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

  // Use the OpenRouter Key from the environment
  const apiKey = process.env.OPENROUTER_API_KEY;
  // Use google/gemma-3-27b-it:free for multimodal support
  const model = payload.model ?? "google/gemma-3-27b-it:free";
  const temperature = payload.temperature ?? 0.5;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not set on the server dashboard (Vercel/Railway)." },
      { status: 500 },
    );
  }

  const messages: ChatMessage[] = payload.messages ?? [];
  
  // Serialize courses for context
  const courseSummary = coursesData.map(c => 
    `- ${c.title} (${c.category}, ${c.level}): by ${c.instructor}. Cost: $${c.price.oneMonth}/mo. ${c.shortDescription}`
  ).join("\n");

  const systemPrompt: ChatMessage = {
    role: "system",
    content: `You are EduNova Intel, a premium AI learning concierge for the EduNova platform. 
    ${payload.userName ? `Greet the user as ${payload.userName}.` : ""}
    Be elite, professional, and intelligent. 
    
    You know everything about the following courses currently on EduNova:
    ${courseSummary}
    
    GUIDELINES:
    1. If a user asks about pricing, mention the monthly rate or the value of long-term bundles.
    2. Recommend specific courses based on their goals (Design vs Development).
    3. Be concise and use a futuristic, intelligent tone.
    4. Format your responses with clear spacing, bullet points, and steps where appropriate.
    5. If asked about an image, analyze it accurately and explain how it relates to the courses if possible.`,
  };

  // Ensure the system prompt is always priority.
  const finalMessages = [systemPrompt, ...messages.filter(m => m.role !== 'system')];

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
      }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error("OpenRouter Response Error:", data);
      const upstreamError = data?.error?.message ?? `OpenRouter request failed (${upstream.status})`;
      return NextResponse.json({ error: upstreamError }, { status: upstream.status });
    }

    const reply = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Assistant Runtime Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message ?? "Neural Synchronization Failure" },
      { status: 500 },
    );
  }
}
