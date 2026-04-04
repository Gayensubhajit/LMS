"use client";

import { useUser } from "@clerk/nextjs";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Award,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Total Students", value: "1,284", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Active Courses", value: "12", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Revenue", value: "$12,450", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Certificates", value: "482", icon: Award, color: "text-amber-400", bg: "bg-amber-400/10" },
];

export default function AdminPage() {
  const { user } = useUser();

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-700 dark:text-white tracking-tight mb-2">
            Welcome back, <span className="text-blue-600 dark:text-blue-500">{user?.firstName}</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest text-xs">
            Instructor Dashboard • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl backdrop-blur-xl shadow-sm dark:shadow-none">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-400/50" />
          <span className="text-[10px] font-black text-slate-500 dark:text-gray-300 uppercase tracking-[0.2em]">Live Insights Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-none"
            >
              <div className={`relative z-10 w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              
              <p className="relative z-10 text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="relative z-10 text-2xl font-black text-slate-700 dark:text-white mb-2">{stat.value}</h3>
              
              <div className="relative z-10 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-500 font-bold">
                <ArrowUpRight size={14} />
                +12.5% <span className="text-slate-500 dark:text-gray-600 font-medium ml-1">this month</span>
              </div>

              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full" />
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Quick Actions / Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-700 dark:text-white tracking-tight">Recent Activity</h2>
            <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-white uppercase tracking-widest transition-colors">View All Logs</button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 overflow-hidden divide-y divide-slate-100 dark:divide-white/5 shadow-sm dark:shadow-none">
            {[
              { type: "enrollment", msg: "New student enrolled in 'React Mastery'", time: "2m ago" },
              { type: "review", msg: "5.0 rating received for 'UI/UX Design'", time: "45m ago" },
              { type: "lesson", msg: "Lesson 'Introduction' published in 'Next.js 15'", time: "2h ago" },
              { type: "purchase", msg: "Premium plan purchased by user_7392", time: "5h ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-150 transition-transform" />
                  <p className="text-sm font-bold text-slate-700 dark:text-gray-300">{activity.msg}</p>
                </div>
                <span className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-700 dark:text-white tracking-tight px-2">AI Insights</h2>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 dark:from-blue-600/20 to-transparent border border-blue-200 dark:border-blue-500/10 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <Users className="text-white" size={20} />
              </div>
              <div className="text-4xl font-black text-slate-700 dark:text-white mb-1">1,280</div>
              <div className="text-sm text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest mb-4">Total Users</div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400 leading-relaxed mb-8">
                Students are spending 45% more time on the SQL module. Consider adding a specialized workshop for this topic.
              </p>
              <button className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-sm dark:shadow-none">
                Generate Report
              </button>
            </div>
            {/* Background Glow */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/20 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
