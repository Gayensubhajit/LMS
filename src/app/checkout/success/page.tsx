"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Sparkles, 
  Trophy,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { coursesData } from "@/lib/courses-data";
import { confetti } from "canvas-confetti";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug");
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      const found = coursesData.find(c => c.slug === slug);
      if (found) {
        setCourse(found);
      }
    }
  }, [slug]);

  useEffect(() => {
    // Trigger celebration
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      // @ts-ignore
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#7c3aed", "#a855f7"]
      });
      // @ts-ignore
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#7c3aed", "#a855f7"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050510]">
       <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-64 h-64 bg-violet-600/30 blur-[100px] rounded-full" />
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/30 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative"
      >
        <CheckCircle2 className="text-white" size={48} />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-emerald-500 opacity-50"
        />
      </motion.div>

      <div className="space-y-4 max-w-2xl relative">
        <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">Payment <span className="text-violet-500 text-glow">Successful!</span></h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs leading-relaxed">
          Welcome to the elite circle of {course.category} experts.
        </p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 p-10 rounded-[56px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl max-w-md w-full relative group overflow-hidden"
      >
         {/* Internal card highlight */}
         <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent pointer-events-none" />
         
         <div className="flex flex-col items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-[#0a0a25] flex items-center justify-center text-4xl border border-white/5 shadow-inner">
               {course.emoji}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white px-2 tracking-tight">{course.title}</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Full Premium Access Unlocked</p>
            </div>

            <div className="flex items-center gap-4 pt-4">
               <div className="flex flex-col items-center gap-1">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-amber-500">
                    <Trophy size={18} />
                  </div>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Rewards</span>
               </div>
               <div className="w-8 h-px bg-white/5" />
               <div className="flex flex-col items-center gap-1">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-violet-400">
                    <Sparkles size={18} />
                  </div>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Premium</span>
               </div>
            </div>
         </div>
      </motion.div>

      <div className="mt-12 space-y-6 flex flex-col items-center relative">
        <Link 
          href={`/learn/${course.slug}`}
          className="bg-white text-black font-black py-5 px-10 rounded-[2.5rem] tracking-[0.2em] uppercase text-xs transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 group"
        >
          <Play size={16} fill="black" />
          Start Learning Now
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
        </Link>
        
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-relaxed">
          A confirmation email has been sent. Order ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#050510]">
         <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
