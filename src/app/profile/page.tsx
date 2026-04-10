"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import PioneerPassport from "@/components/lms/PioneerPassport";
import {
  User,
  Pencil,
  Share2,
  Globe,
  Briefcase,
  GraduationCap,
  Plus,
  Info,
  ChevronRight,
  ExternalLink,
  Award,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Box,
  BrainCircuit,
  Cpu,
  Monitor,
  Zap,
  Flame,
  Star,
  Clock,
  Calendar,
  BookOpen
} from "lucide-react";
import { SignIn, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";
import { backendRequest } from "@/lib/backend-client";

interface DashboardStats {
  streak: number;
  xp: number;
  certificates: number;
  activeCourses: number;
  lastActivity: string | null;
}

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    if (isSignedIn) {
      backendRequest("/dashboard/stats").then((res: any) => {
        if (res.ok) setStats(res.stats);
      });
      backendRequest("/accomplishments").then((res: any) => {
        if (res.ok) setCerts(res.certificates.slice(0, 3));
      });
    }
  }, [isSignedIn]);

  const desiredRoles = [
    {
      label: "Machine Learning Engineer",
      icon: BrainCircuit,
      tech: "PyTorch • TensorFlow",
    },
    { label: "Data Analyst", icon: Cpu, tech: "SQL • Pandas" },
    { label: "Python Developer", icon: Monitor, tech: "Django • FastAPI" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#080a10] text-foreground flex items-center justify-center pt-20">
        <SignIn />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f6f8ff] dark:bg-[#080a10] overflow-x-hidden pt-20 font-sans selection:bg-violet-500/30">
      <Navbar />

      {/* Dynamic Starfield & Nebula Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/10 blur-[130px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-600/10 blur-[130px] rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
        >
          {/* ================= LEFT SIDEBAR (STICKY ON DESKTOP) ================= */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28 w-full">
            {/* Personal Details Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 text-center relative group overflow-hidden shadow-sm dark:shadow-none"
            >
              <div className="absolute -inset-1 bg-gradient-to-tr from-violet-600/10 to-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.2em]">
                    Personal Details
                  </span>
                  <button
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-all hover:bg-slate-200 dark:hover:bg-white/10"
                    aria-label="Edit details"
                  >
                    <Pencil size={14} />
                  </button>
                </div>

                <div className="relative inline-block mb-6 group/avatar">
                  <div className="absolute inset-0 bg-linear-to-tr from-violet-600 to-sky-400 rounded-full blur-md opacity-20 group-hover/avatar:opacity-60 transition-opacity animate-pulse" />
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-violet-500/30 flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden shadow-2xl group-hover/avatar:border-violet-400 transition-colors">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.fullName || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter drop-shadow-2xl">
                        {user?.fullName?.charAt(0) ?? ""}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-violet-600 rounded-full flex items-center justify-center border-2 sm:border-4 border-slate-950 shadow-lg text-white">
                    <Zap
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="currentColor"
                    />
                  </div>
                </div>

                <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-slate-900 group-hover:to-violet-600 dark:group-hover:from-white dark:group-hover:to-violet-300 transition-all">
                  {user?.fullName}
                </h1>
                <p className="text-[10px] sm:text-[11px] text-violet-400/60 mb-6 sm:mb-8 uppercase tracking-[0.2em] font-black">
                  Pioneer Level 42
                </p>

                <div className="space-y-3">
                  <button className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-violet-500/30 text-violet-600 dark:text-violet-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-violet-500/10 transition-all shadow-lg hover:shadow-violet-500/10">
                    <Share2 size={16} /> Share profile
                  </button>
                  <button className="w-full text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-gray-500 hover:text-slate-800 dark:hover:text-white transition-colors uppercase tracking-widest">
                    Update visibility
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Work Preferences Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 group relative overflow-hidden shadow-sm dark:shadow-none"
            >
              <div className="absolute -inset-1 bg-linear-to-tr from-sky-400/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-white uppercase tracking-[0.2em]">
                    Work preferences
                  </h3>
                  <button className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-all hover:bg-slate-200 dark:hover:bg-white/10">
                    <Pencil size={14} />
                  </button>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest block mb-1">
                    Desired roles
                  </span>
                  <div className="space-y-2">
                    {desiredRoles.map((role, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-violet-500/30 transition-all cursor-default group/role shadow-inner"
                      >
                        <div className="p-2 rounded-lg sm:p-2.5 sm:rounded-xl bg-violet-400/5 text-violet-600 dark:text-violet-400 group-hover/role:bg-violet-400/20 group-hover/role:scale-110 transition-all">
                          <role.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 dark:text-gray-200 group-hover/role:text-violet-700 dark:group-hover/role:text-white transition-colors uppercase tracking-tight">
                            {role.label}
                          </span>
                          <span className="text-[9px] text-slate-400 dark:text-gray-500 uppercase tracking-tighter mt-0.5">
                            {role.tech}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Additional Info Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 group relative overflow-hidden shadow-sm dark:shadow-none"
            >
              <div className="relative z-10">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-white uppercase tracking-[0.2em] mb-4">
                  Additional info
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-500 mb-6 leading-relaxed font-medium">
                  Add links to your portfolio, GitHub, or LinkedIn to help
                  recruiters find you.
                </p>
                <button className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-all hover:border-violet-500/20 shadow-xl">
                  <Plus size={16} /> Add Info
                </button>
              </div>
            </motion.div>
          </div>

          {/* ================= MAIN CONTENT ================= */}
          <div className="lg:col-span-3 space-y-8 lg:space-y-10 w-full overflow-hidden">
            {/* Stats Dashboard */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Learning Streak", value: `${stats?.streak ?? 0} Days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
                { label: "Total XP", value: (stats?.xp ?? 0).toLocaleString(), icon: Zap, color: "text-violet-500", bg: "bg-violet-500/10" },
                { label: "Certificates", value: stats?.certificates ?? 0, icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Active Courses", value: stats?.activeCourses ?? 0, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center group hover:border-violet-500/30 transition-all shadow-sm">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-1">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* HERO - Pioneer Passport */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] p-px shadow-2xl group w-full"
            >
              <div className="absolute inset-0 bg-linear-to-br from-violet-600/30 via-transparent to-sky-400/30 group-hover:opacity-100 opacity-60 transition-opacity duration-700" />
              <div className="relative bg-white/80 dark:bg-slate-950/90 backdrop-blur-3xl rounded-[2.45rem] sm:rounded-[2.95rem] p-6 sm:p-8 lg:p-12 border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="relative z-10 text-center md:text-left">
                    <span className="text-[9px] sm:text-[10px] font-black text-blue-600 dark:text-violet-400 uppercase tracking-[0.4em] mb-4 block animate-pulse">
                      Certified Intelligence Asset
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 lg:mb-6 leading-[0.85] uppercase">
                      Pioneer <br />{" "}
                      <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-500 to-violet-600 dark:from-violet-400 dark:via-pink-400 dark:to-sky-400">
                        Identity
                      </span>
                    </h2>
                    <p className="text-slate-500 dark:text-gray-500 text-[11px] sm:text-sm mb-6 lg:mb-8 leading-relaxed max-w-sm mx-auto md:mx-0 font-medium">
                      Synchronizing your multi-dimensional progress across the
                      EduNova network.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <div className="px-4 py-2 rounded-full bg-violet-400/10 border border-violet-400/20 text-[9px] font-black text-violet-400 uppercase tracking-[0.2em] shadow-lg">
                        Alpha active
                      </div>
                      <div className="px-4 py-2 rounded-full bg-sky-400/10 border border-sky-400/20 text-[9px] font-black text-sky-400 uppercase tracking-[0.2em] shadow-lg">
                        Sync: 100%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center relative z-10 transform hover:scale-105 transition-transform duration-500 w-full max-w-[280px] sm:max-w-[340px] mx-auto md:max-w-none">
                    <PioneerPassport />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Experience Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-4 sm:px-6">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">
                  Experience
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-violet-500/20 to-transparent" />
                <Info size={14} className="text-slate-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {/* Projects Card */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 30px -10px rgba(124, 58, 237, 0.1)",
                  }}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 group relative overflow-hidden shadow-sm dark:shadow-none"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[50px] rounded-full group-hover:bg-violet-600/10 transition-colors" />
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      Projects
                    </h4>
                    <div className="p-2 rounded-xl bg-violet-400/10 text-violet-600 dark:text-violet-400">
                      <BarChart3 size={18} />
                    </div>
                  </div>
                  <p className="text-[12px] sm:text-sm text-slate-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
                    Showcase your high-impact work. Demonstrate mastery through
                    job-relevant projects.
                  </p>
                  <button className="text-[10px] sm:text-xs font-black text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors flex items-center gap-1 group/btn uppercase tracking-widest">
                    Browse Projects{" "}
                    <ChevronRight
                      size={14}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </button>
                </motion.div>

                {/* Work History Card */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 30px -10px rgba(56, 189, 248, 0.1)",
                  }}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 group relative overflow-hidden shadow-sm dark:shadow-none"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/5 blur-[50px] rounded-full group-hover:bg-sky-400/10 transition-colors" />
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      Work history
                    </h4>
                    <div className="p-2 rounded-xl bg-sky-400/10 text-sky-600 dark:text-sky-400">
                      <Briefcase size={18} />
                    </div>
                  </div>
                  <p className="text-[12px] sm:text-sm text-slate-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
                    Consolidate your professional journey. Add internships,
                    volunteer roles, or industry experience.
                  </p>
                  <button className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-[10px] sm:text-xs flex items-center justify-center gap-2 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all uppercase tracking-widest shadow-sm dark:shadow-lg">
                    <Plus size={16} /> Add experience
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Intelligence Insights (Radar Chart Integration) */}
            <motion.div
              variants={itemVariants}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-950 p-8 sm:p-10 md:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group shadow-sm dark:shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-violet-600/10 transition-all duration-1000" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="text-center md:text-left">
                  <span className="text-[9px] sm:text-[10px] font-black text-blue-600 dark:text-violet-400 uppercase tracking-[0.5em] mb-4 block">
                    Intelligence Profile
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 sm:mb-6 leading-none">
                    Learning{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">
                      DNA
                    </span>
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 lg:mb-8 font-medium">
                    Theoretical mastery meets practical execution in a unified
                    visualization.
                  </p>
                  <div className="flex flex-row justify-center md:justify-start gap-4">
                    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 group-hover:border-violet-500/20 transition-all shadow-inner flex flex-col items-center sm:items-start">
                      <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase block mb-1">
                        Rank
                      </span>
                      <span className="text-[11px] sm:text-sm font-black text-slate-900 dark:text-white italic tracking-tighter uppercase whitespace-nowrap">
                        Voyager
                      </span>
                    </div>
                    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 group-hover:border-sky-500/20 transition-all shadow-inner flex flex-col items-center sm:items-start">
                      <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase block mb-1">
                        99th Percentile
                      </span>
                      <span className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-400 dark:to-sky-400">
                        148.2
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skill Radar SVG Animation */}
                <div className="relative aspect-square max-w-[240px] sm:max-w-[340px] mx-auto group-hover:scale-110 transition-transform duration-1000 ease-out">
                  <div className="absolute inset-0 bg-violet-500/10 blur-[60px] rounded-full animate-pulse" />
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full transform -rotate-90 overflow-visible relative z-10"
                  >
                    <defs>
                      <radialGradient
                        id="dataGlow"
                        cx="50%"
                        cy="50%"
                        r="50%"
                        fx="50%"
                        fy="50%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#a78bfa"
                          stopOpacity="0.4"
                        />
                        <stop
                          offset="100%"
                          stopColor="#a78bfa"
                          stopOpacity="0"
                        />
                      </radialGradient>
                    </defs>
                    {[20, 40, 60, 80, 100].map((r) => (
                      <circle
                        key={r}
                        cx="50"
                        cy="50"
                        r={r / 2}
                        fill="none"
                        stroke="rgba(100,116,139,0.2)"
                        strokeWidth="0.5"
                        strokeDasharray="1 2"
                      />
                    ))}
                    {[0, 120, 240].map((angle) => (
                      <line
                        key={angle}
                        x1="50"
                        y1="50"
                        x2={50 + 50 * Math.cos((angle * Math.PI) / 180)}
                        y2={50 + 50 * Math.sin((angle * Math.PI) / 180)}
                        stroke="rgba(100,116,139,0.2)"
                        strokeWidth="0.5"
                      />
                    ))}
                    <polygon
                      points="50,15 85,75 15,75"
                      fill="url(#dataGlow)"
                      stroke="#a78bfa"
                      strokeWidth="2"
                      className="animate-[pulse_4s_infinite]"
                    />
                    <circle
                      cx="50"
                      cy="15"
                      r="2.5"
                      fill="#a78bfa"
                      className="shadow-violet-500 shadow-lg"
                    />
                    <circle cx="85" cy="75" r="2.5" fill="#ec4899" />
                    <circle cx="15" cy="75" r="2.5" fill="#38bdf8" />
                  </svg>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 sm:-translate-y-10 text-[9px] sm:text-[11px] font-black text-blue-600 dark:text-violet-400 uppercase tracking-[0.3em]">
                    Theoretical
                  </div>
                  <div className="absolute bottom-2 right-0 translate-x-10 text-[9px] sm:text-[11px] font-black text-pink-400 uppercase tracking-[0.3em]">
                    Execution
                  </div>
                  <div className="absolute bottom-2 left-0 -translate-x-10 text-[9px] sm:text-[11px] font-black text-indigo-500 dark:text-sky-400 uppercase tracking-[0.3em]">
                    Interface
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Education Section */}
            <div className="space-y-6 pb-12 lg:pb-0">
              <div className="flex items-center gap-3 px-4 sm:px-6">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">
                  Education
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-sky-500/20 to-transparent" />
                <Info size={14} className="text-slate-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {/* Credentials Card */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 30px -10px rgba(124, 58, 237, 0.1)",
                  }}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 group relative overflow-hidden shadow-sm dark:shadow-none"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      Credentials
                    </h4>
                    <button className="py-1.5 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-blue-600/10 dark:bg-violet-600/20 text-blue-600 dark:text-violet-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/20 dark:hover:bg-violet-600/40 transition-all border border-blue-500/10 dark:border-violet-500/10 active:scale-95">
                      Add New
                    </button>
                  </div>
                  <p className="text-[12px] sm:text-sm text-slate-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
                    Verified training from companies like Google & Meta.
                  </p>
                  <button className="text-[10px] sm:text-xs font-black text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors flex items-center gap-2 group/btn uppercase tracking-[0.2em]">
                    Browse Certs{" "}
                    <ChevronRight
                      size={14}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </button>
                </motion.div>

                {/* Degrees Card */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 30px -10px rgba(167, 139, 250, 0.1)",
                  }}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 group relative overflow-hidden shadow-sm dark:shadow-none"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      Degrees
                    </h4>
                    <button className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-all hover:bg-slate-200 dark:hover:bg-white/10">
                      <Pencil size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-5 bg-slate-50 dark:bg-white/[0.03] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-white/5 group-hover:border-violet-500/40 transition-all shadow-inner relative overflow-hidden">
                    <div className="absolute -inset-px bg-gradient-to-r from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <GraduationCap className="text-violet-400 w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="relative z-10">
                      <h5 className="text-[12px] sm:text-sm lg:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Bachelor's degree
                      </h5>
                      <p className="text-[9px] sm:text-[10px] text-violet-400/70 font-black uppercase tracking-[0.2em] mt-1">
                        CS • Year 3
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            {/* Recent Achievements */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-4 sm:px-6">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">
                  Recent Achievements
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
                <Award size={14} className="text-slate-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {certs.length > 0 ? certs.map((cert, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:border-emerald-500/30 transition-all"
                    >
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />
                      <Award className="text-emerald-500 mb-4" size={24} />
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase mb-1 truncate">
                        {cert.course.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                        Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                )) : (
                    <div className="md:col-span-3 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] p-12 text-center">
                        <p className="text-sm text-slate-400 dark:text-gray-600 font-bold uppercase tracking-widest">No certificates earned yet</p>
                        <p className="text-xs text-slate-400 dark:text-gray-700 mt-2 italic">Finish a course to unlock your first achievement!</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
