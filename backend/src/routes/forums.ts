import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";
import { z } from "zod";

export const forumsRouter = Router();

const threadSchema = z.object({
  courseId: z.string(),
  lessonId: z.string().optional(),
  title: z.string().min(3).max(200),
  content: z.string().min(1),
});

const commentSchema = z.object({
  threadId: z.string(),
  parentId: z.string().optional(),
  content: z.string().min(1),
});

const voteSchema = z.object({
  threadId: z.string().optional(),
  commentId: z.string().optional(),
  type: z.enum(["UPVOTE", "DOWNVOTE"]),
});

// Get threads for a course or lesson
forumsRouter.get("/", async (req, res) => {
  const { courseId, lessonId } = req.query;

  try {
    const threads = await prisma.forumThread.findMany({
      where: {
        ...(courseId ? { courseId: courseId as string } : {}),
        ...(lessonId ? { lessonId: lessonId as string } : {}),
      },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        _count: {
          select: { comments: true, votes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ ok: true, items: threads });
  } catch (err) {
    console.error("Forum threads fetch error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// Get single thread with comments
forumsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const thread = await prisma.forumThread.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
            votes: true,
          },
          orderBy: { createdAt: "asc" },
        },
        votes: true,
      },
    });

    if (!thread) {
      return res.status(404).json({ ok: false, error: "Thread not found" });
    }

    return res.json({ ok: true, item: thread });
  } catch (err) {
    console.error("Forum thread fetch error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// Create thread
forumsRouter.post("/threads", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = threadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid thread data" });
  }

  try {
    const thread = await prisma.forumThread.create({
      data: {
        ...parsed.data,
        authorId: user.id,
      },
    });

    return res.json({ ok: true, item: thread });
  } catch (err) {
    console.error("Thread creation error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// Create comment
forumsRouter.post("/comments", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid comment data" });
  }

  try {
    const comment = await prisma.forumComment.create({
      data: {
        ...parsed.data,
        authorId: user.id,
      },
    });

    return res.json({ ok: true, item: comment });
  } catch (err) {
    console.error("Comment creation error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// Vote
forumsRouter.post("/votes", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = voteSchema.safeParse(req.body);
  if (!parsed.success || (!parsed.data.threadId && !parsed.data.commentId)) {
    return res.status(400).json({ ok: false, error: "Invalid vote data" });
  }

  const { threadId, commentId, type } = parsed.data;

  try {
    // Note: This relies on the composite unique index added to the schema
    const vote = await (prisma as any).forumVote.upsert({
      where: {
        userId_threadId_commentId: {
          userId: user.id,
          threadId: threadId || null,
          commentId: commentId || null,
        },
      },
      update: { type },
      create: {
        userId: user.id,
        threadId,
        commentId,
        type,
      },
    });

    return res.json({ ok: true, item: vote });
  } catch (err) {
    console.error("Vote error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
