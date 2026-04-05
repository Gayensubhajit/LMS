"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, Users, Zap, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { useAuth } from "@clerk/nextjs";

const montserrat = Montserrat({ subsets: ["latin"] });

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

const INDIVIDUAL_PLANS = [
  {
    id: "single",
    name: "Single Course",
    price: "₹1,499",
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
    id: "plus",
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
    id: "annual",
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
    id: "teams",
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
    id: "teams-pro",
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
    id: "enterprise",
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
  const { getToken, userId, isLoaded } = useAuth();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [tab, setTab] = useState<"individuals" | "teams">("individuals");
  const [isMember, setIsMember] = useState(false);
  const [memberPlan, setMemberPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !userId) {
      setLoading(false);
      return;
    }

    const checkMembership = async () => {
      try {
        const token = await getToken();
        // Check for Plus Membership specifically
        const res = await fetch(`${BACKEND_URL}/enrollments/check/plus-membership`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-clerk-user-id": userId
          }
        });
        const data = await res.json();
        
        if (data.ok && data.enrolled) {
          setIsMember(true);
          // If we want more info like plan name or expiry, we'd fetch /enrollments/me
          const meRes = await fetch(`${BACKEND_URL}/enrollments/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-clerk-user-id": userId
            }
          });
          const meData = await meRes.json();
          if (meData.ok) {
            const plus = meData.items.find((e: any) => e.course.slug === "plus-membership");
            if (plus) {
              setMemberPlan(plus.plan);
              if (plus.expiresAt) {
                setExpiryDate(new Date(plus.expiresAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }));
              }
            }
          }
        }
      } catch (err) {
        console.error("Check membership error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [userId, isLoaded, getToken]);

  const plans = tab === "individuals" ? INDIVIDUAL_PLANS : TEAM_PLANS;

  return (
    <section
      className="relative py-28 overflow-hidden bg-transparent"
      id="pricing"
      ref={ref}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          <span
            className={`${montserrat.className} px-2 py-1 border border-gray-900/50 dark:border-violet-500/50 rounded-lg text-xs font-black tracking-[0.25em] text-black dark:text-violet-400 uppercase mb-8`}
          >
            Flexible Pricing
          </span>
          <h2
            className={`font-serif text-4xl md:text-5xl font-black text-black dark:text-white mb-4 leading-tight tracking-tight`}

=======
=======
>>>>>>> Stashed changes
          <p className="text-xs font-black tracking-[0.25em] text-blue-600 dark:text-blue-400 uppercase mb-4">
            Membership Advantage
          </p>
          <h2
            className={`font-serif text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tight`}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          >
            Invest in Your Future
          </h2>
          <p
            className={`${montserrat.className} text-gray-600 dark:text-gray-400 text-base max-w-xl mx-auto mb-10 font-bold`}
          >
            All plans include a 14-day free trial. Unlock the full catalog for exactly ₹1 today.
          </p>

<<<<<<< Updated upstream
<<<<<<< Updated upstream
          {/* Tab toggle */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 gap-1.5">

=======
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 gap-1.5">
>>>>>>> Stashed changes
=======
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 gap-1.5">
>>>>>>> Stashed changes
            <button
              onClick={() => setTab("individuals")}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                tab === "individuals"
                  ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              For Individuals
            </button>
            <button
              onClick={() => setTab("teams")}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all duration-300 flex items-center gap-2.5 ${
                tab === "teams"
                  ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users size={16} /> For Teams
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
          >
            {plans.map((plan, i) => {
              const isActive = isMember && (
                (plan.id === "plus" && (memberPlan === "plus" || memberPlan === "ONE_MONTH")) ||
                (plan.id === "annual" && (memberPlan === "annual" || memberPlan === "SIX_MONTH")) ||
                (plan.id === "teams" && memberPlan === "teams") ||
                (plan.id === "teams-pro" && memberPlan === "teams-pro")
              );

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08 }}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                  className={`relative rounded-3xl flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                    plan.highlight
                      ? "border-2 border-indigo-600 dark:border-violet-500 shadow-2xl shadow-indigo-500/10 dark:shadow-violet-500/20 bg-white dark:bg-[#0f0f1e]"
=======
                  className={`relative rounded-[2.5rem] flex flex-col overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
                    plan.highlight
                      ? "border-2 border-blue-600 dark:border-blue-500 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20 bg-white dark:bg-[#0f0f1e]"
>>>>>>> Stashed changes
=======
                  className={`relative rounded-[2.5rem] flex flex-col overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
                    plan.highlight
                      ? "border-2 border-blue-600 dark:border-blue-500 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20 bg-white dark:bg-[#0f0f1e]"
>>>>>>> Stashed changes
                      : "border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.02] backdrop-blur-xl"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className={`text-center py-2.5 text-[10px] font-black uppercase tracking-widest ${
                        plan.highlight
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                          ? "bg-indigo-600 dark:bg-gradient-to-r dark:from-violet-600 dark:to-purple-600 text-white"
=======
                          ? "bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 text-white"
>>>>>>> Stashed changes
=======
                          ? "bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 text-white"
>>>>>>> Stashed changes
                          : "bg-slate-50 dark:bg-amber-500/10 text-slate-900 dark:text-amber-400 border-b border-slate-100 dark:border-amber-500/20"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

<<<<<<< Updated upstream
<<<<<<< Updated upstream
                  <div className="p-8 flex flex-col flex-1">
=======
                  <div className="p-10 flex flex-col flex-1">
>>>>>>> Stashed changes
=======
                  <div className="p-10 flex flex-col flex-1">
>>>>>>> Stashed changes
                    <h3 className="font-black text-2xl mb-2 leading-tight text-slate-900 dark:text-white tracking-tight">
                      {plan.name}
                    </h3>
                    <p
                      className={`${montserrat.className} text-sm leading-relaxed mb-8 text-slate-500 dark:text-gray-400 font-medium`}
                    >
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span
                          className={`${montserrat.className} text-slate-400 dark:text-gray-600 text-sm font-bold`}
                        >
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={isActive ? "/courses" : plan.href}
                      className={`${montserrat.className} flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest mb-3 transition-all group ${
                        isActive 
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 cursor-default" 
                          : plan.highlight
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/30"
                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.03] shadow-lg"
                      }`}
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : isActive ? (
                        <>Active Member</>
                      ) : (
                        <>
                          {plan.highlight && <Zap size={14} className="fill-current" />}
                          {plan.cta}
                          <ArrowRight
                            size={16}
                            className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                          />
                        </>
                      )}
                    </Link>
                    
                    <p
                      className={`${montserrat.className} text-center text-[10px] font-black mb-8 uppercase tracking-widest ${
                        isActive ? "text-emerald-500" : "text-slate-400 dark:text-gray-600"
                      }`}
                    >
                      {isActive && expiryDate ? `Next Billing: ${expiryDate}` : plan.note}
                    </p>

                    {/* Features */}
                    <div className="border-t border-slate-100 dark:border-white/5 pt-8 space-y-4 flex-1">
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                              plan.highlight ? "bg-blue-50 dark:bg-blue-600/20" : "bg-slate-50 dark:bg-white/5"
                            }`}
                          >
                            <Check
                              size={12}
                              className={
                                plan.highlight
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-slate-400 dark:text-gray-500"
                              }
                              strokeWidth={4}
                            />
                          </div>
                          <span
                            className={`${montserrat.className} text-[13px] font-bold text-slate-600 dark:text-gray-300`}
                          >
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 flex flex-wrap items-center justify-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-600"
        >
          <span className="flex items-center gap-2">🛡️ 30-day money-back</span>
          <span>·</span>
          <span className="flex items-center gap-2">💳 No hidden fees</span>
          <span>·</span>
          <Link
            href="/billing"
            className="text-blue-600 dark:text-blue-400 hover:opacity-70 font-black transition-all"
          >
            Manage Billing →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
