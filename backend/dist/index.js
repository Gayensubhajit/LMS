import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { handleClerkWebhook } from "./routes/clerk-webhook.js";
import { coursesRouter } from "./routes/courses.js";
import { enrollmentsRouter } from "./routes/enrollments.js";
import { accessRouter } from "./routes/access.js";
import { handleRazorpayWebhook, handleStripeWebhook, paymentsRouter } from "./routes/payments.js";
import { progressRouter } from "./routes/progress.js";
import { dashboardRouter } from "./routes/dashboard.js";
const app = express();
app.use(cors({ origin: env.CORS_ORIGIN }));
// Clerk requires raw body for Svix signature verification.
app.post("/webhooks/clerk", express.raw({ type: "application/json" }), handleClerkWebhook);
app.post("/payments/webhooks/razorpay", express.raw({ type: "application/json" }), handleRazorpayWebhook);
app.post("/payments/webhooks/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({
        ok: true,
        service: "lms-backend",
        env: env.NODE_ENV
    });
});
app.use("/courses", coursesRouter);
app.use("/enrollments", enrollmentsRouter);
app.use("/access", accessRouter);
app.use("/payments", paymentsRouter);
app.use("/progress", progressRouter);
app.use("/dashboard", dashboardRouter);
app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
});
