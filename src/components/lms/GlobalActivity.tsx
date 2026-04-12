"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Trophy, 
  BookOpen, 
  Star, 
  Users, 
  Flame,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { backendRequest } from "@/lib/backend-client";

interface Activity {
  id: string;
  userName: string;
  userAvatar: string | null;
  type: string;
  text: string;
  createdAt: string;
}

interface PulseData {
  activeStudents: number;
  todayWins: number;
}

export default function GlobalActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pulse, setPulse] = useState<PulseData>({ activeStudents: 1, todayWins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await backendRequest<{ ok: boolean; feed: Activity[] }>("/gamification/activity");
        if (res.ok) {
          setActivities(res.feed);
        }
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPulse = async () => {
      try {
        const res = await backendRequest<{ ok: boolean } & PulseData>("/gamification/pulse");
        if (res.ok) {
          setPulse({ activeStudents: res.activeStudents, todayWins: res.todayWins });
        }
      } catch (err) {
        console.error("Failed to fetch pulse:", err);
      }
    };

    fetchActivity();
    fetchPulse();
    const interval = setInterval(() => {
      fetchActivity();
      fetchPulse();
    }, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "BADGE": return <Trophy className="w-4 h-4 text-amber-500" />;
      case "ENROLLMENT": return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "CERTIFICATE": return <Star className="w-4 h-4 text-emerald-500" />;
      case "RANK_UP": return <Flame className="w-4 h-4 text-rose-500" />;
      default: return <Zap className="w-4 h-4 text-indigo-500" />;
    }
  };

  if (loading && activities.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white leading-none">Global Pulse</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Activity</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
            {pulse.activeStudents} {pulse.activeStudents === 1 ? "Student" : "Students"} Live
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden border border-white dark:border-white/20 shadow-sm">
                      {activity.userAvatar ? (
                        <img src={activity.userAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-black text-xs">
                          {activity.userName[0]}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center shadow-sm">
                      {getIcon(activity.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {activity.userName}
                    </p>
                    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {activity.text}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waiting for activities...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
