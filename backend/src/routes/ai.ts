import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const aiRouter = Router();

// POST /ai/chat - Simple context-aware AI tutor
aiRouter.post("/chat", async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ ok: false, error: "Message is required" });
  }

  try {
    const query = message.toLowerCase();
    let response = "";
    let suggestions: string[] = [];

    // Expert Context-Aware Logic
    if (query.includes("roadmap") || query.includes("road map")) {
      response = `### 🚀 Expert AI Engineer Roadmap 2026

To master AI Engineering, I recommend follow this high-velocity path:

1. **Foundations (Month 1):** Master Python for Data Science and Deep Learning math. 
2. **Architecture (Month 2-3):** Deep dive into Transformers, LLM Fine-tuning, and RAG (Retrieval Augmented Generation).
3. **Deployment (Month 4+):** Focus on AI Ops, Vector Databases (Pinecone/Milvus), and scaling autonomous agents.

> **💡 Pro Tip:** Don't just learn theory. Build 3 projects: a RAG-based Chatbot, a Fine-tuned Llama model, and an Autonomous Agent.

Would you like me to detail Level 1?`;
      suggestions = ["Detail Level 1", "Easiest AI projects", "Tools for 2026"];
    } else if (query.includes("rank") || query.includes("leaderboard")) {
      response = `### 🏆 Climbing the Global Leaderboard

The leaderboard is a real-time reflection of your **Learning Velocity**. Here is how to dominate:

*   **Consistency:** Completing one lesson daily gives you a 1.5x Streak Multiplier.
*   **Quiz Mastery:** Perfect scores grant a **Legendary Badge** and 500 bonus XP.
*   **Active Engagement:** Participating in forums and taking high-quality notes also boosts your visibility.

**Current Strategy:** Focus on the 'AI Engineering' course—it has the highest XP yield per lesson.`;
      suggestions = ["Check my rank", "Best XP courses"];
    } else if (query.includes("badge") || query.includes("achievement")) {
      response = `### 🎖️ The Achievement System

Badges on EduNova are more than just icons—they are **Proof of Competence**. 

*   **Speed Demon:** Complete 5 lessons in 24 hours. (Provides +5% XP boost).
*   **Note Titan:** Create 50 high-quality timestamped notes.
*   **Certification:** Completing a course unlocks a **Publicly Shareable Certificate**.

> **Pro Tip:** Sharing your badges on LinkedIn or Twitter increases your Profile Visibility score by 20%!`;
      suggestions = ["Show all badges", "How to get Certified?"];
    } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
      response = "Hello! I am **EduBot**, your Senior Learning Strategist. I'm here to help you architect your career in AI and Development. \n\nWhat high-income skill are we mastering today?";
      suggestions = ["AI Roadmap", "UI/UX Path", "How gamification works?"];
    } else {
      response = `### 🧠 Intelligent Assistant Mode

That's a fascinating area to explore! Within the **EduNova Ecosystem**, you have access to industry-vetted materials on that topic.

**Next Steps:**
*   Check the **Course Catalog** for specialized tracks.
*   Ask me for a **Deep Dive** into specific technical concepts.
*   Check your **Roadmap** to see how this fits into your career.

How can I help you specialize further?`;
      suggestions = ["Course Catalog", "Personal Roadmap"];
    }

    // Small delay to simulate "thinking"
    await new Promise(resolve => setTimeout(resolve, 800));

    return res.json({
      ok: true,
      response,
      suggestions
    });
  } catch (err) {
    console.error("AI Chat error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
