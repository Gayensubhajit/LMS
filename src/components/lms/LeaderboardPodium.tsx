"use client";

import { motion } from "framer-motion";
import { Trophy, Crown, Medal } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string | null;
  xp: number;
  level: number;
}

interface Props {
  topThree: LeaderboardUser[];
}

const LeaderboardPodium = ({ topThree }: Props) => {
  // Sort into podium order: [2, 1, 3]
  const podiumOrder = [
    topThree.find(u => u.rank === 2),
    topThree.find(u => u.rank === 1),
    topThree.find(u => u.rank === 3),
  ].filter(Boolean) as LeaderboardUser[];

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-6 mb-16 px-4 pt-10">
      {podiumOrder.map((user) => {
        const isFirst = user.rank === 1;
        const isSecond = user.rank === 2;
        const isThird = user.rank === 3;

        const height = isFirst ? "h-48 sm:h-64" : isSecond ? "h-36 sm:h-48" : "h-28 sm:h-40";
        const color = isFirst ? "from-yellow-400 to-amber-600" : isSecond ? "from-slate-300 to-slate-400" : "from-amber-700 to-orange-800";
        const icon = isFirst ? <Crown className="text-yellow-400" size={32} /> : isSecond ? <Medal className="text-slate-300" size={28} /> : <Medal className="text-amber-700" size={24} />;

        return (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: user.rank * 0.1, type: "spring", stiffness: 100 }}
            className="flex flex-col items-center group relative"
          >
            {/* Crown/Medal */}
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>

            {/* Avatar Circle */}
            <div className={`relative mb-4 p-1 rounded-full bg-gradient-to-b ${color} shadow-lg`}>
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#08081a] overflow-hidden border-2 border-[#08081a]">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover shadow-inner" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-2xl text-slate-500">
                    {user.name[0]}
                  </div>
                )}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${color} border-2 border-white dark:border-[#08081a] flex items-center justify-center font-black text-xs text-white`}>
                {user.rank}
              </div>
            </div>

            {/* Name and XP */}
            <div className="text-center mb-4">
              <h4 className="font-black text-sm sm:text-lg text-slate-900 dark:text-white truncate max-w-[100px] sm:max-w-[150px]">
                {user.name}
              </h4>
              <p className="text-[10px] sm:text-xs font-bold text-indigo-500 uppercase tracking-widest">
                {user.xp.toLocaleString()} XP
              </p>
            </div>

            {/* Podium Block */}
            <div className={`${height} w-24 sm:w-32 bg-gradient-to-b ${color} rounded-t-3xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center border-t border-white/20`}>
               <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
               <div className="relative z-10 flex flex-col items-center">
                  <span className="text-4xl sm:text-6xl font-black text-white/20">#{user.rank}</span>
               </div>
               
               {/* Shine effect */}
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LeaderboardPodium;
