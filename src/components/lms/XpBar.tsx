"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Sparkles, Zap, ArrowUpCircle } from "lucide-react";
import { backendRequest } from "@/lib/backend-client";

interface GamificationData {
  xp: number;
  level: number;
  progressPercent: number;
  badges: any[];
}

export default function XpBar() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchGamification = async () => {
      try {
        const res = await backendRequest<{ ok: boolean, item: GamificationData }>("/gamification/me", {
          clerkUserId: user.id
        });
        if (res.ok) {
          setData(res.item);
        }
      } catch (err) {
        console.error("Failed to fetch gamification data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGamification();
    
    // Refresh XP every 30 seconds or when an event occurs (simplified poll for now)
    const interval = setInterval(fetchGamification, 30000);
    return () => clearInterval(interval);
  }, [isLoaded, user?.id]);

  if (loading || !data) return (
    <div className="h-16 w-full bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl" />
  );

  const xpInCurrentLevel = data.xp % 1000;
  const xpToNextLevel = 1000 - xpInCurrentLevel;
  const isNearLevelUp = xpToNextLevel <= 100;

  return (
    <div className="p-5 rounded-[2.5rem] bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm relative overflow-hidden group">
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-600 opacity-20 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]">
            <Zap size={20} fill="currentColor" className="animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 leading-none mb-1">Status: Level</p>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{data.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 leading-none mb-1">Total XP</p>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-xl font-black text-blue-600 dark:text-blue-400 leading-none tracking-tight">{data.xp}</span>
            <Sparkles size={14} className="text-blue-500 animate-[spin_4s_linear_infinite]" />
          </div>
        </div>
      </div>

      <div className="relative h-4 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/10 p-[2px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${data.progressPercent}%` }}
          transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }} 
          className="relative h-full bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-600 rounded-full shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite] w-full" />
        </motion.div>
      </div>
      
      <div className="flex justify-between mt-3 px-1 items-center">
        <span className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest leading-none">
          {xpInCurrentLevel} / 1000 XP
        </span>
        <AnimatePresence>
          {isNearLevelUp ? (
            <motion.div
              key="near-levelup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            >
              <ArrowUpCircle size={10} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {xpToNextLevel} XP to Level {data.level + 1}!
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="next-level"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1"
            >
              <span className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest leading-none">
                {xpToNextLevel} XP to Lv.{data.level + 1}
              </span>
              <ChevronRight size={10} className="text-slate-300 dark:text-gray-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
