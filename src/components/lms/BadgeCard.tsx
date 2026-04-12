"use client";

import { motion } from "framer-motion";
import { Award, Lock, Sparkles, Trophy, Zap, Star, ShieldCheck, Target } from "lucide-react";

interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon?: string;
  };
  earnedAt?: string | null;
  isUnlocked: boolean;
}

const BADGE_ICONS: Record<string, any> = {
  "Quick Starter": Zap,
  "Quiz Master": Target,
  "Course Finisher": Trophy,
  "Streaker": Sparkles,
  "Roadmap Voyager": ShieldCheck,
  "default": Award
};

const BADGE_COLORS: Record<string, string> = {
  "Quick Starter": "from-amber-400 to-orange-600",
  "Quiz Master": "from-emerald-400 to-teal-600",
  "Course Finisher": "from-blue-400 to-indigo-600",
  "Streaker": "from-pink-400 to-rose-600",
  "Roadmap Voyager": "from-violet-400 to-purple-600",
  "default": "from-slate-400 to-slate-600"
};

export default function BadgeCard({ badge, earnedAt, isUnlocked }: BadgeCardProps) {
  if (!badge || !badge.name) return null;
  
  const Icon = BADGE_ICONS[badge.name] || BADGE_ICONS.default;
  const colorScale = BADGE_COLORS[badge.name] || BADGE_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      className="relative group h-full"
    >
      <div className={`
        relative h-full bg-white dark:bg-slate-900/40 backdrop-blur-xl border rounded-[2rem] p-6 flex flex-col items-center text-center transition-all duration-500
        ${isUnlocked 
          ? "border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none" 
          : "border-slate-100 dark:border-white/5 opacity-60 grayscale-[0.5]"}
      `}>
        {/* Glow Background */}
        {isUnlocked && (
          <div className={`absolute -inset-1 bg-gradient-to-br ${colorScale} rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity`} />
        )}

        {/* Icon Container */}
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6
          ${isUnlocked 
            ? `bg-gradient-to-br ${colorScale} text-white shadow-lg` 
            : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600"}
        `}>
          {isUnlocked ? (
            <>
              <Icon className="w-8 h-8" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl border-2 border-white/20"
              />
            </>
          ) : (
            <Lock className="w-8 h-8 opacity-40 shrink-0" />
          )}
        </div>

        {/* Badge Name */}
        <h4 className={`text-base font-black mb-1 uppercase tracking-tight leading-tight ${isUnlocked ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-600"}`}>
          {badge.name}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-4 line-clamp-2">
          {badge.description}
        </p>

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 w-full">
          {isUnlocked ? (
            <div className="flex items-center justify-center gap-1.5">
              <Star className="w-3 h-3 text-amber-500 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Earned {earnedAt ? new Date(earnedAt).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-700 italic">
              Legacy Locked
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
