"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, Users, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const INDIVIDUAL_PLANS = [
  {
    name: "Single Course",
    price: "₹1,999",
    period: "/ course",
    description: "Pick a single topic or skill and earn a verified credential.",
    highlight: false,
    cta: "Browse Courses",
    href: "/courses",
    note: "Pay only for what you need",
    features: [
      "Lifetime access to purchased course",
      "Certificate upon completion",
      "Community forum access",
      "Mobile & offline access",
    ],
  },
  {
    name: "EduNova Plus",
    price: "₹2,499",
    period: "/ month",
    description: "Access thousands of courses and earn unlimited certificates.",
    highlight: true,
    badge: "Most Popular",
    cta: "Start Free Trial",
    href: "/auth/sign-up?plan=plus",
    note: "Cancel anytime · 14-day free trial",
    features: [
      "Access to 7,000+ courses",
      "Unlimited certificates",
      "AI-powered learning paths",
      "1-on-1 mentorship sessions",
      "Priority support",
      "Offline downloads",
    ],
  },
  {
    name: "Plus Annual",
    price: "₹19,999",
    period: "/ year",
    description:
      "Save big by committing to a full year of accelerated learning.",
    highlight: false,
    badge: "Save 33%",
    cta: "Try Annual Plan",
    href: "/auth/sign-up?plan=annual",
    note: "14-day money-back guarantee",
    features: [
      "Everything in EduNova Plus",
      "Save ₹9,989 vs. monthly",
      "Early access to new courses",
      "Exclusive annual member events",
    ],
  },
];

const TEAM_PLANS = [
  {
    name: "Teams Starter",
    price: "₹1,999",
    period: "/ seat / month",
    description: "5–25 seats. Simple team learning for growing companies.",
    highlight: false,
    cta: "Get Started",
    href: "/auth/sign-up?plan=teams",
    note: "Minimum 5 seats",
    features: [
      "All Plus features per seat",
      "Team progress dashboard",
      "Admin management panel",
      "Monthly usage reports",
    ],
  },
  {
    name: "Teams Pro",
    price: "₹1,499",
    period: "/ seat / month",
    description: "25+ seats. Volume pricing with dedicated account management.",
    highlight: true,
    badge: "Best for Teams",
    cta: "Start Team Trial",
    href: "/auth/sign-up?plan=teams-pro",
    note: "Minimum 25 seats · Cancel anytime",
    features: [
      "Everything in Starter",
      "Dedicated success manager",
      "Custom learning paths",
      "SSO & SCIM provisioning",
      "Advanced analytics",
      "Priority SLA support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "for large teams",
    description:
      "Fully tailored learning programs for 100+ seat organizations.",
    highlight: false,
    cta: "Contact Sales",
    href: "/support",
    note: "Unlimited seats available",
    features: [
      "Everything in Teams Pro",
      "Custom API integrations",
      "White-label option",
      "Compliance & audit logs",
    ],
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [tab, setTab] = useState<"individuals" | "teams">("individuals");

  const plans = tab === "individuals" ? INDIVIDUAL_PLANS : TEAM_PLANS;

  return (
    <section
      className="relative py-28 overflow-hidden bg-[#05050a]"
      id="pricing"
      ref={ref}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-black tracking-[0.25em] text-violet-400 uppercase mb-4">
            Flexible Pricing
          </p>
          <h2
            className={`font-serif text-4xl md:text-5xl font-black text-white mb-4 leading-tight`}
          >
            Invest in Your Future
          </h2>
          <p
            className={`${montserrat.className} text-gray-400 text-base max-w-xl mx-auto mb-10`}
          >
            All plans include a 7-day free trial. No credit card required.
          </p>

          {/* Tab toggle — same style as Coursera */}
          <div className="inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10 gap-1">
            <button
              onClick={() => setTab("individuals")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                tab === "individuals"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              For Individuals
            </button>
            <button
              onClick={() => setTab("teams")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                tab === "teams"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Users size={14} /> For Teams
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                  plan.highlight
                    ? "ring-2 ring-violet-500/70 shadow-2xl shadow-violet-500/20"
                    : "border border-white/[0.07]"
                }`}
                style={{
                  background: plan.highlight
                    ? "linear-gradient(160deg, rgba(124,58,237,0.15) 0%, rgba(10,10,20,0.97) 60%)"
                    : "rgba(255,255,255,0.025)",
                }}
              >
                {/* Badge */}
                {"badge" in plan && plan.badge && (
                  <div
                    className={`text-center py-2 text-[11px] font-black uppercase tracking-widest ${
                      plan.highlight
                        ? "bg-linear-to-r from-violet-600 to-purple-600 text-white"
                        : "bg-amber-500/10 text-amber-400 border-b border-amber-500/20"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Name + desc */}
                  <h3 className="font-serif text-xl font-black text-white mb-2 leading-6">
                    {plan.name}
                  </h3>
                  <p
                    className={`${montserrat.className} text-sm text-gray-400 leading-relaxed mb-6`}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-serif font-black text-white tracking-tight">
                        {plan.price}
                      </span>
                      <span
                        className={`${montserrat.className} text-gray-500 text-sm font-medium`}
                      >
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.href}
                    className={`${montserrat.className} flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm mb-2 transition-all group ${
                      plan.highlight
                        ? "bg-linear-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-600/25"
                        : "border border-white/10 bg-white/3 text-white hover:bg-white/[0.07] hover:border-white/20"
                    }`}
                  >
                    {plan.highlight && <Zap size={14} />}
                    {plan.cta}
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                  <p
                    className={`${montserrat.className} text-center text-[11px] text-gray-600 mb-8`}
                  >
                    {plan.note}
                  </p>

                  {/* Features */}
                  <div className="border-t border-white/5 pt-6 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            plan.highlight ? "bg-violet-600/20" : "bg-white/5"
                          }`}
                        >
                          <Check
                            size={10}
                            className={
                              plan.highlight
                                ? "text-violet-400"
                                : "text-gray-500"
                            }
                            strokeWidth={3}
                          />
                        </div>
                        <span
                          className={`${montserrat.className} text-sm text-gray-300 font-medium`}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
        >
          <span>🛡️ 30-day money-back guarantee</span>
          <span>·</span>
          <span>No hidden fees</span>
          <span>·</span>
          <Link
            href="/pricing"
            className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
          >
            See full plan details →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
