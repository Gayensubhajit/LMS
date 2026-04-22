"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { aiRoadmapData } from "@/lib/roadmap-data";
import { backendRequest } from "@/lib/backend-client";
import { useUser } from "@clerk/nextjs";
import RoadmapStep from "./RoadmapStep";
import { Loader2, Sparkles } from "lucide-react";
import { RoadmapPhase } from "@/lib/roadmap-types";

interface RoadmapTimelineProps {
  customData?: RoadmapPhase[];
  title?: string;
  description?: string;
  subtitle?: string;
}

export default function RoadmapTimeline({ 
  customData, 
  title = "Master the Frontier", 
  description = "From foundational Python to building autonomous multi-agent systems. Follow this world-class curriculum designed to turn you into a production-ready AI Engineer.",
  subtitle = "Your AI Career Blueprint"
}: RoadmapTimelineProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const [progress, setProgress] = useState<{ progressPercent: number } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!userLoaded || !user?.id) {
       setLoading(false);
       return;
    }

    const fetchProgress = async () => {
      try {
        // Map roadmap to the 'ai-engineering-roadmap' exclusive course
        const res = await backendRequest<{ ok: boolean; item: { progressPercent: number } }>(
          "/progress/courses/ai-engineering-roadmap",
          { clerkUserId: user.id }
        );
        if (res.ok) {
          setProgress(res.item);
        }
      } catch (err) {
        console.error("Failed to fetch roadmap progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id, userLoaded]);

  const roadmapData = customData || aiRoadmapData;
  const totalSteps = roadmapData.length;
  const currentStepIndex = progress ? Math.floor((progress.progressPercent / 100) * totalSteps) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Constructing your path...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative py-20 px-4 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />

      {/* Vertical Line Container */}
      <div className="absolute left-6 sm:left-12 top-0 bottom-0 w-1 sm:w-1.5 z-0">
        {/* Static Background Line */}
        <div className="absolute inset-0 bg-slate-100 dark:bg-white/5 rounded-full" />
        
        {/* Animated Progress Line */}
        <motion.div 
          style={{ scaleY: pathLength, originY: 0 }}
          className="absolute inset-0 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)]"
        />
      </div>

      <div className="relative z-10 space-y-24 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 rounded-full mb-6"
          >
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">{subtitle}</span>
          </motion.div>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 text-balance">
            {title}
          </h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-2xl font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="space-y-32">
          {roadmapData.map((phase, idx) => (
            <RoadmapStep 
              key={phase.month}
              phase={phase}
              index={idx}
              isCompleted={idx < currentStepIndex}
              isActive={idx === currentStepIndex}
            />
          ))}
        </div>

        {/* Final Goal Node */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative mt-20 flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-indigo-600/30">
            <Sparkles className="text-white" size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-8 tracking-tight uppercase">Elite AI Engineer</h3>
          <p className="text-slate-500 dark:text-gray-500 text-sm font-bold mt-2 uppercase tracking-widest">Industry Ready · Mastered</p>
        </motion.div>
      </div>
    </div>
  );
}
