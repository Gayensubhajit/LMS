"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Loader2,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { coursesData } from "@/lib/courses-data";

const SUBSCRIPTION_PLANS: Record<string, { title: string, emoji: string }> = {
  "plus": { title: "EduNova Plus", emoji: "🚀" },
  "annual": { title: "Plus Annual", emoji: "🌟" }
};

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const { isLoaded } = useUser();

  const slug = searchParams.get("slug");
  const plan = searchParams.get("plan");

  const [course, setCourse] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      const found = coursesData.find((c) => c.slug === slug);
      if (found) setCourse(found);
    } else if (plan && SUBSCRIPTION_PLANS[plan]) {
      setSubscription(SUBSCRIPTION_PLANS[plan]);
    }
  }, [slug, plan]);

  if (!isLoaded)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff] dark:bg-[#030712]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-[#030712] relative overflow-hidden transition-colors duration-700">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-6 py-24 relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-emerald-500/20"
        >
          <CheckCircle className="text-emerald-500" size={48} />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight"
        >
          Payment <span className="text-blue-600 dark:text-blue-500">Confirmed</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-16 max-w-lg mx-auto leading-relaxed"
        >
          Welcome to the next generation of learning. Your access has been provisioned and your journey begins now.
        </motion.p>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-10 rounded-[48px] bg-white dark:bg-white/3 border border-slate-200 dark:border-white/10 backdrop-blur-xl mb-12 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8 text-left">
            <div className="w-24 h-24 rounded-3xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-500/10">
              <span className="text-4xl">{course ? course.emoji : subscription?.emoji || "✨"}</span>
            </div>
            <div>
              <span className="text-[10px] font-black bg-blue-600/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20 mb-4 inline-block">Provisioned</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{course ? course.title : subscription?.title || "Plus Membership"}</h2>
              <p className="text-slate-400 dark:text-gray-500 font-bold text-sm">Enrollment ID: #{Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href={course ? `/learn/${course.slug}` : "/dashboard"}
            className="w-full sm:w-auto bg-[#0056D2] hover:bg-[#0041a3] text-white font-black px-12 py-5 rounded-2xl tracking-[0.2em] uppercase text-[12px] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
          >
            Start Learning <Zap size={16} />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto text-slate-400 dark:text-gray-500 hover:text-slate-900 font-black px-10 py-5 rounded-2xl tracking-[0.2em] uppercase text-[12px] transition-all border border-slate-200"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
