"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Zap, Star } from "lucide-react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import confetti from "canvas-confetti";

export interface XpEarnedToastRef {
  show: (amount: number, message?: string, type?: "xp" | "badge") => void;
}

const XpEarnedToast = forwardRef<XpEarnedToastRef>((_, ref) => {
  const [items, setItems] = useState<{ id: number, amount: number, message: string, type: string }[]>([]);

  useImperativeHandle(ref, () => ({
    show: (amount, message = "Mission Progress!", type = "xp") => {
      const id = Date.now();
      setItems(prev => [...prev, { id, amount, message, type }]);
      
      if (type === "badge" || amount >= 100) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.9, x: 0.8 },
          colors: ["#2563eb", "#06b6d4", "#f97316"]
        });
      }

      setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== id));
      }, 5000);
    }
  }));

  return (
    <div className="fixed bottom-24 right-8 z-[70] pointer-events-none flex flex-col items-end gap-3">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 100, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)", transition: { duration: 0.2 } }}
            className="pointer-events-auto"
          >
            <div className={`
                flex items-center gap-4 px-6 py-5 rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] border backdrop-blur-2xl relative overflow-hidden
                ${item.type === "badge" 
                  ? "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400" 
                  : "bg-blue-600/10 border-blue-500/20 text-blue-600 dark:text-blue-400"}
              `}>
              <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
                  ${item.type === "badge" 
                    ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white" 
                    : "bg-gradient-to-br from-blue-600 to-teal-500 text-white"}
                `}>
                {item.type === "badge" ? <Trophy size={24} /> : <Zap size={24} fill="currentColor" />}
              </div>
              
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-70">
                  {item.message}
                </p>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-black tracking-tight leading-none">
                    {item.type === "badge" ? "NEW ACHIEVEMENT!" : `+${item.amount} XP`}
                  </h4>
                  {item.type === "xp" && (
                     <div className="flex gap-0.5">
                        <Star size={12} fill="currentColor" className="text-yellow-500 animate-pulse" />
                        <Star size={12} fill="currentColor" className="text-yellow-500 animate-pulse [animation-delay:0.2s]" />
                     </div>
                  )}
                </div>
              </div>

              {/* Decorative sparkles */}
              <div className="absolute -top-1 -right-1">
                 <Sparkles size={16} className="text-yellow-400 animate-bounce" />
              </div>
              
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-600 opacity-20" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

XpEarnedToast.displayName = "XpEarnedToast";

export default XpEarnedToast;
