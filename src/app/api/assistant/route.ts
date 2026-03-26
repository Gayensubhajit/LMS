import { NextResponse } from "next/server";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let payload: {
    messages?: ChatMessage[];
    model?: string;
    temperature?: number;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = payload.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const temperature = payload.temperature ?? 0.7;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not set on the server. Set it in your environment variables to enable the assistant.",
      },
      { status: 500 },
    );
  }

  const messages: ChatMessage[] = payload.messages ?? [];
  const systemPrompt: ChatMessage = {
    role: "system",
    content:
      "You are EduNova, a helpful AI learning assistant. Be clear, accurate, and concise. When helpful, provide step-by-step guidance, examples, and recommended next actions for the user.",
  };

  // Ensure the system prompt is at the front.
  const finalMessages =
    messages.length === 0 || messages[0]?.role !== "system"
      ? [systemPrompt, ...messages]
      : messages;

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
