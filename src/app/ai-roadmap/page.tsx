"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import RoadmapTimeline from "@/components/lms/RoadmapTimeline";
import { Sparkles, ArrowRight, BookOpen, Clock, Target, Globe } from "lucide-react";

export default function AIRoadmapPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white selection:bg-indigo-500/30 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Minimal Hero Header Section */}
          <div className="text-center max-w-4xl mx-auto mb-20 pt-8 mt-10">
            {mounted && (
              <div className="flex items-center justify-center gap-2 mb-6 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Sparkles className="w-4 h-4" />
                <span>Premium Path</span>
              </div>
            )}
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
              The Ultimate AI Engineering Roadmap
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              A structured 7-month curriculum taking you from standard Python to deploying autonomous, production-ready AI systems.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
              <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <Clock className="text-slate-500 dark:text-slate-400 w-4 h-4" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">7 Months</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <BookOpen className="text-slate-500 dark:text-slate-400 w-4 h-4" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">40+ Core Topics</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <Target className="text-slate-500 dark:text-slate-400 w-4 h-4" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job-Ready</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="h-12 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 inline-flex items-center justify-center rounded-xl px-8 text-sm font-bold transition-colors shadow-sm">
                Start Learning <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <a 
                href="https://github.com/alexeygrigorev/ai-engineering-field-guide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-12 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 inline-flex items-center justify-center rounded-xl px-8 text-sm font-bold transition-colors border border-slate-200 dark:border-white/10"
              >
                View Source Guide <Globe className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Minimal Timeline UI */}
          <div className="max-w-3xl mx-auto">
            <RoadmapTimeline />
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
