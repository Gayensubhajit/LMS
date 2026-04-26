import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { getUserFromHeader } from "../lib/auth.js";

export const roadmapsRouter = Router();

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// POST /roadmaps/generate
roadmapsRouter.post("/generate", async (req, res) => {
  const { prompt, title } = req.body;
  const user = await getUserFromHeader(req, res);
  // Keep going only if we haven't already sent a response (getUserFromHeader sends 401/404 if it fails)
  if (res.headersSent) return;

  if (!prompt) {
    return res.status(400).json({ ok: false, error: "Prompt is required" });
  }

  if (!env.OPENROUTER_API_KEY) {
    return res.status(500).json({ ok: false, error: "AI Service configuration missing" });
  }

  try {
    const systemPrompt = `
      You are the EduNova AI Career Architect. Your job is to create a professional learning roadmap based on a user's goal.
      
      OUTPUT FORMAT:
      You MUST output ONLY a valid JSON array of objects. Each object represents a "Step" or "Phase" in the roadmap.
      Do not include any intro or outro text. Just the JSON.

      JSON SCHEMA per object:
      {
        "month": "Step 1",
        "title": "Title of the phase",
        "duration": "e.g., 2-3 Weeks",
        "description": "Brief overview of what will be learned",
        "icon": "A Lucide icon name (e.g., Code2, Database, Network, Rocket, Workflow, Microscope)",
        "gradient": "A tailwind gradient string (e.g., from-blue-500 to-cyan-400)",
        "skills": ["Skill 1", "Skill 2"],
        "topics": ["1. Detail Topic A", "2. Detail Topic B"]
      }

      GUIDELINES:
      - Be ambitious but realistic.
      - Use expert-level technical terminology.
      - For icons, choose from: Code2, Cpu, Database, Network, Rocket, ShieldAlert, Workflow, Microscope, Variable, Table, Eye, Package, Layers, Layout, Search, Globe.
      - For gradients, use premium color pairs matching the EduNova aesthetic (blue, indigo, purple, rose, emerald).
      - Ensure the roadmap covers 6-12 months if appropriate for the goal.
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
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" } // Using JSON mode if supported
      })
    });

    const data: OpenRouterResponse = await response.json();
    let aiContent = data.choices?.[0]?.message?.content || "[]";
    
    // Sometimes models wrap JSON in markdown blocks
    if (aiContent.includes("```json")) {
      aiContent = aiContent.split("```json")[1].split("```")[0].trim();
    } else if (aiContent.includes("```")) {
      aiContent = aiContent.split("```")[1].split("```")[0].trim();
    }

    const roadmapJson = JSON.parse(aiContent);
    // If the model returned an object with a key like "roadmap", extract it
    const finalRoadmap = Array.isArray(roadmapJson) ? roadmapJson : (roadmapJson.roadmap || roadmapJson.steps || []);

    let savedId = null;
    if (user && finalRoadmap.length > 0) {
      const saved = await prisma.userRoadmap.create({
        data: {
          userId: user.id,
          title: title || "My Custom Roadmap",
          prompt,
          roadmap: finalRoadmap
        }
      });
      savedId = saved.id;
    }

    return res.json({
      ok: true,
      roadmap: finalRoadmap,
      id: savedId
    });
  } catch (err) {
    console.error("Roadmap generation failed:", err);
    return res.status(500).json({ ok: false, error: "Failed to generate roadmap" });
  }
});

// GET /roadmaps/my-roadmaps
roadmapsRouter.get("/my-roadmaps", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return; // Already handled

  const items = await prisma.userRoadmap.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ ok: true, items });
});

// GET /roadmaps/:id
roadmapsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const item = await prisma.userRoadmap.findUnique({
    where: { id }
  });

  if (!item) {
    return res.status(404).json({ ok: false, error: "Roadmap not found" });
  }

  return res.json({ ok: true, item });
});

// DELETE /roadmaps/:id
roadmapsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const existing = await prisma.userRoadmap.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return res.status(403).json({ ok: false, error: "Access denied" });
  }

  await prisma.userRoadmap.delete({ where: { id } });
  return res.json({ ok: true });
});
