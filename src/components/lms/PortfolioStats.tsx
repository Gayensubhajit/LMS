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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {statItems.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * idx }}
          className="relative group"
        >
          <div className="relative bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.02]">
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">
              {item.value}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {item.label}
            </div>
            
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity -z-10 ${item.bg}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
