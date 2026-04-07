import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";
import { z } from "zod";

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
