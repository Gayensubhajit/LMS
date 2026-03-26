'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import { 
  CreditCard, 
  History, 
  Compass, 
  Award, 
  ChevronRight, 
  ExternalLink,
  Zap,
  Star,
  Search,
  BookOpen,
  Monitor,
  Cpu,
  BrainCircuit,
  Globe
} from 'lucide-react';

export default function PurchasesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('subscriptions');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
    }
  } as const;

  const recentlyViewed = [
    { title: "English for Career Development", provider: "University of Pennsylvania", type: "Course", color: "from-amber-400 to-orange-500", iconPath: "M12 2L2 7l10 5 10-5-10-5z" },
    { title: "Applied Data Science Capstone", provider: "IBM", type: "Course", color: "from-sky-400 to-blue-500", iconPath: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" },
    { title: "Meta Full Stack Developer", provider: "Meta", type: "Specialization", color: "from-blue-600 to-indigo-600", iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { title: "Google AI Essentials", provider: "Google", type: "Professional Certificate", color: "from-red-500 to-yellow-500", iconPath: "M12 1v22M17 5H7M17 19H7M12 5l-5 5 5 5" }
  ];

  const freeCourses = [
    { title: "Computer Science: Programming", provider: "Princeton University", type: "Course", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&h=250&auto=format&fit=crop" },
    { title: "Fundamentals of AI", provider: "Stanford Online", type: "Course", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&h=250&auto=format&fit=crop" },
    { title: "Computer Architecture", provider: "Princeton University", type: "Course", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&h=250&auto=format&fit=crop" },
    { title: "Build Portfolio Website", provider: "EduNova", type: "Guided Project", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&h=250&auto=format&fit=crop" }
  ];

  const degrees = [
    { title: "Post Graduate Diploma in Applied Statistics", provider: "Indian Statistical Institute", level: "Master's Degree", color: "from-emerald-500 to-teal-600" },
    { title: "Bachelor of Science in Computer Science", provider: "Birla Institute of Technology", level: "Bachelor's Degree", color: "from-indigo-500 to-violet-600" },
    { title: "Bachelor of Science in Data Science & AI", provider: "IIT Madras", level: "Bachelor's Degree", color: "from-violet-500 to-pink-600" },
    { title: "Bachelor of Science in Psychology", provider: "O.P. Jindal University", level: "Bachelor's Degree", color: "from-sky-500 to-blue-600" }
  ];

  return (
    <main className="relative min-h-screen bg-[#080a10] overflow-x-hidden pt-20 font-sans selection:bg-violet-500/30">
      <Navbar />

      {/* Hero Starfield */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/5 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-600/5 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* ================= HEADER ================= */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
            <span>Stellar Hub</span>
            <ChevronRight size={10} />
            <span className="text-violet-400">Acquisition Logs</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-8 leading-none uppercase">
             Purchases
          </h1>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/5 gap-8 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('subscriptions')}
              className={`pb-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'subscriptions' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Subscriptions
              {activeTab === 'subscriptions' && (
                <motion.div layoutId="tabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-violet-500" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'history' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Payment History
              {activeTab === 'history' && (
                <motion.div layoutId="tabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-violet-500" />
              )}
            </button>
          </div>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className="mb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/20 border border-white/5 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-20 text-center relative overflow-hidden group shadow-2xl"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-sky-400/5 group-hover:opacity-100 opacity-60 transition-opacity" />
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner animate-pulse">
                     {activeTab === 'subscriptions' ? <BookOpen size={32} className="text-violet-400" /> : <History size={32} className="text-sky-400" />}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 leading-none">
                    No {activeTab} found in your stellar history
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm mb-10 max-w-sm mx-auto font-medium">
                    Your acquisition logs are currently clear. Ready to begin your next interstellar mastery traversal?
                  </p>
                  <button 
                    onClick={() => router.push('/courses')}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-violet-500/50 hover:scale-105 transition-all"
                  >
                    Start Your Journey
                  </button>
               </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================= DISCOVERY ENGINE ================= */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-24"
        >
          {/* Recently Viewed */}
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
               <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-[0.3em]">Recently Viewed Voyages</h3>
               <button 
                 onClick={() => router.push('/roadmap')}
                 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"
               >
                 View logs <ChevronRight size={12} />
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {recentlyViewed.map((item, i) => (
                 <motion.div 
                   key={i} 
                   variants={itemVariants}
                   whileHover={{ y: -5 }}
                   className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden group/card shadow-xl backdrop-blur-sm"
                 >
                    <div className={`h-32 bg-gradient-to-br ${item.color} p-8 flex items-center justify-center relative overflow-hidden`}>
                       <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                       <svg viewBox="0 0 24 24" className="w-12 h-12 text-white/90 drop-shadow-2xl transform group-hover/card:scale-110 transition-transform">
                          <path fill="currentColor" d={item.iconPath} />
                       </svg>
                    </div>
                    <div className="p-6">
                       <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2">{item.provider}</span>
                       <h4 className="text-xs sm:text-sm font-black text-white tracking-tight mb-2 group-hover/card:text-violet-400 transition-colors">{item.title}</h4>
                       <span className="text-[9px] font-bold text-gray-500 uppercase">{item.type}</span>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* EduNova Infinite Banner */}
          <motion.div 
            variants={itemVariants}
            className="relative rounded-[3rem] p-px overflow-hidden shadow-2xl group cursor-pointer"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-400 to-sky-400 animate-gradient-x opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative bg-slate-950/90 backdrop-blur-3xl rounded-[2.95rem] p-10 sm:p-14 lg:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                <div className="flex-1 text-center lg:text-left">
                   <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-lg shadow-inner">
                         EduNova <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">Infinite</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-black text-violet-400 uppercase tracking-widest animate-pulse">Alpha Access</span>
                   </div>
                   <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-6 leading-none uppercase">
                      Unlimit Your <br /> Mastery Potential
                   </h2>
                   <p className="text-gray-500 text-xs sm:text-sm mb-10 max-w-lg mx-auto lg:mx-0 font-medium">
                      Gain total access to the full repository of certifications, guided projects, and professional degrees. One plan. Infinite possibility.
                   </p>
                   <button 
                     onClick={() => router.push('/pricing')}
                     className="px-10 py-5 rounded-2xl bg-white text-black font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-violet-500 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                   >
                      Level Up Now
                   </button>
                </div>
                <div className="w-64 h-64 sm:w-80 sm:h-80 relative flex items-center justify-center group-hover:rotate-12 transition-transform duration-1000">
                   <div className="absolute inset-0 bg-violet-600/20 blur-[100px] rounded-full" />
                   <img 
                      src="https://api.dicebear.com/7.x/shapes/svg?seed=Infinite&backgroundColor=transparent&shape1Color=a78bfa&shape2Color=ec4899&shape3Color=38bdf8" 
                      alt="Infinite Symbol"
                      className="w-full h-full relative z-10 drop-shadow-[0_0_50px_rgba(124,58,237,0.5)]"
                   />
                </div>
             </div>
          </motion.div>

          {/* Free Interstellar Labs */}
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
               <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-[0.3em]">Free Interstellar Labs</h3>
               <button 
                 onClick={() => router.push('/courses?category=Labs')}
                 className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"
               >
                 Explore all labs <ChevronRight size={12} />
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {freeCourses.map((item, i) => (
                 <motion.div 
                   key={i} 
                   variants={itemVariants}
                   whileHover={{ y: -5 }}
                   className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group/card shadow-xl backdrop-blur-sm"
                 >
                    <div className="h-40 relative overflow-hidden">
                       <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                       <div className="absolute bottom-4 left-6">
                          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">Free lab</span>
                       </div>
                    </div>
                    <div className="p-8">
                       <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2">{item.provider}</span>
                       <h4 className="text-xs sm:text-sm font-black text-white tracking-tight mb-3 group-hover/card:text-sky-400 transition-colors leading-relaxed">{item.title}</h4>
                       <span className="text-[9px] font-bold text-gray-500 uppercase">{item.type}</span>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* Earn Your Mastery (Degrees) */}
          <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center px-4">
               <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-[0.3em]">Earn Your Residency Mastery</h3>
               <button 
                 onClick={() => router.push('/courses?category=Degrees')}
                 className="text-[10px] font-black text-pink-400 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"
               >
                 Browse degrees <ChevronRight size={12} />
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {degrees.map((item, i) => (
                 <motion.div 
                   key={i} 
                   variants={itemVariants}
                   whileHover={{ y: -5 }}
                   className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group/card shadow-xl backdrop-blur-sm p-8 flex flex-col justify-between h-[280px]"
                 >
                    <div className="space-y-4">
                       <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} p-[1px]`}>
                          <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                             <Award size={24} className="text-white" />
                          </div>
                       </div>
                       <div>
                          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-1">{item.provider}</span>
                          <h4 className="text-xs sm:text-sm font-black text-white tracking-tight group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-white group-hover/card:to-gray-400 leading-tight transition-all">{item.title}</h4>
                       </div>
                    </div>
                    <div>
                       <div className="h-px w-full bg-white/5 mb-4" />
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{item.level}</span>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes gradient-x {
           0%, 100% { background-position: 0% 50%; }
           50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
           background-size: 200% 200%;
           animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </main>
  );
}
