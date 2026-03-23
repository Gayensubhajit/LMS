"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Zap, Star, Crown } from "lucide-react";

const plans = [
  {
    name: "Pay Per Course",
    icon: "📚",
    price: { monthly: 49, yearly: 39 },
    description: "Perfect for exploring specific topics at your own pace.",
    badge: null,
    color: "from-blue-500 to-cyan-600",
    glow: "rgba(59,130,246,0.3)",
    features: [
      { text: "Access to purchased courses", included: true },
      { text: "Lifetime course access", included: true },
      { text: "Certificate of completion", included: true },
      { text: "Community forum access", included: true },
      { text: "AI learning assistant", included: false },
      { text: "1-on-1 mentorship sessions", included: false },
      { text: "Unlimited course access", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro Plan",
    icon: "⚡",
    price: { monthly: 79, yearly: 59 },
    description: "Most popular. Everything you need to accelerate your career.",
    badge: "Most Popular",
    color: "from-violet-500 to-purple-700",
    glow: "rgba(124,58,237,0.5)",
    features: [
      { text: "Access to purchased courses", included: true },
      { text: "Lifetime course access", included: true },
      { text: "Certificate of completion", included: true },
      { text: "Community forum access", included: true },
      { text: "AI learning assistant", included: true },
      { text: "1-on-1 mentorship sessions", included: true },
      { text: "Unlimited course access", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Subscription Plan",
    icon: "👑",
    price: { monthly: 129, yearly: 99 },
    description: "Unlimited everything. For serious learners and teams.",
    badge: "Best Value",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.3)",
    features: [
      { text: "Access to purchased courses", included: true },
      { text: "Lifetime course access", included: true },
      { text: "Certificate of completion", included: true },
      { text: "Community forum access", included: true },
      { text: "AI learning assistant", included: true },
      { text: "1-on-1 mentorship sessions", included: true },
      { text: "Unlimited course access", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Get Premium",
    highlight: false,
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="relative py-28 overflow-hidden" id="pricing">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 tag-purple mb-4">Flexible Pricing</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Invest in Your Future —
            <br />
            <span className="gradient-text">Choose Your Perfect Plan</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            All plans include a 7-day free trial. No credit card required. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center glass-card rounded-xl p-1 gap-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                billing === "monthly"
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.highlight
                  ? "ring-2 ring-violet-500 shadow-[0_0_60px_rgba(124,58,237,0.3)]"
                  : "glass-card"
              }`}
              style={{
                background: plan.highlight
                  ? "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(15,15,30,0.9) 100%)"
                  : undefined,
                border: plan.highlight ? "1px solid rgba(124,58,237,0.5)" : undefined,
              }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div
                  className={`absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-bold ${
                    plan.highlight
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {plan.badge === "Most Popular" && <Star size={11} className="inline mr-1" />}
                  {plan.badge === "Best Value" && <Crown size={11} className="inline mr-1" />}
                  {plan.badge}
                </div>
              )}

              <div className={`p-8 ${plan.badge ? "pt-12" : ""}`}>
                {/* Plan icon + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-xl shadow-lg`}
                    style={{ boxShadow: `0 8px 25px ${plan.glow}` }}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{plan.name}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-6 leading-relaxed">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <motion.div
                    key={billing}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-baseline gap-1"
                  >
                    <span className="text-4xl font-black text-white">
                      ${plan.price[billing]}
                    </span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </motion.div>
                  {billing === "yearly" && (
                    <div className="text-xs text-green-400 mt-1">
                      Billed as ${plan.price.yearly * 12}/year • Save ${(plan.price.monthly - plan.price.yearly) * 12}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: plan.highlight ? `0 0 30px ${plan.glow}` : undefined,
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm mb-6 transition-all duration-300 ${
                    plan.highlight
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                      : "border border-violet-500/30 text-violet-300 hover:bg-violet-600/10"
                  }`}
                >
                  {plan.highlight && <Zap size={14} className="inline mr-1.5" />}
                  {plan.cta}
                </motion.button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          feat.included
                            ? "bg-violet-600/20 border border-violet-500/40"
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        {feat.included ? (
                          <Check size={11} className="text-violet-400" />
                        ) : (
                          <X size={11} className="text-gray-600" />
                        )}
                      </div>
                      <span className={`text-sm ${feat.included ? "text-gray-300" : "text-gray-600"}`}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Money back guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10 text-sm text-gray-500"
        >
          🛡️ <span className="text-gray-300 font-medium">30-day money-back guarantee</span> • No questions asked • Cancel anytime
        </motion.div>
      </div>
    </section>
  );
}
