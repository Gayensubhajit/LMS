import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";

export const aiRouter = Router();

aiRouter.post("/chat", async (req: Request, res: Response) => {
  const { lessonId, message, history, transcript: clientTranscript } = req.body;

  if (!lessonId || !message) {
    res.status(400).json({ error: "lessonId and message are required" });
    return;
  }

  try {
    // 1. Fetch lesson context (content contains transcript, and title)
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    }) as any; // Cast as any for quick access to JSON fields

    if (!lesson) {
      res.status(404).json({ error: "Lesson not found" });
      return;
    }

    // Access transcript from the 'content' JSON field
    const transcriptText = lesson.content?.transcript 
      ? JSON.stringify(lesson.content.transcript) 
      : (clientTranscript ? JSON.stringify(clientTranscript) : "No transcript available.");
      
    const courseTitle = lesson.section.course.title;
    const lessonTitle = lesson.title;

    // 2. Format system prompt
    const systemPrompt = `You are "EduNova AI Assistant", a premium and highly competent learning tutor for the course "${courseTitle}".
Current Lesson: "${lessonTitle}"
Lesson Transcript Context: ${transcriptText}

Guidelines:
- Be encouraging, professional, and clear.
- Use the transcript to answer specific questions about what was mentioned in the video.
- If the student asks for a summary, provide key takeaways.
- If the student asks for code explanation based on the lesson, guide them through it.
- Keep responses concise but ultra-helpful.
- Use Markdown for bolding and code blocks.
- If the transcript is missing, try to help based on the course/lesson title.`;

    // 3. Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://edunova-lms.vercel.app", 
        "X-Title": "EduNova Learning Assistant",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          ...(history || []).slice(-4).map((h: any) => ({
            role: h.role, 
            content: h.text
          })),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter Error:", errorData);
      res.status(502).json({ error: "Failed to fetch response from AI provider" });
      return;
    }

    const aiData = await response.json();
    const aiMessage = aiData.choices?.[0]?.message?.content || "I'm sorry, I couldn't formulate a response.";

    res.json({ text: aiMessage });
  } catch (err: any) {
    console.error("AI Assistant Error:", err);
    res.status(500).json({ error: "Internal server error in AI Assistant" });
  }
});
