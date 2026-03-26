'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Shield, 
  Zap, 
  Map, 
  Code, 
  Palette, 
  Users, 
  Star,
  Award,
  Fingerprint
} from 'lucide-react';

export default function PioneerPassport() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const skills = [
    { name: 'Strategy', level: 85, icon: Map, color: 'text-sky-400' },
    { name: 'Engineering', level: 92, icon: Code, color: 'text-violet-400' },
    { name: 'Design', level: 78, icon: Palette, color: 'text-pink-400' },
  ];

  const badges = [
    { title: 'Early Explorer', icon: Star, color: 'from-amber-400 to-orange-500' },
    { title: 'Code Pioneer', icon: Award, color: 'from-violet-500 to-purple-600' },
    { title: 'Community Hero', icon: Users, color: 'from-sky-400 to-blue-500' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-[#080a10] border-y border-white/[0.05] w-full">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter mb-3 sm:mb-4">
          Your Pioneer <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500 italic">Legacy</span>
        </h2>
        <p className="text-gray-500 text-[10px] sm:text-sm max-w-[280px] sm:max-w-md mx-auto leading-relaxed">
          Every lesson, every challenge, every victory—immortalized in your digital passport.
        </p>
      </div>

      <div 
        className="relative w-full max-w-[340px] h-[480px] cursor-pointer group perspective-1000"
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-full transition-all duration-700 transform-style-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden ring-1 ring-white/10 rounded-[32px] overflow-hidden bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-sky-600/20 opacity-50" />
            
            {/* Passport Header */}
            <div className="relative p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="text-violet-400" size={20} />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">EduNova Pioneer ID</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[8px] font-bold text-violet-400">
                VERIFIED PIONEER
              </div>
            </div>

            {/* Profile Section */}
            <div className="relative pt-8 px-8 flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 p-[2px] shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pioneer77" 
                      alt="Pioneer Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#080a10] border border-white/10 flex items-center justify-center text-amber-400 shadow-xl">
                  <Trophy size={14} />
                </div>
              </div>

              <div className="text-center mt-6 px-4">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">C. Subhajit Gayen</h3>
                <p className="text-[9px] sm:text-[10px] font-medium text-violet-400 uppercase tracking-widest mt-1">Stellar Voyager • Rank 14</p>
              </div>

              {/* Stats Bar */}
              <div className="w-full mt-8 space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-tighter">
                    <span>XP Progress</span>
                    <span className="text-white">7,842 / 10,000</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[8px] font-bold text-gray-500 uppercase">Courses</p>
                    <p className="text-lg font-black text-white">12</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[8px] font-bold text-gray-500 uppercase">Projects</p>
                    <p className="text-lg font-black text-white">08</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-violet-500 via-pink-500 to-sky-500 opacity-30" />
            
            <div className="absolute bottom-4 inset-x-0 flex justify-center opacity-20 group-hover:opacity-100 transition-opacity">
               <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <Fingerprint size={10} /> Click to Scan Passport
               </span>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden ring-1 ring-white/10 rounded-[32px] overflow-hidden bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotateY-180">
             <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-violet-600/10 to-transparent" />
             
             <div className="relative p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 px-2">
                  <h4 className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest">Skill Metrics</h4>
                  <Zap className="text-sky-400 animate-pulse" size={14} />
                </div>

                {/* Skills Scroll */}
                <div className="space-y-6">
                  {skills.map((skill, i) => (
                    <div key={i} className="group/skill">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <skill.icon size={14} className={skill.color} />
                          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tighter">{skill.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-white">{skill.level}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r from-white/20 to-${skill.color.split('-')[1]}-500`}
                          initial={{ width: 0 }}
                          animate={{ width: isFlipped ? `${skill.level}%` : 0 }}
                          transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                   <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Mastery Badges</h4>
                   <div className="flex justify-around">
                      {badges.map((badge, i) => (
                        <div key={i} className="group/badge relative">
                           <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} p-[1px] transform rotate-12 group-hover/badge:rotate-0 transition-transform duration-300`}>
                              <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                                 <badge.icon size={20} className="text-white" />
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mt-8 text-center flex flex-col items-center">
                  <div className="w-24 h-6 bg-white/5 rounded-full border border-white/10 flex items-center justify-center px-3 mb-2">
                     <div className="flex gap-1">
                        {[1,2,3,4,5,6,7].map(j => <div key={j} className="w-1.5 h-1.5 rounded-full bg-white/10" />)}
                     </div>
                  </div>
                  <p className="text-[7px] font-medium text-gray-600 uppercase tracking-widest">Issued via EduNova Alpha Protocol</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 animate-bounce opacity-50">
        <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Interact with card</p>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotateY-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
