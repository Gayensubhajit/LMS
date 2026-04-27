import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";
import { env } from "../config/env.js";

export const aiRouter = Router();

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// POST /ai/chat - Real-time AI tutor powered by OpenRouter
aiRouter.post("/chat", async (req, res) => {
  const { message, context, lessonTitle, courseTitle, transcript } = req.body;

  if (!message) {
    return res.status(400).json({ ok: false, error: "Message is required" });
  }

  // If no API key, fallback to local expert logic
  if (!env.OPENROUTER_API_KEY) {
    return handleMockResponse(message, res);
  }

  try {
    const systemPrompt = `
      You are EduBot, the Senior Learning Strategist and AI Tutor at EduNova.
      EduNova is a prestige LMS platform specializing in AI, UI/UX, and Engineering.
      
      Your Personality:
      - Expert, professional, and highly structured.
      - Uses Markdown (headers, bold, lists) to organize complex information.
      - Encouraging but "no bakwas" (direct and accurate).
      - Always provides "Pro Tips" for career growth.

      ACTIVE LEARNING CONTEXT:
      - Course: ${courseTitle || 'General Platform'}
      - Lesson: ${lessonTitle || 'N/A'}
      - Transcript Snippet: ${transcript || 'No transcript available for this context.'}
      
      Your Task:
      - If the user is on a lesson, prioritize the TRANSCRIPT above to answer questions.
      - Answer technical questions with extreme precision.
      - If the user asks for a summary, use the transcript to provide a high-value recap.
      - Encourage earning XP and climbing the Global Leaderboard.
      - Keep responses within a reasonable window size but detailed enough to be expert-level.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://edunova-lms.vercel.app",
        "X-Title": "EduNova LMS"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // High-velocity expert model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data: OpenRouterResponse = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm currently processing that. Could you try rephrasing?";

    // Extract potential suggestions (simple regex or AI could do this better, but for now we'll imply them)
    // For now, we'll return dynamic suggestions if the AI returns them in a specific format, 
    // or just return the default high-value ones.
    const suggestions = [
      "Detail Level 1",
      "How to get XP?",
      "View AI Roadmap"
    ];

    return res.json({
      ok: true,
      response: aiResponse,
      suggestions
    });
  } catch (err) {
    logger.error("[AI] OpenRouter API error", { error: err instanceof Error ? err.message : String(err) });
    return handleMockResponse(message, res);
  }
});

// Fallback logic for when API is down or Key is missing
function handleMockResponse(message: string, res: any) {
  const query = message.toLowerCase();
  let response = "";
  let suggestions: string[] = ["AI Roadmap", "How to earn XP?"];

  if (query.includes("roadmap")) {
    response = "### 🚀 Expert AI Engineer Roadmap\n\n1. Foundations\n2. Architecture\n3. Deployment\n\n(Note: AI Service is currently in offline mode)";
  } else {
    response = "I'm currently in high-stability mode. Please ask about the AI Roadmap or Leaderboard rankings for traditional guidance!";
  }

  return res.json({ ok: true, response, suggestions });
}
