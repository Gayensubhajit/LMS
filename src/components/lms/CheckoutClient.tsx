"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Course } from "@/lib/courses-data";

type Plan = "1month" | "3month" | "6month";

export default function CheckoutClient({
  course,
  initialPlan,
}: {
  course: Course;
  initialPlan: Plan;
}) {
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [country, setCountry] = useState("India");
  const [coupon, setCoupon] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const price = useMemo(() => {
    if (plan === "3month") return course.price.threeMonth;
    if (plan === "6month") return course.price.sixMonth;
    return course.price.oneMonth;
  }, [course.price.oneMonth, course.price.sixMonth, course.price.threeMonth, plan]);

  const couponDiscount = useMemo(() => {
    const normalized = coupon.trim().toUpperCase();
    if (!normalized) return 0;
    if (normalized === "EDUNOVA10") return Math.round(price * 0.1);
    if (normalized === "WELCOME20") return Math.round(price * 0.2);
    return 0;
  }, [coupon, price]);

  const tax = Math.round((price - couponDiscount) * 0.18);
  const total = price - couponDiscount + tax;

  const canPay =
    name.trim().length > 1 &&
    email.includes("@") &&
    cardNumber.replace(/\s+/g, "").length >= 12 &&
    expiry.trim().length >= 4 &&
    cvv.trim().length >= 3 &&
    termsChecked &&
    !processing;

  const onPay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canPay) return;

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setProcessing(false);
    setCompleted(true);
  };

  if (completed) {
    return (
      <main className="min-h-screen bg-background text-foreground px-6 py-14">
        <div className="max-w-2xl mx-auto glass-card rounded-3xl border border-violet-500/20 p-8">
          <div className="tag-purple inline-flex mb-4">Payment Successful</div>
          <h1 className="text-3xl font-black text-white mb-3">Enrollment confirmed</h1>
          <p className="text-gray-400 mb-6">
            You are enrolled in <span className="text-white font-semibold">{course.title}</span> ({plan}).
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl"
            >
              Browse More Courses
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-violet-500/30 text-violet-300 font-semibold px-6 py-3 rounded-xl"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <Link href={`/courses/${course.slug}`} className="inline-flex mb-6 text-violet-300 hover:text-violet-200 text-sm">
          ← Back to course details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={onPay}
            className="lg:col-span-2 glass-card rounded-3xl border border-violet-500/20 p-7 space-y-6"
          >
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Secure Checkout</h1>
              <p className="text-gray-400">
                Complete payment for <span className="text-white">{course.title}</span>
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold mb-3">Choose plan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPlan("1month")}
                  className={`rounded-xl p-3 border text-left ${plan === "1month" ? "border-violet-500 bg-violet-500/10" : "border-violet-500/20 bg-white/5"}`}
                >
                  <div className="text-sm font-semibold text-white">1 Month</div>
                  <div className="text-violet-300 font-bold">${course.price.oneMonth}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPlan("3month")}
                  className={`rounded-xl p-3 border text-left ${plan === "3month" ? "border-violet-500 bg-violet-500/10" : "border-violet-500/20 bg-white/5"}`}
                >
                  <div className="text-sm font-semibold text-white">3 Months</div>
                  <div className="text-violet-300 font-bold">${course.price.threeMonth}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPlan("6month")}
                  className={`rounded-xl p-3 border text-left ${plan === "6month" ? "border-violet-500 bg-violet-500/10" : "border-violet-500/20 bg-white/5"}`}
                >
                  <div className="text-sm font-semibold text-white">6 Months</div>
                  <div className="text-violet-300 font-bold">${course.price.sixMonth}</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cardholder Name"
                className="w-full rounded-xl bg-white/5 border border-violet-500/20 text-white placeholder:text-gray-500 px-4 py-3 focus:outline-none"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full rounded-xl bg-white/5 border border-violet-500/20 text-white placeholder:text-gray-500 px-4 py-3 focus:outline-none"
              />
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                className="w-full rounded-xl bg-white/5 border border-violet-500/20 text-white placeholder:text-gray-500 px-4 py-3 focus:outline-none"
              />
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="w-full rounded-xl bg-white/5 border border-violet-500/20 text-white placeholder:text-gray-500 px-4 py-3 focus:outline-none"
              />
              <input
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full rounded-xl bg-white/5 border border-violet-500/20 text-white placeholder:text-gray-500 px-4 py-3 focus:outline-none"
              />
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="CVV"
                className="w-full rounded-xl bg-white/5 border border-violet-500/20 text-white placeholder:text-gray-500 px-4 py-3 focus:outline-none"
              />
            </div>

            <div>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code (try: EDUNOVA10 or WELCOME20)"
                className="w-full rounded-xl bg-white/5 border border-violet-500/20 text-white placeholder:text-gray-500 px-4 py-3 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                className="accent-violet-500"
              />
              I agree to the terms and billing policy.
            </label>

            <button
              type="submit"
              disabled={!canPay}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
            >
              {processing ? "Processing payment..." : `Pay $${total}`}
            </button>
          </form>

          <aside className="glass-card rounded-3xl border border-violet-500/20 p-6 h-fit sticky top-8">
            <h2 className="text-xl font-black text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-400">
                <span>Course</span>
                <span className="text-white font-medium text-right max-w-[60%]">{course.title}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Plan</span>
                <span className="text-white font-medium">{plan}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Base Price</span>
                <span className="text-white font-medium">${price}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Discount</span>
                <span className="text-green-400 font-medium">-${couponDiscount}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Tax (18%)</span>
                <span className="text-white font-medium">${tax}</span>
              </div>
              <div className="border-t border-violet-500/20 pt-3 flex items-center justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-2xl font-black text-white">${total}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

