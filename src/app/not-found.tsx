"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Home, ArrowLeft, Search, Bot } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function NotFound() {
  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-[#030712] flex items-center justify-center p-6 transition-colors duration-500 ${montserrat.className}`}>
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-2xl w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative inline-block"
        >
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 mx-auto rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-2xl">
            <Bot size={64} className="text-indigo-600 dark:text-indigo-400 animate-bounce" />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 text-amber-500"
          >
            <Sparkles size={32} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-7xl sm:text-9xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none">
            404
          </h1>
          <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 uppercase tracking-widest mb-6">
            Neural Path Disconnected
          </h2>
          <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-lg mb-12 max-w-lg mx-auto font-medium leading-relaxed">
            It seems our AI couldn't find the coordinates for this reality. The page might have been moved to a higher dimension or never existed at all.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="group w-full sm:w-auto h-16 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl px-10 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-2xl"
          >
            <Home size={18} />
            Back Home
          </Link>
          <Link
            href="/courses"
            className="group w-full sm:w-auto h-16 bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl px-10 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-white/10"
          >
            <Search size={18} />
            Search Courses
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 pt-8 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.4em]"
        >
          <span>System Status: 100% Operational</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </motion.div>
      </div>
    </main>
  );
}
