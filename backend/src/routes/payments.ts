import crypto from "node:crypto";
import { EnrollmentStatus, PaymentStatus } from "@prisma/client";
import type { Request, Response } from "express";
import { Router } from "express";
import { z } from "zod";
import Razorpay from "razorpay";
import Stripe from "stripe";
import { env } from "../config/env.js";
import { getUserFromHeader } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

export const paymentsRouter = Router();

const createOrderSchema = z.object({
  enrollmentId: z.string().min(1),
  provider: z.enum(["razorpay", "stripe"]),
  currency: z.string().default("INR"),
  isTrial: z.boolean().optional()
});

function getRazorpayClient() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET
  });
}

function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) return null;
  return new Stripe(env.STRIPE_SECRET_KEY);
}

paymentsRouter.get("/me", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const payments = await prisma.paymentOrder.findMany({
    where: {
      enrollment: {
        userId: user.id
      }
    },
    include: {
      enrollment: {
        include: {
          course: {
            select: {
              title: true,
              slug: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return res.status(200).json({
    ok: true,
    items: payments
  });
});

paymentsRouter.post("/create-order", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid payment payload"
    });
  }

  const { enrollmentId, provider, currency, isTrial } = parsed.data;

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      userId: user.id
    },
    select: {
      id: true,
      amountPaid: true,
      status: true,
      course: { select: { title: true } }
    }
  });

  if (!enrollment) {
    return res.status(404).json({
      ok: false,
      error: "Enrollment not found"
    });
  }

  const USD_TO_INR_RATE = 94;
  let amountInMinor = enrollment.amountPaid * 100;

  try {
    if (provider === "razorpay") {
      // Automatic conversion for INR-only provider
      amountInMinor = Math.round(enrollment.amountPaid * USD_TO_INR_RATE * 100);

      // SPECIAL CASE: Free Trial Authorization
      if (isTrial) {
        amountInMinor = 100; // Charge exactly ₹1 for trial validation
      }

      const razorpay = getRazorpayClient();
      if (!razorpay) {
        return res.status(500).json({
          ok: false,
          error: "Razorpay credentials are not configured"
        });
      }

      const order = await razorpay.orders.create({
        amount: amountInMinor,
        currency,
        receipt: `enr_${enrollment.id.slice(0, 20)}`,
        notes: {
          enrollmentId: enrollment.id,
          courseTitle: enrollment.course.title
        }
      });

      const actualAmountToSave = isTrial ? 1 : enrollment.amountPaid;

      await prisma.paymentOrder.upsert({
        where: { enrollmentId: enrollment.id },
        create: {
          enrollmentId: enrollment.id,
          provider: "razorpay",
          providerOrderId: order.id,
          status: PaymentStatus.CREATED,
          amount: actualAmountToSave,
          currency,
          metadata: order as unknown as object
        },
        update: {
          provider: "razorpay",
          providerOrderId: order.id,
          status: PaymentStatus.CREATED,
          amount: actualAmountToSave,
          currency,
          metadata: order as unknown as object
        }
      });

      return res.status(200).json({
        ok: true,
        provider: "razorpay",
        item: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: env.RAZORPAY_KEY_ID
        }
      });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(500).json({
        ok: false,
        error: "Stripe credentials are not configured"
      });
    }

    const intent = await stripe.paymentIntents.create({
      amount: amountInMinor,
      currency: currency.toLowerCase(),
      metadata: {
        enrollmentId: enrollment.id
      },
      automatic_payment_methods: { enabled: true }
    });

    await prisma.paymentOrder.upsert({
      where: { enrollmentId: enrollment.id },
      create: {
        enrollmentId: enrollment.id,
        provider: "stripe",
        providerOrderId: intent.id,
        status: PaymentStatus.CREATED,
        amount: enrollment.amountPaid,
        currency: intent.currency.toUpperCase(),
        metadata: intent as unknown as object
      },
      update: {
        provider: "stripe",
        providerOrderId: intent.id,
        status: PaymentStatus.CREATED,
        amount: enrollment.amountPaid,
        currency: intent.currency.toUpperCase(),
        metadata: intent as unknown as object
      }
    });

    return res.status(200).json({
      ok: true,
      provider: "stripe",
      item: {
        paymentIntentId: intent.id,
        clientSecret: intent.client_secret,
        amount: intent.amount,
        currency: intent.currency
      }
    });
  } catch (error) {
    console.error("Create payment order failed:", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to create payment order"
    });
  }
});

