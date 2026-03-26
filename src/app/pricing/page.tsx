"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Users,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

// ── Data ──────────────────────────────────────────────────────────────────

const INDIVIDUAL_PLANS = [
  {
    name: "Single Course",
    price: "₹1,999",
    period: "/course",
    description: "Learn a single topic or skill and earn a credential.",
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
    period: "/month",
    description:
      "Access 7,000+ courses. Earn unlimited certificates in the short term.",
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
      "Offline downloads & mobile",
      "Priority support",
    ],
  },
  {
    name: "Plus Annual",
    price: "₹19,999",
    period: "/year",
    description:
      "Combine flexibility and savings with long-term learning goals.",
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
    period: "/seat/month",
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
    period: "/seat/month",
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
    description: "Fully tailored programs for 100+ seat organizations.",
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

const COMPARISON = [
  { feature: "Access to free content", free: true, plus: true, ent: true },
  { feature: "Certificate of completion", free: true, plus: true, ent: true },
  { feature: "Unlimited course access", free: false, plus: true, ent: true },
  { feature: "AI-powered learning paths", free: false, plus: true, ent: true },
  { feature: "1-on-1 mentorship", free: false, plus: true, ent: true },
  { feature: "Offline downloads", free: false, plus: true, ent: true },
  { feature: "Dedicated success manager", free: false, plus: false, ent: true },
  { feature: "Custom learning paths", free: false, plus: false, ent: true },
  { feature: "SSO & admin panel", free: false, plus: false, ent: true },
  { feature: "Advanced analytics", free: false, plus: false, ent: true },
];

const FAQS = [
  {
    q: "Can I cancel my Plus subscription at any time?",
    a: "Yes! You can cancel anytime from your account settings. You'll keep access until the end of your billing period with no questions asked.",
  },
  {
    q: "Does the free trial require a credit card?",
    a: "We ask for a payment method for the 14-day free trial to ensure a seamless transition, but you can cancel before it ends and you won't be charged.",
  },
  {
    q: "Are the certificates industry-recognized?",
    a: "Our certificates are co-signed by top instructors and industry partners, and are frequently validated by leading tech companies worldwide.",
  },
  {
    q: "Do you offer student or non-profit discounts?",
    a: "Yes — contact our support team with your student ID to receive a 50% discount on the Plus plan.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade, downgrade, or switch from monthly to annual billing at any time from your account dashboard.",
  },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function PlanCard({
  plan,
  i,
}: {
  plan: (typeof INDIVIDUAL_PLANS)[0];
  i: number;
}) {
  const hasHighlight = "highlight" in plan && plan.highlight;
  const hasBadge = "badge" in plan && plan.badge;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07 }}
      className={`relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        hasHighlight
          ? "ring-2 ring-violet-500/60 shadow-2xl shadow-violet-500/20"
          : "border border-white/[0.08]"
      }`}
      style={{
        background: hasHighlight
          ? "linear-gradient(160deg, rgba(124,58,237,0.18) 0%, rgba(8,8,18,0.97) 60%)"
          : "rgba(255,255,255,0.025)",
      }}
    >
      {hasBadge && (
        <div
          className={`text-center py-2 text-[11px] font-black uppercase tracking-widest ${
            hasHighlight
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
              : "bg-amber-500/10 text-amber-400 border-b border-amber-500/20"
          }`}
        >
          {(plan as { badge?: string }).badge}
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-xl font-black text-white mb-2">{plan.name}</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          {plan.description}
        </p>

        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-white tracking-tight">
              {plan.price}
            </span>
            <span className="text-gray-500 text-sm font-medium">
              {plan.period}
            </span>
          </div>
        </div>

        <Link
          href={plan.href}
          className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm mb-2 transition-all group ${
            hasHighlight
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-600/25"
              : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.07]"
          }`}
        >
          {hasHighlight && <Zap size={14} />}
          {plan.cta}
          <ArrowRight
            size={13}
            className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
          />
        </Link>
        <p className="text-center text-[11px] text-gray-600 mb-8">
          {plan.note}
        </p>

        <div className="border-t border-white/[0.05] pt-6 space-y-3 flex-1">
          {plan.features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                  hasHighlight ? "bg-violet-600/25" : "bg-white/5"
                }`}
              >
                <Check
                  size={10}
                  className={hasHighlight ? "text-violet-400" : "text-gray-500"}
                  strokeWidth={3}
                />
              </div>
              <span className="text-sm text-gray-300">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.05] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-bold text-white group-hover:text-violet-400 transition-colors pr-4">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-violet-400" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 text-sm pb-6 leading-relaxed max-w-3xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [tab, setTab] = useState<"individuals" | "teams">("individuals");
  const plans = tab === "individuals" ? INDIVIDUAL_PLANS : TEAM_PLANS;

  return (
    <div className="min-h-screen mx-auto">
      <Navbar />
      <div className="min-h-screen max-w-5xl mx-auto bg-[#05050a] text-white selection:bg-violet-500/30">
        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none -z-0">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/5 rounded-full blur-[140px]" />
        </div>

        <main className={`${montserrat.className} relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-32`}>
          {/* ── Hero ── */}
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold mb-6"
            >
              <Users size={12} /> Join 50,000+ Learners Today
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="font-serif text-5xl md:text-6xl font-black mb-5 leading-[1.1] tracking-tight"
            >
              Flexible Plans for <br />
              <span className={`${montserrat.className} bg-linear-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent`}>
                Every Career Level
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="text-gray-400 text-lg max-w-xl mx-auto"
            >
              All plans include a 7-day free trial. No hidden fees, cancel any
              time.
            </motion.p>
          </div>

          {/* ── Tab Toggle ── */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10 gap-1">
              <button
                onClick={() => setTab("individuals")}
                className={`px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  tab === "individuals"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                For Individuals
              </button>
              <button
                onClick={() => setTab("teams")}
                className={`px-7 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                  tab === "teams"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Users size={14} /> For Teams
              </button>
            </div>
          </div>

          {/* ── Plan Cards ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
            >
              {plans.map((plan, i) => (
                <PlanCard key={plan.name} plan={plan} i={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Comparison Table ── */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <p className="text-xs font-black tracking-[0.2em] uppercase text-gray-500 mb-3">
                Compare Plans
              </p>
              <h2 className="text-3xl font-black text-white">
                What's included in each plan
              </h2>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.02]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-5 px-6 text-left text-xs font-black text-gray-500 uppercase tracking-widest">
                      Feature
                    </th>
                    <th className="py-5 px-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                      Single
                    </th>
                    <th className="py-5 px-4 text-center text-xs font-black text-violet-400 uppercase tracking-widest">
                      Plus
                    </th>
                    <th className="py-5 px-4 text-center text-xs font-black text-blue-400 uppercase tracking-widest">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {COMPARISON.map((row) => (
                    <tr
                      key={row.feature}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-300 font-medium">
                        {row.feature}
                      </td>
                      {[row.free, row.plus, row.ent].map((val, idx) => (
                        <td key={idx} className="py-4 px-4 text-center">
                          {val ? (
                            <Check
                              size={16}
                              className={
                                idx === 1
                                  ? "text-violet-400 mx-auto"
                                  : idx === 2
                                    ? "text-blue-400 mx-auto"
                                    : "text-gray-500 mx-auto"
                              }
                            />
                          ) : (
                            <div className="w-4 h-px bg-white/10 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 mb-24">
            <div>
              <div className="flex items-center gap-2 text-violet-400 mb-4">
                <HelpCircle size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Support
                </span>
              </div>
              <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                Frequently
                <br />
                Asked Questions
              </h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Can't find what you're looking for? Contact our student support
                team.
              </p>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 text-sm font-bold text-violet-400 hover:text-violet-300 group"
              >
                Contact Support{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} {...faq} />
              ))}
            </div>
          </div>

          {/* ── CTA Banner ── */}
          <div className="relative rounded-3xl overflow-hidden p-12 lg:p-20 text-center border border-white/[0.06] bg-gradient-to-br from-[#0c0c1a] via-[#0a0a14] to-[#060610]">
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/8 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-600/30">
                <Star className="text-white" size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-5">
                Invest in Your Future Today
              </h2>
              <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
                Join thousands of professionals accelerating their careers with
                EduNova's specialized learning tracks.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link
                  href="/auth/sign-up"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-violet-600/20 hover:shadow-violet-600/40 transition-all active:scale-95"
                >
                  Start Your 14-Day Free Trial
                </Link>
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded-2xl bg-white/5 text-white font-bold text-sm hover:bg-white/10 border border-white/10 transition-all"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
