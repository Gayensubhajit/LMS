"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ActivityHeatmap() {
  // Generate mock data for the last 12 months (roughly 52 weeks)
  const generateMockData = () => {
    const data = [];
    for (let i = 0; i < 365; i++) {
      // Random activity level: 0 to 4
      const level = Math.floor(Math.random() * 5);
      data.push(level);
    }
    return data;
  };

  const activityData = generateMockData();
  
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-slate-100 dark:bg-white/5";
      case 1: return "bg-emerald-200 dark:bg-emerald-900/30";
      case 2: return "bg-emerald-400 dark:bg-emerald-700/50";
      case 3: return "bg-emerald-500 dark:bg-emerald-500/70";
      case 4: return "bg-emerald-600 dark:bg-emerald-400";
      default: return "bg-slate-100 dark:bg-white/5";
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em]">
          Learning Consistency
        </h4>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-gray-500 uppercase">Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`w-2.5 h-2.5 rounded-[2px] ${getLevelColor(l)}`} />
          ))}
          <span className="text-[9px] font-bold text-gray-500 uppercase ml-1">More</span>
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 shrink-0">
            {activityData.map((level, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.001 }}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] ${getLevelColor(level)} transition-colors hover:ring-2 hover:ring-emerald-500/50 cursor-pointer`}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-slate-900 text-white border-white/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                  {level > 0 ? `${level * 25} XP earned` : "No activity"} on day {i + 1}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>
      
      <div className="mt-4 flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">
        <span>May 2025</span>
        <span>Aug 2025</span>
        <span>Nov 2025</span>
        <span>Feb 2026</span>
        <span>May 2026</span>
      </div>
    </div>
  );
}
