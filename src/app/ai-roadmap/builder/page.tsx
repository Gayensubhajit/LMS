"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, RefreshCw, ChevronLeft, Bookmark, History } from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import RoadmapTimeline from "@/components/lms/RoadmapTimeline";
import { backendRequest } from "@/lib/backend-client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function AIRoadmapBuilderPage() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [myRoadmaps, setMyRoadmaps] = useState<any[]>([]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchMyRoadmaps();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
       fetchSingleRoadmap(id);
    }
  }, [searchParams]);

  const fetchSingleRoadmap = async (id: string) => {
    setLoading(true);
    try {
      const res = await backendRequest<{ ok: boolean; item: any }>(`/roadmaps/${id}`);
      if (res.ok) {
        setRoadmap(res.item.roadmap);
        setPrompt(res.item.prompt);
        setSavedId(res.item.id);
      }
    } catch {}
    setLoading(false);
  };

  const fetchMyRoadmaps = async () => {
    try {
      const res = await backendRequest<{ ok: boolean; items: any[] }>("/roadmaps/my-roadmaps", {
        clerkUserId: user?.id
      });
      if (res.ok) setMyRoadmaps(res.items);
    } catch {}
  };

  const generateRoadmap = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const res = await backendRequest<{ ok: boolean; roadmap: any[]; id?: string; error?: string }>(
        "/roadmaps/generate",
        {
          method: "POST",
          body: JSON.stringify({ prompt, title: prompt.slice(0, 40) + "..." }),
          clerkUserId: user?.id
        }
      );

      if (res.ok) {
        setRoadmap(res.roadmap);
        if (res.id) setSavedId(res.id);
        fetchMyRoadmaps();
      } else {
        setError(res.error || "Failed to generate roadmap. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Our architects are looking into it.");
    } finally {
      setLoading(false);
    }
  };

  const loadSaved = (item: any) => {
    setRoadmap(item.roadmap);
    setSavedId(item.id);
    setPrompt(item.prompt);
    window.scrollTo({ top: document.getElementById('result')?.offsetTop || 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-300 ${montserrat.className}`}>
      <Navbar />

      <main className="flex-1 pt-32 pb-40 relative z-10">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-600/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>AI Career Architect</span>
            </motion.div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[0.9] mb-6">
              Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfect Path</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Describe your goal, and our AI will architect a high-performance roadmap tailored to your specific timeline and skill level.
            </p>
          </div>

          {/* Builder Section */}
          <div className="relative mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 border border-slate-200 dark:border-white/5 shadow-2xl relative z-10"
            >
              <div className="mb-8">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-4 px-1"> Describe Your Vision</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want to become a Senior DevOps Engineer in 6 months. I know basic Python but have no experience with Cloud or CI/CD."
                  className="w-full h-40 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-lg font-medium outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-gray-600 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {!isLoaded ? (
                    <div className="h-10 w-32 bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl" />
                  ) : !user ? (
                    <p className="text-xs font-bold text-slate-400 dark:text-gray-500 italic">
                      Sign in to save your roadmaps permanently.
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                       <History size={16} className="text-indigo-500" />
                       <span className="text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">{myRoadmaps.length} Saved Roadmaps</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={generateRoadmap}
                  disabled={loading || !prompt.trim()}
                  className={`group relative h-16 w-full sm:w-auto px-10 rounded-[1.25rem] flex items-center justify-center gap-3 overflow-hidden transition-all ${
                    loading || !prompt.trim() 
                    ? "bg-slate-200 dark:bg-white/5 grayscale cursor-not-allowed" 
                    : "bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/20"
                  }`}
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Generate Roadmap</span>
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Background Glow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-40 bg-indigo-600/20 blur-[100px] rounded-full -z-10" />
          </div>

          {/* Past Roadmaps Quick Access */}
          {myRoadmaps.length > 0 && !roadmap && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="mb-20"
             >
               <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-8 flex items-center gap-4">
                 Previously Architected
                 <div className="h-px bg-slate-200 dark:bg-white/5 flex-1" />
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myRoadmaps.slice(0, 4).map((m) => (
                    <button 
                      key={m.id}
                      onClick={() => loadSaved(m)}
                      className="text-left p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all group"
                    >
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{new Date(m.createdAt).toLocaleDateString()}</span>
                         <Bookmark size={14} className="text-slate-300 dark:text-gray-700 group-hover:text-indigo-500 transition-colors" />
                       </div>
                       <h3 className="font-bold text-slate-800 dark:text-white truncate">{m.title}</h3>
                    </button>
                  ))}
               </div>
             </motion.div>
          )}

          {/* Results Section */}
          <div id="result">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-40 flex flex-col items-center justify-center text-center"
                >
                  <div className="relative mb-12">
                     <div className="w-24 h-24 rounded-full border-4 border-indigo-600/10 border-t-indigo-600 animate-spin" />
                     <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={32} />
                  </div>
                  <h2 className="text-2xl font-black mb-4">Architecting your career...</h2>
                  <p className="text-slate-500 dark:text-gray-400 font-medium">Our AI is analyzing your goals and mapping out the optimal skill tree.</p>
                </motion.div>
              )}

              {roadmap && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                     <div className="text-left">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2 block">Architecture Complete</span>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none">Your Curated Journey</h2>
                     </div>
                     <button 
                      onClick={() => setRoadmap(null)}
                      className="h-12 px-6 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                     >
                        <RefreshCw size={14} /> Start Over
                     </button>
                  </div>

                  <RoadmapTimeline 
                    customData={roadmap}
                    title={prompt.length > 50 ? prompt.slice(0, 50) + "..." : prompt}
                    subtitle="AI Generated Personal Track"
                    description="This roadmap was specifically architected based on your unique goals and background."
                  />
                  
                  {/* Share/Save CTA */}
                  <div className="mt-20 p-12 rounded-[3rem] bg-indigo-600 flex flex-col items-center text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                      <Sparkles size={200} />
                    </div>
                    <h3 className="text-3xl font-black mb-4 relative z-10">This is just the beginning.</h3>
                    <p className="text-indigo-100 mb-8 max-w-xl font-medium relative z-10">Your personal roadmap is ready. Now it's time to execute. Follow the phases, earn XP, and become the architect of your own future.</p>
                    <Link href="/courses" className="h-16 bg-white text-indigo-600 px-10 rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95">
                      Explore Matching Courses
                    </Link>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                   <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <RefreshCw className="text-red-500" size={24} />
                   </div>
                   <h3 className="text-xl font-black text-red-500 mb-2">Architectural Failure</h3>
                   <p className="text-slate-500 dark:text-gray-400 font-medium mb-8">{error}</p>
                   <button onClick={generateRoadmap} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest">Retry Architect</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
