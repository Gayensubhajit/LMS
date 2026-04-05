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
      className="relative py-28 overflow-hidden bg-transparent"
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
          <span
            className={`${montserrat.className} px-2 py-1 border border-gray-900/50 dark:border-violet-500/50 rounded-lg text-xs font-black tracking-[0.25em] text-black dark:text-violet-400 uppercase mb-8`}
          >
            Flexible Pricing
          </span>
          <h2
            className={`font-serif text-4xl md:text-6xl font-black text-black dark:text-white mb-4 leading-tight`}
          >
            Invest in Your Future
          </h2>
          <p
            className={`${montserrat.className} text-gray-600 dark:text-gray-400 text-base max-w-xl mx-auto mb-10`}
          >
            All plans include a 7-day free trial. No credit card required.
          </p>

          {/* Tab toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 gap-1">
            <button
              onClick={() => setTab("individuals")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                tab === "individuals"
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-md"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              For Individuals
            </button>
            <button
              onClick={() => setTab("teams")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                tab === "teams"
                  ? "bg-black dark:bg-violet-600 text-white shadow-md dark:shadow-violet-600/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
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
                    ? "border-2 border-indigo-600 dark:border-violet-500/70 shadow-2xl shadow-indigo-500/10 dark:shadow-violet-500/20 bg-white dark:bg-[#111827]"
                    : "border border-black/20 dark:border-white/20 bg-white dark:bg-transparent"
                }`}
                style={{
                  background: "transparent",
                }}
              >
                {/* Badge */}
                {"badge" in plan && plan.badge && (
                  <div
                    className={`text-center py-2 text-[11px] font-black uppercase tracking-widest ${
                      plan.highlight
                        ? "bg-black dark:bg-linear-to-r dark:from-violet-600 dark:to-purple-600 text-white"
                        : "bg-gray-100 dark:bg-amber-500/10 text-black dark:text-amber-400 border-b border-black/5 dark:border-amber-500/20"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Name + desc */}
                  <h3 className="font-serif text-xl font-black mb-2 leading-6 text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p
                    className={`${montserrat.className} text-sm leading-relaxed mb-6 text-slate-500 dark:text-gray-400`}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span
                        className={`${montserrat.className} text-slate-500 dark:text-gray-500 text-sm font-medium`}
                      >
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.href}
                    className={`${montserrat.className} text-center flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm mb-2 transition-all group ${
                      plan.highlight
                        ? "bg-[#0056d2] text-white hover:bg-[#00419e] shadow-lg shadow-blue-500/20"
                        : "bg-[#0056d2] text-white hover:bg-[#00419e] shadow-lg shadow-blue-500/10"
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
                    className={`${montserrat.className} text-center text-[11px] mb-8 text-slate-400 dark:text-gray-600`}
                  >
                    {plan.note}
                  </p>

                  {/* Features */}
                  <div className="border-t border-white/5 pt-6 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            plan.highlight
                              ? "bg-black/5 dark:bg-violet-600/20"
                              : "bg-black/5 dark:bg-white/5"
                          }`}
                        >
                          <Check
                            size={10}
                            className={
                              plan.highlight
                                ? "text-black dark:text-violet-400"
                                : "text-gray-400 dark:text-gray-500"
                            }
                            strokeWidth={3}
                          />
                        </div>
                        <span
                          className={`${montserrat.className} text-sm font-medium text-slate-600 dark:text-gray-300`}
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
            className="text-black dark:text-violet-400 hover:opacity-70 dark:hover:text-violet-300 font-semibold transition-all"
          >
            See full plan details →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
