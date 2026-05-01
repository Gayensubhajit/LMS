"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveLeft, Rocket, Home } from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#030712] transition-colors duration-700 flex flex-col">
      <Navbar />
      
      <main className={`${montserrat.className} flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6 pt-20`}>
        {/* Futuristic Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 dark:bg-violet-600/10 rounded-full blur-[120px] -z-0" />
        <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -z-0 animate-pulse" />
        
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-8 relative inline-block"
          >
            <span className="text-[180px] md:text-[240px] font-black leading-none bg-linear-to-b from-blue-600 to-indigo-700 dark:from-violet-500 dark:to-purple-800 bg-clip-text text-transparent opacity-20 dark:opacity-30 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Rocket size={100} className="text-blue-600 dark:text-violet-500 drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight"
          >
            Lost in Space?
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 dark:text-gray-400 text-lg max-w-md mx-auto mb-10 font-medium"
          >
            The page you're looking for has drifted out of orbit. Don't worry, even the best pioneers get lost sometimes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.05] transition-all"
            >
              <Home size={16} /> Back to Base
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-white/5 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all"
            >
              <MoveLeft size={16} /> Go Back
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
