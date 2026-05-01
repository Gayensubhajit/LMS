"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import { Montserrat } from "next/font/google";
import { useAuth } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";

const montserrat = Montserrat({ subsets: ["latin"] });

// ── Data ──────────────────────────────────────────────────────────────────

const INDIVIDUAL_PLANS = [
  {
    name: "Single Course",
    id: "single",
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
    id: "plus",
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
    id: "annual",
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
    id: "teams-starter",
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
    id: "teams-pro",
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
    id: "enterprise",
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

function PricingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 w-full">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[600px] rounded-3xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-8 animate-pulse"
        >
          <div className="w-24 h-6 bg-slate-200 dark:bg-white/10 rounded-lg mb-4" />
          <div className="w-full h-4 bg-slate-200 dark:bg-white/10 rounded-lg mb-2" />
          <div className="w-2/3 h-4 bg-slate-200 dark:bg-white/10 rounded-lg mb-8" />
          <div className="w-32 h-10 bg-slate-200 dark:bg-white/10 rounded-lg mb-8" />
          <div className="w-full h-12 bg-slate-200 dark:bg-white/10 rounded-xl mb-12" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-200 dark:bg-white/10 rounded-full" />
                <div className="w-1/2 h-3 bg-slate-200 dark:bg-white/10 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function PlanCard({
  plan,
  i,
  isMember,
  memberPlan,
}: {
  plan: (typeof INDIVIDUAL_PLANS)[0];
  i: number;
  isMember: boolean;
  memberPlan: string | null;
}) {
  const hasHighlight = "highlight" in plan && plan.highlight;
  const hasBadge = "badge" in plan && plan.badge;

  const isActivePlan = isMember && (
    ((plan as any).id === "plus" && (memberPlan === "plus" || memberPlan === "ONE_MONTH" || memberPlan === "Monthly" || !memberPlan)) ||
    ((plan as any).id === "annual" && (memberPlan === "annual" || memberPlan === "SIX_MONTH" || memberPlan === "Annual"))
  );

  // Hard-suppress trial CTA for ANY member on these plans
  const showTrial = !isMember;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07 }}
      className={`relative rounded-3xl flex flex-col overflow-hidden transition-all duration-300 ${
        isActivePlan
          ? "ring-2 ring-emerald-500/60 shadow-2xl shadow-emerald-500/10"
          : hasHighlight
          ? "ring-2 ring-blue-500/60 dark:ring-violet-500/60 shadow-2xl shadow-blue-500/10 dark:shadow-violet-500/20"
          : "border border-slate-800/20 dark:border-white/20 shadow-sm dark:shadow-none bg-white/80 dark:bg-white/5"
      }`}
      style={
        isActivePlan
          ? { background: "linear-gradient(160deg, rgba(16,185,129,0.06) 0%, rgba(255,255,255,1) 100%)" }
          : hasHighlight
          ? { background: "linear-gradient(160deg, rgba(37,99,235,0.08) 0%, rgba(255,255,255,1) 100%)" }
          : {}
      }
    >
      {/* Dark mode override */}
      {(hasHighlight || isActivePlan) && (
        <div className={`absolute inset-0 pointer-events-none ${
          isActivePlan
            ? "bg-linear-to-br from-emerald-600/10 to-white dark:from-emerald-600/20 dark:to-slate-950"
            : "bg-linear-to-br from-blue-600/10 to-white dark:from-violet-600/20 dark:to-slate-950"
        }`} />
      )}

      {/* Active Member badge */}
      {isActivePlan && (
        <div className="text-center py-2 text-[11px] font-black uppercase tracking-widest bg-emerald-500 text-white">
          ✓ Active Plan
        </div>
      )}

      {!isActivePlan && hasBadge && (
        <div
          className={`text-center py-2 text-[11px] font-black uppercase tracking-widest ${
            hasHighlight
              ? "bg-linear-to-r from-violet-600 to-purple-600 text-white"
              : "bg-amber-500/10 text-amber-400 border-b border-amber-500/20"
          }`}
        >
          {(plan as { badge?: string }).badge}
        </div>
      )}

      <div className="p-8 flex flex-col flex-1 relative z-10">
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          {plan.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-6">
          {plan.description}
        </p>

        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {plan.price}
            </span>
            <span className="text-slate-500 dark:text-gray-500 text-sm font-medium">
              {plan.period}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {isActivePlan ? (
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-sm mb-2 transition-all cursor-default"
          >
            Continue Learning
          </Link>
        ) : isMember && ((plan as any).id === "plus" || (plan as any).id === "annual") ? (
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-sm mb-2 transition-all hover:bg-emerald-600"
          >
            Continue Learning
          </Link>
        ) : (
          <Link
            href={plan.href}
            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm mb-2 transition-all group ${
              hasHighlight
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 text-white hover:shadow-lg"
                : "border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white hover:bg-slate-100"
            }`}
          >
            {hasHighlight && <Zap size={14} />}
            {plan.cta}
            <ArrowRight
              size={13}
              className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
            />
          </Link>
        )}
        <p className={`text-center text-[11px] mb-8 ${
          isActivePlan ? "text-emerald-500 font-bold" : "text-slate-400 dark:text-gray-600"
        }`}>
          {isActivePlan ? "You have an active membership" : plan.note}
        </p>

        <div className="border-t border-slate-100 dark:border-white/[0.05] pt-6 space-y-3 flex-1">
          {plan.features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                  isActivePlan
                    ? "bg-emerald-500/10"
                    : hasHighlight
                    ? "bg-blue-500/10 dark:bg-violet-600/25"
                    : "bg-slate-100 dark:bg-white/5"
                }`}
              >
                <Check
                  size={10}
                  className={
                    isActivePlan
                      ? "text-emerald-500"
                      : hasHighlight
                      ? "text-blue-600 dark:text-violet-400"
                      : "text-slate-400 dark:text-gray-500"
                  }
                  strokeWidth={3}
                />
              </div>
              <span className="text-sm text-slate-600 dark:text-gray-300">
                {f}
              </span>
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
    <div className="border-b border-slate-100 dark:border-white/[0.05] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between py-5 px-4 text-left group transition-all duration-300 rounded-2xl hover:bg-blue-600/5 dark:hover:bg-violet-600/5 ${open ? "bg-blue-600/5 dark:bg-violet-600/5" : ""}`}
      >
        <span className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-violet-400 transition-colors pr-4">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 dark:text-gray-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-blue-600 dark:text-violet-400" : ""}`}
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
            <p className="text-slate-500 dark:text-gray-400 text-sm py-2 px-4 pb-6 leading-relaxed max-w-3xl font-medium">
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
  const { getToken, userId, isLoaded } = useAuth();
  const [tab, setTab] = useState<"individuals" | "teams">("individuals");
  const [isMember, setIsMember] = useState(false);
  const [memberPlan, setMemberPlan] = useState<string | null>(null);
  const [memberLoading, setMemberLoading] = useState(true);
  const plans = tab === "individuals" ? INDIVIDUAL_PLANS : TEAM_PLANS;

  useEffect(() => {
    if (!isLoaded || !userId) {
      setMemberLoading(false);
      return;
    }
    const check = async () => {
      try {
        // Use unified backendRequest for 100% Navbar consistency
        const res = await backendRequest<{ ok: boolean; enrolled: boolean }>("/enrollments/check/plus-membership", {
          clerkUserId: userId,
        });
        
        if (res.ok && res.enrolled) {
          setIsMember(true);
        }

        // Fallback: check full enrollment list for status-based detection
        const meData = await backendRequest<{ ok: boolean; items: any[] }>("/enrollments/me", {
          clerkUserId: userId,
        });

        if (meData.ok && meData.items) {
          const plus = meData.items.find((e: any) => 
            (e.course.slug === "plus-membership" || e.course.slug === "membership") && 
            (e.status === "ACTIVE" || e.status === "TRIALING")
          );
          if (plus) {
            setIsMember(true);
            setMemberPlan(plus.plan);
          }
        }
      } catch (err) {
        console.error("[PricingPage] Sync Error:", err);
      } finally {
        setMemberLoading(false);
      }
    };
    check();
  }, [isLoaded, userId, getToken]);

  return (
    <div className="min-h-screen mx-auto bg-[#f6f8ff] dark:bg-[#030712] transition-colors duration-700">
      <Navbar />
      <div className="min-h-screen max-w-5xl mx-auto text-slate-900 dark:text-white selection:bg-blue-500/30 selection:dark:bg-violet-500/30">
        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none -z-0">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/5 rounded-full blur-[140px]" />
        </div>

        <main
          className={`${montserrat.className} relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-32`}
        >
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
              className="font-serif text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-5 leading-[1.1] tracking-tight"
            >
              Flexible Plans for <br />
              <span
                className={`${montserrat.className} uppercase font-black bg-linear-to-r from-blue-600 to-indigo-600 dark:from-violet-400 dark:to-purple-500 bg-clip-text text-transparent`}
              >
                Every Level
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="text-slate-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto font-medium"
            >
              All plans include a 7-day free trial. No hidden fees, cancel any
              time.
            </motion.p>
          </div>

          {/* ── Tab Toggle ── */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center p-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 gap-1 shadow-sm">
              <button
                onClick={() => setTab("individuals")}
                className={`px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  tab === "individuals"
                    ? "bg-blue-600 dark:bg-violet-600 text-white shadow-lg shadow-blue-600/30 dark:shadow-violet-600/30"
                    : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                For Individuals
              </button>
              <button
                onClick={() => setTab("teams")}
                className={`px-7 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                  tab === "teams"
                    ? "bg-blue-600 dark:bg-violet-600 text-white shadow-lg shadow-blue-600/30 dark:shadow-violet-600/30"
                    : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Users size={14} /> For Teams
              </button>
            </div>
          </div>

          {/* ── Plan Cards ── */}
          <AnimatePresence mode="wait">
            {memberLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PricingSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
              >
                {plans.map((plan, i) => (
                  <PlanCard key={plan.name} plan={plan} i={i} isMember={isMember} memberPlan={memberPlan} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Comparison Table ── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <p className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 dark:text-gray-500 mb-3">
                Compare Plans
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Plan Comparison
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-white/7 bg-white dark:bg-white/2 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="w-full overflow-x-auto pricing-page-comparison-table-scrollbar">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/6">
                      <th className="py-5 px-6 text-left text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                        Feature
                      </th>
                      <th className="py-5 px-4 text-center text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                        Single
                      </th>
                      <th className="py-5 px-4 text-center text-[10px] font-black text-blue-600 dark:text-violet-400 uppercase tracking-widest">
                        Plus
                      </th>
                      <th className="py-5 px-4 text-center text-[10px] font-black text-indigo-600 dark:text-blue-400 uppercase tracking-widest">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/4">
                    {COMPARISON.map((row) => (
                      <tr
                        key={row.feature}
                        className="hover:bg-white/2 transition-colors"
                      >
                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-gray-300 font-bold">
                          {row.feature}
                        </td>
                        {[row.free, row.plus, row.ent].map((val, idx) => (
                          <td key={idx} className="py-4 px-4 text-center">
                            {val ? (
                              <Check
                                size={16}
                                className={
                                  idx === 1
                                    ? "text-blue-600 dark:text-violet-400 mx-auto"
                                    : idx === 2
                                      ? "text-indigo-600 dark:text-blue-400 mx-auto"
                                      : "text-slate-400 dark:text-gray-500 mx-auto"
                                }
                              />
                            ) : (
                              <div className="w-4 h-px bg-slate-200 dark:bg-white/10 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* ── FAQ ── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 mb-24"
          >
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-violet-400 mb-4">
                <HelpCircle size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Support
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight uppercase">
                Questions?
              </h2>
              <p className="text-slate-500 dark:text-gray-500 text-sm mb-6 leading-relaxed font-medium">
                Can't find what you're looking for? Contact our student support
                team.
              </p>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-violet-400 hover:text-blue-700 dark:hover:text-violet-300 group"
              >
                Contact Support{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} {...faq} />
              ))}
            </div>
          </motion.div>

          {/* ── CTA Banner ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative rounded-[3rem] overflow-hidden p-12 lg:p-20 text-center border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-gradient-to-br dark:from-[#0c0c1a] dark:via-[#0a0a14] dark:to-[#060610] shadow-2xl shadow-slate-200/50 dark:shadow-none"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/5 dark:bg-violet-600/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/5 dark:bg-blue-600/8 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-violet-600 dark:to-purple-800 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/30 dark:shadow-violet-600/30">
                <Star className="text-white" size={24} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-5 text-slate-900 dark:text-white uppercase tracking-tight">
                Unlock Your Potential
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-medium">
                Join thousands of professionals accelerating their careers with
                EduNova's specialized learning tracks.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link
                  href={isMember ? "/courses" : "/auth/sign-up"}
                  className="px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.03] transition-all"
                >
                  {isMember ? "Continue Learning" : "Start 14-Day Free Trial"}
                </Link>
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
