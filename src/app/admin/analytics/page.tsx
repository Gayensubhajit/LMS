"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  MoreVertical,
  BookOpen
} from "lucide-react";
import { backendRequest } from "@/lib/backend-client";
import { useUser } from "@clerk/nextjs";

export default function AdminAnalyticsPage() {
  const { user } = useUser();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    backendRequest("/admin/analytics/overview").then((res: any) => {
      if (res.ok) {
        setData(res);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08080f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Total Revenue", value: `$${data?.stats.totalRevenue.toLocaleString()}`, icon: CreditCard, change: "+12.5%", isUp: true },
    { label: "Total Students", value: data?.stats.totalUsers.toLocaleString(), icon: Users, change: "+5.2%", isUp: true },
    { label: "Active Enrollments", value: data?.stats.totalEnrollments.toLocaleString(), icon: BookOpen, change: "-1.4%", isUp: false },
    { label: "Avg. Course Value", value: "$49.00", icon: TrendingUp, change: "+0.8%", isUp: true },
  ];

  return (
    <main className="p-8 space-y-8 min-h-screen bg-[#08080f]">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
            Intelligence <span className="text-violet-500">Analytics</span>
          </h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">
            Platform performance & insight report
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={14} /> Export Report
          </button>
          <button className="px-4 py-2 bg-violet-600 rounded-xl text-xs font-bold text-white hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20">
            Real-time Feed
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 hover:border-violet-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${stat.isUp ? "text-emerald-400" : "text-rose-400"}`}>
                {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Top Performing Courses</h2>
              <button className="text-xs font-bold text-violet-400 hover:underline px-2">View All</button>
            </div>
            <div className="space-y-4">
              {data?.stats.topCourses.map((course: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-violet-500/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 font-black">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-white">{course.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{course.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{course.enrollments}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Enrollments</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sales Table */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Recent Transactions</h2>
              <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500" placeholder="Search sales..." />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-4">
                    <th className="pb-4">Student</th>
                    <th className="pb-4">Course</th>
                    <th className="pb-4 text-right">Amount</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.recentSales.map((sale: any, i: number) => (
                    <tr key={sale.id || i} className="group hover:bg-white/[0.01]">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                            {sale.user.avatarUrl ? <img src={sale.user.avatarUrl} alt={sale.user.fullName} className="w-full h-full object-cover" /> : null}
                          </div>
                          <span className="text-[11px] font-bold text-gray-300">{sale.user.fullName}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-[11px] font-bold text-gray-400">{sale.course.title}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-[11px] font-black text-emerald-400">${(sale.amountPaid / 100).toFixed(2)}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="p-2 text-gray-500 hover:text-white transition-colors">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
            <div className="bg-violet-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                <h3 className="text-xl font-black italic tracking-tight uppercase mb-2">Growth Target</h3>
                <p className="text-xs text-violet-200 font-medium mb-6">You've reached 84% of your monthly goal.</p>
                <div className="h-2 bg-black/20 rounded-full mb-6">
                    <div className="h-full bg-white rounded-full w-[84%]" />
                </div>
                <button className="w-full py-3 bg-white text-violet-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-violet-50 transition-colors">
                    Upgrade Strategy
                </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Active Now</h3>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <div className="flex-1">
                                <p className="text-[11px] font-bold text-gray-300">Live Lesson: React Patterns</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">42 Students active</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
