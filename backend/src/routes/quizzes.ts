import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";
import { z } from "zod";
import { env } from "../config/env.js";
import { logActivity } from "../services/activity.js";

export const quizzesRouter = Router();

const submitSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    optionId: z.string(),
  })),
});

// Get quiz for a section
quizzesRouter.get("/section/:sectionId", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const { sectionId } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { sectionId },
      include: {
        questions: {
          orderBy: { position: "asc" },
          include: {
            options: {
              select: {
                id: true,
                text: true,
                // Omit isCorrect to prevent cheating
              }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ ok: false, error: "Quiz not found" });
    }

    // Include the user's latest attempt for UI (e.g. showing previous score)
    const lastAttempt = await prisma.quizAttempt.findFirst({
      where: { userId: user.id, quizId: quiz.id },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ ok: true, item: { ...quiz, lastAttempt } });
  } catch (err) {
    console.error("Quiz fetch error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// Submit quiz answers
quizzesRouter.post("/:quizId/submit", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const { quizId } = req.params;
  const parsed = submitSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid submission data" });
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ ok: false, error: "Quiz not found" });
    }

    let score = 0;
    const results = quiz.questions.map(q => {
      const userAnswer = parsed.data.answers.find(a => a.questionId === q.id);
      const correctOption = q.options.find(o => o.isCorrect);
      const isCorrect = userAnswer?.optionId === correctOption?.id;
      
      if (isCorrect) score++;

      return {
        questionId: q.id,
        isCorrect,
        correctOptionId: correctOption?.id
      };
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score,
        total: quiz.questions.length
      }
    });

    const passedThreshold = 0.8; // 80% passing as planned
    const passed = (score / quiz.questions.length) >= passedThreshold;

    // Award XP based on score
    const xpAwarded = Math.floor((score / quiz.questions.length) * 100);
    if (xpAwarded > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: xpAwarded } }
      });
    }

    // Check for "Quiz Master" badge (100% score)
    let badgeEarned = null;
    if (score === quiz.questions.length && quiz.questions.length > 0) {
      const badge = await prisma.badge.findUnique({ where: { name: "Quiz Master" } });
      if (badge) {
        const alreadyHas = await prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId: user.id, badgeId: badge.id } }
        });
        if (!alreadyHas) {
          badgeEarned = await prisma.userBadge.create({
            data: { userId: user.id, badgeId: badge.id },
            include: { badge: true }
          });
        }
      }
    }

    return res.json({
      ok: true,
      item: {
        attempt,
        results,
        passed,
        passingThreshold: passedThreshold * 100,
        xpAwarded,
        badgeEarned
      }
    });
  } catch (err) {
    console.error("Quiz submission error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
// ── AI-GENERATED QUIZ (DYNAMIC CHALLENGE) ─────────────────────────

const generateSchema = z.object({
  transcript: z.string().min(100),
  lessonId: z.string()
});

quizzesRouter.post("/ai-challenge/generate", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Insufficient context for quiz generation" });
  }

  if (!env.OPENROUTER_API_KEY) {
    return res.status(503).json({ ok: false, error: "AI Service Unavailable" });
  }

  try {
    const prompt = `
      You are an expert technical instructor. Generate a 3-question Multiple Choice Quiz based on this lesson transcript:
      "${parsed.data.transcript.slice(0, 15000)}"

      RULES:
      - 3 questions max.
      - 4 options per question.
      - 1 correct answer.
      - FORMAT: Output ONLY pure JSON in this structure:
      {
        "questions": [
          {
            "id": "q1",
            "text": "Question text?",
            "options": [
              {"id": "o1", "text": "Option 1"},
              {"id": "o2", "text": "Option 2 (Correct)"},
              {"id": "o3", "text": "Option 3"},
              {"id": "o4", "text": "Option 4"}
            ],
            "correctOptionId": "o2"
          }
        ]
      }
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "system", content: "You are a specialized JSON quiz generator." }, { role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const quizData = JSON.parse(data.choices[0].message.content);

    return res.json({ ok: true, quiz: quizData });
  } catch (err) {
    console.error("AI Quiz generation error:", err);
    return res.status(500).json({ ok: false, error: "Failed to generate AI challenge" });
  }
});

quizzesRouter.post("/ai-challenge/submit", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const { score, total, lessonId } = req.body;

  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { title: true } });
    
    // Award XP for passing (80%+)
    const passed = (score / total) >= 0.8;
    const xpAwarded = passed ? 100 : 0;

    if (xpAwarded > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: xpAwarded } }
      });

      // Log to Global Pulse
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: { fullName: true, isNameVerified: true, verifiedName: true }
      });
      const displayName = userData?.isNameVerified ? userData.verifiedName : (userData?.fullName || "Student");

      await logActivity(
        user.id,
        "RANK_UP",
        `🎯 ${displayName} mastered an AI Challenge in "${lesson?.title || 'Lesson'}" and earned 100 XP!`,
        { score, lessonId }
      );
    }

    return res.json({ ok: true, xpAwarded, passed });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Submission failed" });
  }
});
