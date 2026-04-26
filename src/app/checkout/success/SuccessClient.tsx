"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Sparkles, 
  Trophy,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { coursesData } from "@/lib/courses-data";
import confetti from "canvas-confetti";

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const plan = searchParams.get("plan");
  const [course, setCourse] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      const found = coursesData.find(c => c.slug === slug);
      if (found) setCourse(found);
    } else if (plan) {
      const plans: Record<string, any> = {
        plus: { title: "EduNova Plus", emoji: "🚀", category: "Full Access", period: "14-Day Free Trial" },
        annual: { title: "Plus Annual", emoji: "🌟", category: "Full Access", period: "14-Day Free Trial" },
        teams: { title: "Teams Starter", emoji: "👥", category: "Business", period: "Active Membership" },
        "teams-pro": { title: "Teams Pro", emoji: "🏢", category: "Enterprise", period: "Active Membership" }
      };
      setMembership(plans[plan] || plans.plus);
    }
  }, [slug, plan]);

  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    const frame = () => {
      // @ts-ignore
      confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#3b82f6", "#8b5cf6"] });
      // @ts-ignore
      confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#3b82f6", "#8b5cf6"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  if (!course && !membership) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff] dark:bg-[#030712]">
       <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-500 animate-spin" />
    </div>
  );

  const displayTitle = course ? course.title : membership.title;
  const displayEmoji = course ? course.emoji : membership.emoji;
  const displayCategory = course ? course.category : membership.category;
  const displayPeriod = course ? "Full Premium Access Unlocked" : (plan === "plus" || plan === "annual" ? "14-Day Free Trial Started" : "Active Membership");

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-[#030712] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative transition-colors duration-1000">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] pointer-events-none opacity-40 dark:opacity-20">
         <div className="absolute top-0 left-0 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/30 blur-[100px] rounded-full" />
         <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/30 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(16,185,129,0.2)] dark:shadow-[0_0_50px_rgba(16,185,129,0.3)] relative"
      >
        <CheckCircle2 className="text-white" size={48} />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-emerald-500 opacity-50"
        />
      </motion.div>

      <div className="space-y-4 max-w-2xl relative mb-12">
        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
          {membership ? "Membership" : "Payment"} <span className="text-blue-600 dark:text-blue-500">Activated!</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] leading-relaxed">
          Welcome to the elite circle of {displayCategory} experts.
        </p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-10 rounded-[56px] bg-white dark:bg-white/3 border border-slate-200 dark:border-white/10 backdrop-blur-3xl max-w-md w-full relative group overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none"
      >
         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
         <div className="flex flex-col items-center gap-8 relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-[#0a0a25] flex items-center justify-center text-5xl border border-slate-100 dark:border-white/5 shadow-inner">
               {displayEmoji}
            </div>
            <div className="space-y-3 px-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white px-2 tracking-tight line-clamp-2">{displayTitle}</h3>
              <p className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">{displayPeriod}</p>
            </div>

            <div className="flex items-center gap-6 pt-2">
               <div className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-amber-500 shadow-sm">
                    <Trophy size={20} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">Rewards</span>
               </div>
               <div className="w-10 h-px bg-slate-100 dark:bg-white/5" />
               <div className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-blue-500 shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">Premium</span>
               </div>
            </div>
         </div>
      </motion.div>

      <div className="mt-16 space-y-8 flex flex-col items-center relative">
        <Link 
          href={membership ? "/courses" : `/learn/${course?.slug}`}
          className="bg-slate-900 dark:bg-white text-white dark:text-black font-black py-6 px-12 rounded-[2.5rem] tracking-[0.2em] uppercase text-xs transition-all shadow-xl shadow-slate-900/10 dark:shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 group"
        >
          {membership ? <ArrowRight size={18} /> : <Play size={18} fill="currentColor" />}
          {membership ? "Explore Courses Now" : "Start Learning Now"}
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
        </Link>
        <div className="space-y-2">
          <p className="text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.3em] leading-relaxed">
            {membership ? "Membership active across all devices." : "Full access unlocked."}
          </p>
          <p className="text-[9px] font-bold text-slate-300 dark:text-gray-800 uppercase tracking-widest">
            Order Ref: {Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff] dark:bg-[#030712]">
         <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-500 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
