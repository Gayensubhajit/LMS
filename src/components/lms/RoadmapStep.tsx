"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { RoadmapPhase, RoadmapIconMap } from "@/lib/roadmap-types";

interface RoadmapStepProps {
  phase: RoadmapPhase;
  index: number;
  isCompleted?: boolean;
  isActive?: boolean;
}

export default function RoadmapStep({ phase, index, isCompleted, isActive }: RoadmapStepProps) {
  // Handle both component icons (static data) and string icons (AI data)
  const Icon = typeof phase.icon === 'string' ? (RoadmapIconMap[phase.icon] || RoadmapIconMap.Code2) : phase.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      className="relative flex items-start gap-6 sm:gap-12 group"
    >
      {/* Node on the line */}
      <div className="absolute left-6 sm:left-12 transform -translate-x-1/2 z-20">
        <motion.div 
          whileHover={{ scale: 1.2 }}
          className={`relative flex items-center justify-center w-12 h-12 rounded-2xl border-4 transition-all duration-500 shadow-xl ${
            isCompleted 
              ? "bg-emerald-500 border-emerald-100 dark:border-emerald-500/30 text-white" 
              : isActive 
                ? "bg-indigo-600 border-indigo-100 dark:border-indigo-600/30 text-white animate-pulse" 
                : "bg-white dark:bg-[#0f172a] border-slate-100 dark:border-slate-800 text-slate-400 dark:text-gray-600"
          }`}
        >
          {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
          
          {/* Active Glow */}
          {isActive && (
            <div className="absolute inset-0 rounded-2xl bg-indigo-600/20 blur-xl animate-pulse" />
          )}
        </motion.div>
      </div>

      {/* Content Box */}
      <div className="pl-20 sm:pl-28 w-full">
        <motion.div 
          whileHover={{ y: -5, scale: 1.01 }}
          className={`relative bg-white/80 dark:bg-[#111827]/60 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 border transition-all duration-500 overflow-hidden ${
            isActive 
              ? "border-indigo-500/30 shadow-2xl shadow-indigo-500/10" 
              : "border-slate-200/60 dark:border-white/5 shadow-lg shadow-slate-200/20 dark:shadow-none"
          }`}
        >
          {/* Phase Accent Gradient */}
          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${phase.gradient} opacity-[0.03] dark:opacity-[0.07] blur-3xl -translate-y-20 translate-x-20 rounded-full group-hover:opacity-[0.1] transition-opacity`} />
          
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full ${
                isActive ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400"
              }`}>
                {phase.month}
              </span>
              {phase.duration && (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                  <Clock size={12} className="opacity-50" /> {phase.duration}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              {phase.skills.slice(0, 3).map((skill, si) => (
                <span key={si} className="hidden sm:inline-block text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5 text-slate-500 dark:text-gray-500 uppercase tracking-widest">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {phase.title}
            </h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-medium">
              {phase.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
              {phase.topics.map((topic, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-transparent group-hover:border-slate-100 dark:group-hover:border-white/5 transition-all"
                >
                  <div className={`p-1 rounded-lg shadow-sm border ${isActive ? "bg-indigo-600/10 border-indigo-500/20" : "bg-white dark:bg-white/3 border-slate-200 dark:border-white/5"}`}>
                    <CheckCircle2 size={12} className={isActive ? "text-indigo-500" : "text-emerald-500"} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-gray-400">
                    {topic.replace(/^\d+\.\s*/, "")}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/courses"
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5" 
                    : "bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100"
                }`}
              >
                Find Tutorials <ChevronRight size={14} />
              </Link>
              
              <button className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <GraduationCap size={16} /> Curated List
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
