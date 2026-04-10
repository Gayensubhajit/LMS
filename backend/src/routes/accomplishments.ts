import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { getUserFromHeader } from "../lib/auth.js";

export const accomplishmentsRouter = Router();

// GET /accomplishments
// Fetch all certificates for the authenticated user
accomplishmentsRouter.get("/", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
            instructorName: true,
            category: true,
          },
        },
      },
      orderBy: { issuedAt: "desc" },
    });

    return res.status(200).json({
      ok: true,
      certificates,
      profile: {
        isNameVerified: user.isNameVerified,
        verifiedName: user.verifiedName || user.fullName || "Student",
      },
    });
  } catch (err) {
    console.error("Failed to fetch accomplishments:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

const verifyNameSchema = z.object({
  name: z.string().min(2).max(100),
});

// POST /accomplishments/verify-name
// Update the user's verified name for certificates
accomplishmentsRouter.post("/verify-name", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = verifyNameSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid name" });
  }

  const { name } = parsed.data;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isNameVerified: true,
        verifiedName: name,
      },
    });

    return res.status(200).json({
      ok: true,
      user: {
        isNameVerified: updatedUser.isNameVerified,
        verifiedName: updatedUser.verifiedName,
      },
    });
  } catch (err) {
    console.error("Failed to verify name:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// GET /accomplishments/verify/:certId
// Public endpoint to verify a certificate
accomplishmentsRouter.get("/verify/:certId", async (req, res) => {
  const { certId } = req.params;

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: certId },
      include: {
        user: {
          select: {
            fullName: true,
            verifiedName: true,
            isNameVerified: true,
            avatarUrl: true,
          },
        },
        course: {
          select: {
            title: true,
            instructorName: true,
            category: true,
          },
        },
      },
    });

    if (!certificate) {
      return res.status(404).json({ ok: true, found: false, error: "Certificate not found" });
    }

    return res.status(200).json({
      ok: true,
      found: true,
      certificate,
      studentName: certificate.user.verifiedName || certificate.user.fullName || "Student",
    });
  } catch (err) {
    console.error("Certificate verification error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});
