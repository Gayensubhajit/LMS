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

    // Context-aware logic
    if (query.includes("rank") || query.includes("leaderboard") || query.includes("leader board")) {
      response = "To climb the Global Leaderboard, you need to earn XP by completing lessons, passing quizzes, and earning badges. The more active you are, the higher you'll rank!";
      suggestions = ["How do I earn badges?", "What is XP?"];
    } else if (query.includes("badge") || query.includes("achievement") || query.includes("medal")) {
      response = "Badges are earned by reaching milestones! For example, the 'Speed Demon' badge is for completing 5 lessons in one day. You can view all your medals on your Accomplishments page.";
      suggestions = ["Show my medals", "How to get Legendary badges?"];
    } else if (query.includes("xp") || query.includes("points")) {
      response = "XP (Experience Points) is the currency of mastery on EduNova. Every lesson completed grants 100 XP, and a perfect quiz score can give you up to 500 XP!";
      suggestions = ["Check my rank", "Easiest way to get XP"];
    } else if (query.includes("profile") || query.includes("public")) {
      response = "Your public profile is your portfolio! Anyone on the leaderboard can click your name to see your certificates and medals. It's a great way to showcase your skills.";
      suggestions = ["View my profile", "How to hide my profile?"];
    } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
      response = "Hello student! I am EduBot, your personal AI tutor. I can help you find courses, explain gamification, or give you study tips. What's on your mind?";
      suggestions = ["How to start learning?", "Tell me about badges"];
    } else {
      // Simulation of a general AI response
      response = "That's a great question! EduNova is designed to help you master AI and Engineering. Based on your current progress, I recommend focusing on your next lesson to unlock more features.";
      suggestions = ["Tell me about AI roadmap", "How does this platform work?"];
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
