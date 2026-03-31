"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Check, ShieldCheck, ArrowLeft } from "lucide-react";
import type { Course } from "@/lib/courses-data";
import { backendRequest } from "@/lib/backend-client";
import { formatLocalPrice } from "@/lib/utils/currency";

type Plan = "1month" | "3month" | "6month";

const planLabel: Record<Plan, string> = {
  "1month": "1 Month of Access",
  "3month": "3 Months of Access",
  "6month": "6 Months of Access",
};

export default function CheckoutClient({
  course,
  initialPlan,
}: {
  course: Course;
  initialPlan: Plan;
}) {
  const { user, isLoaded } = useUser();
  const [plan] = useState<Plan>(initialPlan);
  const [termsChecked, setTermsChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = useMemo(() => {
    if (plan === "3month") return course.price.threeMonth;
    if (plan === "6month") return course.price.sixMonth;
    return course.price.oneMonth;
  }, [course.price, plan]);

  const totalFormatted = formatLocalPrice(price);

  const onPay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termsChecked || processing) return;
    if (!isLoaded || !user?.id) {
      setError("Please sign in to continue checkout.");
      return;
    }
    setError(null);
    setProcessing(true);
    try {
      const enrollmentRes = await backendRequest<{ ok: true; item: { id: string } }>(
        "/enrollments",
        { method: "POST", clerkUserId: user.id, body: { courseSlug: course.slug, plan } }
      );
      await backendRequest("/payments/create-order", {
        method: "POST",
        clerkUserId: user.id,
        body: { enrollmentId: enrollmentRes.item.id, provider: "razorpay", currency: "INR" },
      });
      await new Promise((r) => setTimeout(r, 1200));
      setCompleted(true);
    } catch (err) {
      setError((err as Error).message || "Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ── Success screen ── */
  if (completed) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div
          className="glass-card rounded-3xl p-10 max-w-md w-full text-center animate-slide-up"
          style={{ boxShadow: "0 0 60px rgba(124,58,237,0.25)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" }}
          >
            <Check className="w-8 h-8 text-violet-400" />
          </div>
          <div className="tag-purple inline-flex mb-4">Payment Successful</div>
          <h1 className="text-3xl font-black text-white mb-3">Enrollment Confirmed!</h1>
          <p className="text-gray-400 mb-8">
            You are now enrolled in{" "}
            <span className="text-white font-semibold">{course.title}</span>{" "}
            ({planLabel[plan]}).
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/my-courses"
              className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}
            >
              Go to My Courses
            </Link>
            <Link
              href={`/learn/${course.slug}`}
              className="px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(124,58,237,0.4)", color: "#c084fc" }}
            >
              Start Learning
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── Main checkout page ── */
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header
        className="px-8 py-4 flex items-center gap-4"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.2)", background: "rgba(15,15,30,0.9)", backdropFilter: "blur(12px)" }}
      >
        <div
          className="text-xl font-black"
          style={{ background: "linear-gradient(135deg, #c084fc, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          EduNova
        </div>
        <span className="text-gray-600 text-sm hidden sm:block">|</span>
        <span className="text-gray-400 text-sm hidden sm:block">Secure Checkout</span>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-2 text-violet-300 hover:text-violet-200 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back to course
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── LEFT: Checkout form ── */}
          <form onSubmit={onPay} className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">Checkout</h1>
              <p className="text-gray-500 text-sm">Complete your enrollment securely</p>
            </div>

            {/* Payment method icons */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">
                Accepted Payment Methods
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">

                {/* VISA */}
                <div className="flex items-center justify-center px-2.5 rounded-md bg-white" style={{ border: "1px solid #ccc", height: 32, minWidth: 54 }}>
                  <svg viewBox="0 0 780 250" height="14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M293.2 348.7l33.4-195.7h53.4l-33.4 195.7H293.2zm246.9-191.4c-10.6-3.9-27.1-8.1-47.8-8.1-52.7 0-89.9 26.7-90.2 64.9-.3 28.3 26.5 44.1 46.8 53.5 20.7 9.6 27.7 15.8 27.6 24.4-.1 13.2-16.6 19.2-31.9 19.2-21.3 0-32.7-3-50.2-10.3l-6.9-3.1-7.5 44.1c12.4 5.5 35.4 10.2 59.3 10.4 55.9 0 92.2-26.4 92.6-67.4.2-22.5-14-39.6-44.7-53.7-18.6-9.1-30-15.2-29.8-24.5 0-8.2 9.6-17 30.4-17 17.3-.3 29.9 3.5 39.7 7.4l4.7 2.2 7.1-41zM618.6 153h-41.2c-12.8 0-22.3 3.5-27.9 16.2l-79.1 179.5h55.9l11.1-29.4 68.2.1c1.6 6.8 6.5 29.3 6.5 29.3h49.4L618.6 153zm-65.7 126.2l21.2-54.9 2.4-6.3 1.8-5.2 6 33.7 5.8 32.7h-37.2zM232.7 153l-52.2 133.5-5.6-27.2c-9.7-31.3-40-65.2-73.8-82.3l47.8 170.7 56.5-.1 84.1-194.7-56.8.1z" fill="#1A1F71"/>
                    <path d="M131.9 153H47.3l-.6 4c66 16.1 109.7 54.9 127.8 101.5l-18.4-89.3c-3.2-12.5-12.4-16-23.2-16.2z" fill="#F9A533"/>
                  </svg>
                </div>

                {/* Mastercard */}
                <div className="flex items-center justify-center gap-1 px-2 rounded-md bg-white" style={{ border: "1px solid #ccc", height: 32, minWidth: 54 }}>
                  <svg viewBox="0 0 38 24" height="20" width="38" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="13" cy="12" r="10" fill="#EB001B"/>
                    <circle cx="25" cy="12" r="10" fill="#F79E1B"/>
                    <path d="M19 4.8a10 10 0 0 1 0 14.4A10 10 0 0 1 19 4.8z" fill="#FF5F00"/>
                  </svg>
                  <span className="text-gray-500 text-[8px] font-semibold">mastercard</span>
                </div>

                {/* American Express */}
                <div className="flex items-center justify-center px-2.5 rounded-md" style={{ border: "1px solid #006FCF", background: "#006FCF", height: 32, minWidth: 54 }}>
                  <span className="text-white font-extrabold text-[11px] tracking-tight">AMERICAN<br/>EXPRESS</span>
                </div>

                {/* UPI */}
                <div className="flex items-center justify-center px-2.5 rounded-md bg-white" style={{ border: "1px solid #ccc", height: 32, minWidth: 54 }}>
                  <svg viewBox="0 0 80 30" height="20" width="60" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="22" fontSize="22" fontFamily="Arial Black,sans-serif" fontWeight="900" fill="#097939">U</text>
                    <text x="22" y="22" fontSize="22" fontFamily="Arial Black,sans-serif" fontWeight="900" fill="#ED1C24">P</text>
                    <text x="44" y="22" fontSize="22" fontFamily="Arial Black,sans-serif" fontWeight="900" fill="#002970">I</text>
                    <rect x="0" y="24" width="20" height="3" fill="#097939" rx="1"/>
                    <rect x="22" y="24" width="20" height="3" fill="#ED1C24" rx="1"/>
                    <rect x="44" y="24" width="20" height="3" fill="#002970" rx="1"/>
                  </svg>
                </div>

                {/* Net Banking */}
                <div className="flex items-center justify-center px-3 rounded-md bg-white" style={{ border: "1px solid #ccc", height: 32 }}>
                  <span className="text-gray-700 font-semibold text-xs whitespace-nowrap">Net Banking</span>
                </div>

                {/* EMI */}
                <div className="flex items-center justify-center px-3 rounded-md" style={{ border: "1px solid #006FCF", background: "#006FCF", height: 32 }}>
                  <span className="text-white font-bold text-xs tracking-wide">EMI</span>
                </div>

              </div>
            </div>

            {/* Security note */}
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <ShieldCheck size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
              <span>
                Your payment is secured with 256-bit SSL encryption. By continuing, you agree to the{" "}
                <span className="text-violet-400 cursor-pointer hover:text-violet-300">Terms of Use</span>,{" "}
                <span className="text-violet-400 cursor-pointer hover:text-violet-300">Refund Policy</span>, and{" "}
                <span className="text-violet-400 cursor-pointer hover:text-violet-300">Privacy Policy</span>.
              </span>
            </div>

            {/* Agreement checkbox */}
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-5 h-5 rounded flex items-center justify-center transition-all"
                  style={{
                    border: `2px solid ${termsChecked ? "#a855f7" : "rgba(124,58,237,0.3)"}`,
                    background: termsChecked ? "rgba(124,58,237,0.3)" : "transparent",
                  }}
                >
                  {termsChecked && <Check size={12} className="text-violet-300" />}
                </div>
              </div>
              <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                I confirm I have read and agree to the above policies
              </span>
            </label>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!termsChecked || processing}
              className="w-full py-4 rounded-xl text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: termsChecked ? "0 0 30px rgba(124,58,237,0.5)" : "none",
              }}
            >
              {processing ? "Processing payment…" : "Continue to payment →"}
            </button>
          </form>

          {/* ── RIGHT: Order summary ── */}
          <aside className="lg:col-span-2 space-y-4">
            {/* Course card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Order Summary</p>

              <div className="flex gap-3 items-start mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  {course.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-snug">{course.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">by EduNova</p>
                  <button
                    type="button"
                    className="text-xs mt-1 text-violet-400 hover:text-violet-300 transition-colors"
                    onClick={() => window.history.back()}
                  >
                    ← Change plan
                  </button>
                </div>
              </div>

              <div
                className="rounded-xl p-4 space-y-2.5"
                style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{planLabel[plan]}</span>
                  <span className="text-white font-semibold">{totalFormatted}</span>
                </div>
                <div
                  className="border-t pt-2.5 flex justify-between text-sm"
                  style={{ borderColor: "rgba(124,58,237,0.2)" }}
                >
                  <span className="text-white font-bold">Total</span>
                  <span className="text-violet-300 font-black text-base">{totalFormatted}</span>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <div className="flex gap-3 items-start">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}
                >
                  👩‍💼
                </div>
                <div>
                  <p className="text-gray-300 text-xs italic leading-relaxed mb-2">
                    &ldquo;EduNova helped me land a job at a top tech company within 6 months. The quality of content is unmatched.&rdquo;
                  </p>
                  <p className="text-violet-400 text-xs font-semibold">— Priya S., Software Engineer</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-around py-2">
              {[
                { value: "140M+", label: "Learners" },
                { value: "10K+", label: "Courses" },
                { value: "95%", label: "Satisfaction" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p
                    className="text-lg font-black"
                    style={{ background: "linear-gradient(135deg, #c084fc, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    {value}
                  </p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-12 py-5 px-8 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}
      >
        <span
          className="text-sm font-bold"
          style={{ background: "linear-gradient(135deg, #c084fc, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          EduNova
        </span>
        <span className="text-xs text-gray-600">© 2025 EduNova Inc. All rights reserved.</span>
      </footer>
    </main>
  );
}
