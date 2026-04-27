import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";
import { z } from "zod";
import { logger } from "../lib/logger.js";

export const notesRouter = Router();

const noteSchema = z.object({
  lessonId: z.string(),
  content: z.string().min(1),
  timestamp: z.number().int().min(0),
});

// Get notes for a lesson
notesRouter.get("/lesson/:lessonId", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const { lessonId } = req.params;

  try {
    const notes = await prisma.lessonNote.findMany({
      where: {
        userId: user.id,
        lessonId,
      },
      orderBy: { timestamp: "asc" },
    });

    return res.json({ ok: true, items: notes });
  } catch (err) {
    logger.error("[Notes] Failed to fetch notes", { lessonId, error: err instanceof Error ? err.message : String(err) });
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// Create a new note
notesRouter.post("/", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = noteSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid note data" });
  }

  try {
    const note = await prisma.lessonNote.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    });

    return res.json({ ok: true, item: note });
  } catch (err) {
    logger.error("[Notes] Failed to create note", { error: err instanceof Error ? err.message : String(err) });
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// Delete a note
notesRouter.delete("/:id", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const { id } = req.params;

  try {
    const note = await prisma.lessonNote.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({ ok: false, error: "Note not found" });
    }

    if (note.userId !== user.id) {
      return res.status(403).json({ ok: false, error: "Unauthorized access" });
    }

    await prisma.lessonNote.delete({
      where: { id },
    });

    return res.json({ ok: true, message: "Note deleted successfully" });
  } catch (err) {
    logger.error("[Notes] Failed to delete note", { id, error: err instanceof Error ? err.message : String(err) });
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
