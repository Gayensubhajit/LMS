"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Play,
  Star,
  Users,
  BookOpen,
  Trophy,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const floatingAvatars = [
  {
    id: 1,
    initials: "Ai",
    color: "from-violet-500 to-purple-700",
    delay: 0,
    x: "75%",
    y: "18%",
  },
  {
    id: 2,
    initials: "Java",
    color: "from-pink-500 to-rose-600",
    delay: 0.5,
    x: "80%",
    y: "42%",
  },
  {
    id: 3,
    initials: "ML",
    color: "from-blue-500 to-cyan-600",
    delay: 1,
    x: "70%",
    y: "65%",
  },
  {
    id: 4,
    initials: "Next",
    color: "from-amber-500 to-orange-600",
    delay: 1.5,
    x: "60%",
    y: "28%",
  },
];

const stats = [
  { value: "25K+", label: "Students", icon: Users },
  { value: "100+", label: "Courses", icon: BookOpen },
  { value: "98%", label: "Success Rate", icon: Trophy },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [-300, 300], [8, -8]);
  const rotateY = useTransform(springX, [-300, 300], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,121,249,0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-6">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span
                className={`${montserrat.className} inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm px-4 py-1.5 rounded-full`}
              >
                <Sparkles size={14} className="animate-pulse" />
                AI-Powered Learning Platform
                <Zap size={12} className="text-yellow-400" />
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-white font-serif">Step Into the</span>
              <br />
              <span className={`${montserrat.className} gradient-text`}>
                Future of
              </span>
              <br />
              <span className="text-white font-serif">Learning</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`${montserrat.className} text-lg text-gray-400 mb-8 max-w-xl leading-relaxed`}
            >
              Master UI/UX Design, Development & more with AI-guided roadmaps,
              real-world projects, and industry mentors — all in one platform.
            </motion.p>

            {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mb-10"
              >
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2)" }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/courses"
                    className={`${montserrat.className} group relative flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl text-base overflow-hidden`}
                  >
                    <span className="relative z-10">Start Learning Free</span>
                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/demo"
                    className="flex items-center gap-3 text-white group"
                  >
                    <div className="relative w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-violet-600/30 transition-colors duration-300">
                      <Play size={16} fill="white" className="translate-x-0.5" />
                      <div className="absolute inset-0 rounded-full border border-violet-400/30 animate-ping opacity-60" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">Watch Demo</div>
                      <div className="text-xs text-gray-400">2 min preview</div>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-6 flex-wrap justify-center lg:justify-start"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <stat.icon size={14} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white leading-none">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="w-px h-8 bg-violet-500/20 ml-2" />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right 3D Card Area */}
          <div className="flex-1 flex items-center justify-center relative min-h-[480px] w-full lg:w-auto">
            {/* Main 3D Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-72 h-80 rounded-3xl overflow-hidden cursor-default"
            >
              {/* Card bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-purple-900/40 to-[#0f0f1a] backdrop-blur-xl border border-violet-500/30 rounded-3xl" />

              {/* Animated shimmer */}
              <div className="absolute inset-0 shimmer rounded-3xl" />

              {/* Card content */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="tag-purple text-xs">UI/UX Design</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold text-white">4.9</span>
                  </div>
                </div>

                {/* Course thumbnail placeholder */}
                <div className="flex-1 rounded-2xl overflow-hidden relative bg-gradient-to-br from-violet-800/30 to-purple-900/30 border border-violet-500/20 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🎨</div>
                    <div className="text-xs text-gray-400">
                      Design Masterclass
                    </div>
                  </div>
                  {/* Floating orb inside card */}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-4 right-4 w-16 h-16 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-bold text-white">
                    Complete UI/UX Design Course
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>48 Lessons • 12h</span>
                    <span className="text-violet-400 font-semibold">
                      83% Complete
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "83%" }}
                      transition={{
                        duration: 1.5,
                        delay: 0.8,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full progress-glow"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating avatar cards */}
            {floatingAvatars.map((avatar, i) => (
              <motion.div
                key={avatar.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + avatar.delay * 0.2 }}
                style={{
                  position: "absolute",
                  left: avatar.x,
                  top: avatar.y,
                  animation: `float ${4 + i}s ease-in-out infinite`,
                  animationDelay: `${avatar.delay * 0.3}s`,
                }}
                className="w-12 h-12 rounded-2xl border border-white/10 shadow-xl overflow-hidden"
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${avatar.color} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {avatar.initials}
                </div>
              </motion.div>
            ))}

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute left-0 top-1/3 glass-card rounded-2xl p-3 flex items-center gap-3 border border-violet-500/20"
              style={{ animation: "float-reverse 5s ease-in-out infinite" }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-lg">
                🏆
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Course Completed!
                </div>
                <div className="text-xs text-gray-400">React Fundamentals</div>
              </div>
            </motion.div>

            {/* Live users badge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute bottom-8 right-15 glass-card rounded-2xl p-3 flex items-center gap-2 border border-green-500/20"
              style={{
                animation: "float 6s ease-in-out infinite",
                animationDelay: "1s",
              }}
            >
              <div className="relative w-2.5 h-2.5 rounded-full bg-green-400">
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
              </div>
              <div>
                <span className="text-xs font-bold text-white">1,204 </span>
                <span className="text-xs text-gray-400">learning now</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
    </section>
  );
}
