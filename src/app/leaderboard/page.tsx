"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import LeaderboardCard from "@/components/lms/LeaderboardCard";
import LeaderboardPodium from "@/components/lms/LeaderboardPodium";
import GlobalActivity from "@/components/lms/GlobalActivity";
import { Trophy, Users, Star, Info, Loader2, Sparkles } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string | null;
  xp: number;
  level: number;
  isCurrent?: boolean;
}

export default function LeaderboardPage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await backendRequest<{ ok: boolean; leaderboard: LeaderboardUser[] }>("/gamification/leaderboard");
        if (res.ok) {
          // Identify the current user in the leaderboard
          const mapped = res.leaderboard.map(u => ({
            ...u,
            isCurrent: clerkUser?.fullName === u.name // Improved matching logic could be used here
          }));
          setLeaderboard(mapped);
        }
      } catch (err) {
        setError("Failed to load rankings");
      } finally {
        setLoading(false);
      }
    };

    if (isClerkLoaded) {
      fetchLeaderboard();
    }
  }, [clerkUser, isClerkLoaded]);

  const topThree = leaderboard.slice(0, 3);
  const remainingUsers = leaderboard.slice(3);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-[#f0f0ff] ${montserrat.className} transition-colors duration-300`}>
      <Navbar />

      <main className="flex-1 pt-32 pb-40 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-500 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-violet-500 blur-[120px] rounded-full animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-6"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Global Rankings 2026</span>
            </motion.div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 leading-tight">
              Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500">Leaderboard</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
              Celebrate the top minds in the EduNova community. Earn XP by completing lessons, quizzes, and projects to climb the global ranks.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col xl:flex-row gap-8 items-start">
            {/* Rankings Column */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                    <p className="text-sm font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">Calculating Standings...</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10 text-center"
                  >
                    <Info size={48} className="mx-auto mb-4 text-red-400" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
                    <p className="text-slate-500 dark:text-gray-400 mb-6">
                      {error}<br/>
                      <span className="text-[10px] opacity-50 font-mono mt-2 block">
                        API URL: {process.env.NEXT_PUBLIC_API_URL || "Fallback to Localhost"}
                      </span>
                    </p>
                    <button 
                       onClick={() => window.location.reload()}
                       className="px-8 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-all"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Podium Section */}
                    {topThree.length > 0 && <LeaderboardPodium topThree={topThree} />}

                    {/* List Header */}
                    <div className="flex items-center justify-between px-6 py-4 mb-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                        <Users size={12} />
                        <span>Next 47 Challengers</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                        XP Weightage: Lessons & Quizzes
                      </div>
                    </div>

                    {/* Ranking List */}
                    <div className="space-y-3">
                      {remainingUsers.map((user, idx) => (
                        <LeaderboardCard key={user.rank} user={user} index={idx} />
                      ))}
                      
                      {remainingUsers.length === 0 && topThree.length === 0 && (
                        <div className="p-20 text-center bg-white dark:bg-white/[0.02] rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/5">
                            <Trophy size={48} className="mx-auto mb-6 text-slate-300 dark:text-gray-800" />
                            <h3 className="text-lg font-bold text-slate-400 dark:text-gray-600">No one on the leaderboard yet.</h3>
                            <p className="text-sm text-slate-400 dark:text-gray-700 mt-2">Start a course to be the first!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Live Activity Sidebar */}
            <div className="w-full xl:w-96 shrink-0">
              <div className="sticky top-28 p-6 rounded-[2rem] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xl">
                <GlobalActivity />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
