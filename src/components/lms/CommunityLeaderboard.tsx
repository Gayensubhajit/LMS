"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Trophy, Zap, Users, Star, ArrowUpRight, TrendingUp } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const leaderboardData = [
  { id: 1, name: "Alex Rivera", level: 42, xp: 12450, badge: "Grandmaster", avatar: "AR", color: "from-amber-400 to-orange-500" },
  { id: 2, name: "Sarah Chen", level: 38, xp: 10200, badge: "Pioneer", avatar: "SC", color: "from-violet-400 to-purple-600" },
  { id: 3, name: "Marcus Thorne", level: 35, xp: 9800, badge: "Expert", avatar: "MT", color: "from-blue-400 to-cyan-500" },
  { id: 4, name: "Elena Volkov", level: 31, xp: 8500, badge: "Rising Star", avatar: "EV", color: "from-emerald-400 to-teal-500" },
];

const mockActivities = [
  { user: "Jamie L.", action: "started", target: "Interactive Labs", time: "2m ago" },
  { user: "Priya S.", action: "unlocked", target: "AI Specialist", time: "5m ago" },
  { user: "Tom K.", action: "completed", target: "Roadmap Builder", time: "12m ago" },
  { user: "Lee M.", action: "joined", target: "Live Stream", time: "15m ago" },
  { user: "Emma D.", action: "mastered", target: "UI/UX Deep Dive", time: "22m ago" },
];

export default function CommunityLeaderboard() {
  const [activities, setActivities] = useState(mockActivities);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities((prev) => {
        const last = prev[prev.length - 1];
        return [last, ...prev.slice(0, prev.length - 1)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`${montserrat.className} relative py-24 px-6 overflow-hidden`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Leaderboard Rankings */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Trophy size={20} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Pioneer Rankings</h2>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Global Hall of Fame</p>
              </div>
            </div>

            <div className="space-y-4">
              {leaderboardData.map((pioneer, i) => (
                <motion.div
                  key={pioneer.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center gap-4"
                >
                  {/* Rank Number */}
                  <div className="text-lg font-black text-gray-700 group-hover:text-violet-400/50 transition-colors w-6">
                    {i + 1}
                  </div>
                  
                  {/* Avatar Case */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pioneer.color} p-[1px]`}>
                    <div className="w-full h-full rounded-xl bg-[#080a10] flex items-center justify-center font-bold text-white text-sm">
                      {pioneer.avatar}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm tracking-tight">{pioneer.name}</h4>
                    <span className="text-[10px] text-violet-400 font-black uppercase tracking-tighter bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                      {pioneer.badge}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end text-white font-bold text-xs">
                      <Zap size={10} className="text-amber-400" />
                      LVL {pioneer.level}
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium">
                      {pioneer.xp.toLocaleString()} XP
                    </div>
                  </div>
                  
                  {/* Arrow on hover */}
                  <ArrowUpRight size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Live Activity Ticker */}
          <div className="lg:w-1/3">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <TrendingUp size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Live Activity</h2>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Real-time pulse</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live</span>
              </div>
            </div>

            <div className="relative h-[400px] overflow-hidden glass-card rounded-3xl p-6 border-emerald-500/10">
              {/* Fade masks */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#080a10] to-transparent z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#080a10] to-transparent z-10" />
              
              <div className="space-y-6 pt-10">
                <AnimatePresence mode="popLayout">
                  {activities.map((act, i) => (
                    <motion.div
                      key={`${act.user}-${i}`}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-start gap-4 border-l-2 border-white/5 pl-4 py-1"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 leading-snug">
                          <span className="text-white font-bold">{act.user}</span>{" "}
                          <span className="text-gray-500">{act.action}</span>{" "}
                          <span className="text-violet-400 font-semibold">{act.target}</span>
                        </p>
                        <span className="text-[10px] text-gray-600 font-medium">{act.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="mt-8 text-center p-6 border border-white/5 rounded-2xl bg-white/[0.01]">
               <Users className="size-5 text-violet-400 mx-auto mb-3" />
               <p className="text-xs text-gray-500">Join <span className="text-white font-bold">1,240</span> other pioneers learning right now.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
