"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import RoadmapTimeline from "@/components/lms/RoadmapTimeline";
import { Sparkles, ArrowRight, BookOpen, Clock, Target, Globe, MousePointer2 } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function AIRoadmapPage() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => setMounted(true), []);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white selection:bg-indigo-500/30 transition-colors duration-300 ${montserrat.className}`}>
      {/* Sticky Top Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-[100] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse capitalize" />
      </div>
      
      <main className="flex-1 pt-32 pb-40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Enhanced Hero Section */}
          <div className="relative flex flex-col items-center text-center max-w-5xl mx-auto mb-32 pt-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Premium Career Track 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
            >
              The Architect of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Artificial Intelligence</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-2xl text-slate-500 dark:text-gray-400 leading-relaxed mb-12 max-w-3xl font-medium"
            >
              A structured, industry-vetted 12-step curriculum taking you from standard Python to deploying autonomous, production-ready AI systems.
            </motion.p>

            {/* Premium Interactive Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-16"
            >
              {[
                { icon: Clock, label: "7 Months", sub: "Estimated Time" },
                { icon: BookOpen, label: "46 Lessons", sub: "Core Curriculum" },
                { icon: Target, label: "Job Ready", sub: "Career Goal" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/50 dark:bg-white/[0.03] backdrop-blur-md px-6 py-4 rounded-[1.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                    <stat.icon className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{stat.label}</div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">{stat.sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <Link 
                href="/courses/ai-engineering-roadmap" 
                className="group h-16 bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 inline-flex items-center justify-center rounded-[1.25rem] px-10 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-slate-900/20 dark:shadow-white/10"
              >
                Start Learning <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="https://github.com/alexeygrigorev/ai-engineering-field-guide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-16 bg-white dark:bg-white/[0.05] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 inline-flex items-center justify-center rounded-[1.25rem] px-10 text-xs font-black uppercase tracking-[0.2em] transition-all border border-slate-200 dark:border-white/10"
              >
                Source Guide <Globe className="ml-3 w-5 h-5" />
              </a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-20 flex flex-col items-center gap-2 text-slate-300 dark:text-gray-700"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Scroll to Explore</span>
              <MousePointer2 size={24} className="rotate-[225deg]" />
            </motion.div>
          </div>

          {/* New Timeline Integration Section */}
          <div className="relative">
            {/* Background Path Line (for continuity from hero) */}
            <div className="absolute top-[-100px] left-6 sm:left-12 w-1 sm:w-1.5 h-32 bg-gradient-to-t from-slate-100 dark:from-white/5 to-transparent rounded-full" />
            
            <div className="max-w-5xl mx-auto">
              <RoadmapTimeline />
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