// ── Verify Razorpay Payment & Activate Enrollment ───────────────────────────
paymentsRouter.post("/verify", async (req, res) => {
  const user = await getUserFromHeader(req, res);
  if (!user) return;

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !enrollmentId) {
    return res.status(400).json({ ok: false, error: "Missing payment verification fields" });
  }

  if (!env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ ok: false, error: "Razorpay secret not configured" });
  }

  // Verify signature - prevents fraudulent activation
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ ok: false, error: "Invalid payment signature" });
  }

  // Find enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, userId: user.id }
  });

  if (!enrollment) {
    return res.status(404).json({ ok: false, error: "Enrollment not found" });
  }

  // Set 30-day access window
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Activate the enrollment
  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: EnrollmentStatus.ACTIVE, expiresAt }
  });

  // Mark payment as succeeded
  await prisma.paymentOrder.updateMany({
    where: { enrollmentId },
    data: {
      providerTxnId: razorpay_payment_id,
      status: PaymentStatus.SUCCESS
    }
  });

  return res.status(200).json({ ok: true, message: "Enrollment activated successfully" });
});

export async function handleRazorpayWebhook(req: Request, res: Response) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) {
    return res.status(500).json({ ok: false, error: "RAZORPAY_WEBHOOK_SECRET is not configured" });
  }

  const signature = req.header("x-razorpay-signature");
  if (!signature) {
    return res.status(400).json({ ok: false, error: "Missing Razorpay signature header" });
  }

  const rawBody = req.body?.toString?.();
  if (!rawBody) {
    return res.status(400).json({ ok: false, error: "Invalid webhook body" });
  }

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return res.status(400).json({ ok: false, error: "Invalid webhook signature" });
  }

  const payload = JSON.parse(rawBody) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          status?: string;
        };
      };
    };
  };

  const providerOrderId = payload.payload?.payment?.entity?.order_id;
  const providerTxnId = payload.payload?.payment?.entity?.id;
  const status = payload.payload?.payment?.entity?.status;

  if (!providerOrderId) {
    return res.status(400).json({ ok: false, error: "Missing provider order id" });
  }

  const payment = await prisma.paymentOrder.findFirst({
    where: { provider: "razorpay", providerOrderId },
    select: { id: true, enrollmentId: true }
  });

  if (!payment) {
    return res.status(404).json({ ok: false, error: "Payment order not found" });
  }

  const paymentStatus =
    status === "captured" ? PaymentStatus.SUCCESS : status === "failed" ? PaymentStatus.FAILED : PaymentStatus.CREATED;

  await prisma.paymentOrder.update({
    where: { id: payment.id },
    data: {
      providerTxnId: providerTxnId ?? undefined,
      status: paymentStatus,
      metadata: payload as unknown as object
    }
  });

  if (paymentStatus === PaymentStatus.SUCCESS) {
    await prisma.enrollment.update({
      where: { id: payment.enrollmentId },
      data: { status: EnrollmentStatus.ACTIVE }
    });
  }

  return res.status(200).json({ ok: true });
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const stripe = getStripeClient();
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ ok: false, error: "Stripe webhook is not configured" });
  }

  const signature = req.header("stripe-signature");
  if (!signature) {
    return res.status(400).json({ ok: false, error: "Missing Stripe signature header" });
  }

  const rawBody = req.body;
  if (!Buffer.isBuffer(rawBody)) {
    return res.status(400).json({ ok: false, error: "Invalid webhook body" });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid Stripe webhook signature" });
  }

  if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const providerOrderId = intent.id;
    const enrollmentId = intent.metadata?.enrollmentId;

    let payment = await prisma.paymentOrder.findFirst({
      where: { provider: "stripe", providerOrderId },
      select: { id: true, enrollmentId: true }
    });

    if (!payment && enrollmentId) {
      payment = await prisma.paymentOrder.findFirst({
        where: { provider: "stripe", enrollmentId },
        select: { id: true, enrollmentId: true }
      });
    }

    if (payment) {
      const nextStatus =
        event.type === "payment_intent.succeeded" ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

      await prisma.paymentOrder.update({
        where: { id: payment.id },
        data: {
          providerTxnId: intent.id,
          status: nextStatus,
          metadata: intent as unknown as object
        }
      });

      if (nextStatus === PaymentStatus.SUCCESS) {
        await prisma.enrollment.update({
          where: { id: payment.enrollmentId },
          data: { status: EnrollmentStatus.ACTIVE }
        });
      }
    }
  }

  return res.status(200).json({ ok: true });
}

