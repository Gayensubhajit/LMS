"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Zap } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string | null;
  xp: number;
  level: number;
  isCurrent?: boolean;
}

interface Props {
  user: LeaderboardUser;
  index: number;
}

const LeaderboardCard = ({ user, index }: Props) => {
  const isTopThree = user.rank <= 3;
  
  const rankColors: Record<number, string> = {
    1: "from-yellow-400 to-amber-600 shadow-yellow-500/20",
    2: "from-slate-300 to-slate-500 shadow-slate-400/20",
    3: "from-amber-700 to-orange-900 shadow-amber-800/20",
  };

  const bgGradient = rankColors[user.rank] || "from-slate-700 to-slate-800";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative group p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border ${
        user.isCurrent 
          ? "bg-indigo-600/10 border-indigo-500/30 dark:bg-violet-600/10 dark:border-violet-500/30" 
          : "bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-violet-500/20"
      }`}
    >
      {/* Rank Badge */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 bg-gradient-to-br ${bgGradient} text-white shadow-lg`}>
        {isTopThree ? (
          <Trophy size={18} fill="currentColor" />
        ) : (
          user.rank
        )}
      </div>

      {/* Avatar */}
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 overflow-hidden">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-black text-slate-400 dark:text-gray-600">
            {user.name[0]}
          </div>
        )}
      </div>

      {/* Name and Level */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-900 dark:text-white truncate">
            {user.name}
            {user.isCurrent && (
              <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">You</span>
            )}
          </h4>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
            <Zap size={10} className="text-yellow-500" />
            Level {user.level}
          </div>
        </div>
      </div>

      {/* XP Stats */}
      <div className="text-right shrink-0">
        <p className="text-sm font-black text-slate-900 dark:text-white">{user.xp.toLocaleString()}</p>
        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-widest">Total XP</p>
      </div>

      {/* Decorative hover sparkle */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <TrendingUp size={12} className="text-indigo-500" />
      </div>

      {user.isCurrent && (
        <div className="absolute inset-0 border-2 border-indigo-500/20 dark:border-violet-500/20 rounded-2xl pointer-events-none" />
      )}
    </motion.div>
  );
};

export default LeaderboardCard;
