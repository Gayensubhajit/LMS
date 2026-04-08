"use client";

import { Clock, CheckCircle2 } from "lucide-react";
import { aiRoadmapData } from "@/lib/roadmap-data";

export default function RoadmapTimeline() {
  return (
    <div className="relative py-8">
      {/* Vertical Line */}
      <div className="absolute left-6 sm:left-12 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

      <div className="space-y-12">
        {aiRoadmapData.map((phase) => {
          const Icon = phase.icon;

          return (
            <div key={phase.month} className="relative flex items-start gap-6 sm:gap-10 group">
              {/* Node on the line */}
              <div className="absolute left-6 sm:left-12 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#030712] bg-white dark:bg-[#111827] shadow-sm z-10 transition-colors group-hover:border-indigo-50 dark:group-hover:border-indigo-900/30">
                <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              </div>

              {/* Content Box */}
              <div className="pl-16 sm:pl-24 w-full">
                <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {phase.month}
                      </span>
                      {phase.duration && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-gray-500 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 uppercase tracking-tight">
                          <Clock size={10} /> {phase.duration}
                        </span>
                      )}
                    </div>
                    {/* Month Skills Badge Row */}
                    <div className="flex flex-wrap gap-2">
                       {phase.skills?.map((skill, sIdx) => (
                         <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 uppercase tracking-tighter">
                            {skill}
                         </span>
                       ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {phase.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                    {phase.description}
                  </p>

                  <div className="space-y-3 max-w-2xl">
                    {phase.topics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-transparent hover:border-slate-200 dark:hover:border-white/5 transition-colors">
                        <div className="p-1 rounded-md bg-white dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/10 shrink-0">
                           <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                           {topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
