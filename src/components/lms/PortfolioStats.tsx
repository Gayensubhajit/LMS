"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Zap, Target, Award } from "lucide-react";

interface PortfolioStatsProps {
  stats: {
    totalBadges: number;
    totalCertificates: number;
    totalXp: number;
    rank: number | string;
  };
}

export default function PortfolioStats({ stats }: PortfolioStatsProps) {
  const statItems = [
    {
      label: "Mastery XP",
      value: stats.totalXp.toLocaleString(),
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Global Rank",
      value: `#${stats.rank}`,
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Certificates",
      value: stats.totalCertificates,
      icon: Award,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Medals Earned",
      value: stats.totalBadges,
      icon: Trophy,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {statItems.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * idx }}
          className="relative group"
        >
          <div className="relative bg-white dark:bg-slate-900 shadow-sm hover:shadow-md border border-slate-200/50 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300">
            <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <div className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1 uppercase tracking-tight">
                {item.value}
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {item.label}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
