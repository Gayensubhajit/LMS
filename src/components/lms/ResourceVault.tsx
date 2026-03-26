"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Unlock, FileCode, Figma, Palette, Zap, Download, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const assets = [
  { title: "Celestial UI Kit", type: "Figma", size: "42MB", icon: Figma, color: "from-purple-500 to-pink-500" },
  { title: "Pioneer OS Source", type: "GitHub", size: "12MB", icon: FileCode, color: "from-blue-500 to-cyan-500" },
  { title: "Brand Assets V2", type: "Assets", size: "156MB", icon: Palette, color: "from-amber-500 to-orange-500" },
  { title: "Mastery Workbook", type: "PDF", size: "8MB", icon: ShieldCheck, color: "from-emerald-500 to-teal-500" },
];

export default function ResourceVault({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsUnlocked(true), 1200);
      return () => clearTimeout(timer);
    } else {
      setIsUnlocked(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#080a10]/95 backdrop-blur-2xl"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors z-[110]"
          >
            <X size={20} />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] bg-[#0d1117] rounded-[40px] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(124,58,237,0.1)]">
            
            {/* Vault Door Layers */}
            <AnimatePresence>
              {!isUnlocked && (
                <div className="absolute inset-0 z-50 flex">
                  {/* Left Door */}
                  <motion.div
                    initial={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}
                    className="flex-1 bg-[#0d1117] border-r border-white/10 flex items-center justify-end pr-10"
                  >
                    <div className="w-1 h-32 bg-gradient-to-b from-transparent via-violet-500/50 to-transparent" />
                  </motion.div>

                  {/* Right Door */}
                  <motion.div
                    initial={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}
                    className="flex-1 bg-[#0d1117] border-l border-white/10 flex items-center justify-start pl-10"
                  >
                    <div className="w-1 h-32 bg-gradient-to-b from-transparent via-violet-500/50 to-transparent" />
                  </motion.div>

                  {/* Center Lock Mechanism */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 1.5, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.8 }}
                      className="relative w-48 h-48 rounded-full border-8 border-white/5 bg-[#0d1117] flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.2)]"
                    >
                      <div className="absolute inset-4 rounded-full border-2 border-dashed border-violet-500/30 animate-[spin_20s_linear_infinite]" />
                      <div className="relative z-10 text-violet-400">
                        {isUnlocked ? <Unlock size={48} className="animate-pulse" /> : <Lock size={48} />}
                      </div>
                      <div className="absolute -bottom-10 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                        System Decrypting...
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Internal Content (The Vault) */}
            <div className="h-full flex flex-col p-10 md:p-16">
               <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Zap size={12} />
                    Premium Archives
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">The Digital Vault</h2>
                  <p className="text-gray-500 max-w-xl mt-4 text-sm md:text-base leading-relaxed">
                    Exclusive resources for pioneers. Download high-fidelity UI kits, 
                    source code, and industry-standard documentation.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scrollbar">
                  {assets.map((asset, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isUnlocked ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                      className="group relative p-6 rounded-3xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center gap-6"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${asset.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <asset.icon size={28} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg leading-tight mb-1">{asset.title}</h4>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{asset.type}</span>
                           <span className="w-1 h-1 rounded-full bg-gray-700" />
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{asset.size}</span>
                        </div>
                      </div>

                      <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-violet-500 hover:text-white hover:border-violet-500 transition-all">
                        <Download size={18} />
                      </button>
                    </motion.div>
                  ))}
               </div>
               
               <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                  <span>Vault Access: Level 10+ Required</span>
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    Secure Blockchain Verified
                  </span>
               </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
