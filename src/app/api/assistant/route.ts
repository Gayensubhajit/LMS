import { NextResponse } from "next/server";

import { coursesData } from "@/lib/courses-data";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

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

  const apiKey = process.env.OPENAI_API_KEY;
  const model = payload.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const temperature = payload.temperature ?? 0.5;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set on the server." },
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
    4. If asked about something not on EduNova, answer as a general AI but always bring it back to how EduNova can help.`,
  };

  // Ensure the system prompt is always priority.
  const finalMessages = [systemPrompt, ...messages.filter(m => m.role !== 'system')];

  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: finalMessages,
        temperature,
      }),
    });

    const data: any = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const upstreamError =
        data?.error?.message ?? `OpenAI request failed (${upstream.status})`;
      return NextResponse.json({ error: upstreamError }, { status: 500 });
    }

    const reply =
      data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "";

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error)?.message ?? "Assistant request failed" },
      { status: 500 },
    );
  }
}
