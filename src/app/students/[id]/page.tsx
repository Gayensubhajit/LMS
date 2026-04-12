"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Award, 
  Trophy, 
  ChevronLeft, 
  ExternalLink,
  ShieldCheck,
  Star,
  Zap,
  Target,
  Sparkles,
  Calendar
} from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import { backendRequest } from "@/lib/backend-client";
import BadgeCard from "@/components/lms/BadgeCard";
import PortfolioStats from "@/components/lms/PortfolioStats";

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await backendRequest<{ ok: boolean, profile: any, error?: string }>(`/gamification/profiles/${id}`);
        if (res.ok) {
          setProfile(res.profile);
        } else {
          setError(res.error || "Student not found");
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#020617] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#020617] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
          {error || "Profile Missing"}
        </h1>
        <button
          onClick={() => router.push("/leaderboard")}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-slate-600 dark:text-slate-400"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Leaderboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#020617] text-slate-900 dark:text-slate-200 selection:bg-violet-500/30 overflow-x-hidden">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* Navigation / Header */}
        <div className="mb-12 relative">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/leaderboard")}
            className="flex items-center gap-2 group mb-8 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors font-bold uppercase tracking-widest text-[10px]"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Rankings
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-blue-500/50 dark:bg-violet-500/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-violet-400">
              Student Profile
            </span>
          </motion.div>
          
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-violet-400 uppercase tracking-tight leading-none"
              >
                {profile.name}
              </motion.h1>
              <div className="absolute -inset-10 bg-blue-500/10 dark:bg-violet-500/10 blur-[100px] -z-10 rounded-full" />
            </div>

            {profile.avatar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl shadow-indigo-500/10"
              >
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Global Stats */}
        <PortfolioStats stats={{
          totalBadges: profile.badges.length,
          totalCertificates: profile.certificates.length,
          totalXp: profile.xp,
          rank: "..." // Rank can be added later if needed
        }} />

        {/* Achievements Gallery */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
              Achievement Medals
            </h3>
          </div>

          {profile.badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {profile.badges.map((badge: any) => (
                <BadgeCard 
                  key={badge.id}
                  badge={badge}
                  earnedAt={badge.earnedAt}
                  isUnlocked={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center">
              <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-800 mx-auto mb-4" />
              <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">
                No medals earned yet
              </p>
            </div>
          )}
        </div>

        {/* Credentials Showcase */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-500 shrink-0" />
              Verified Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.certificates.map((cert: any) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    EduNova Certification
                  </div>
                </div>

                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight line-clamp-2">
                  {cert.course?.title || "Course Completed"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold mb-6 italic">
                  Instructor: {cert.course?.instructorName || "EduNova Academy"}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-violet-400 uppercase tracking-widest">
                    Verified ID: {cert.certificateId.split('-')[0]}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {profile.certificates.length === 0 && (
            <div className="bg-white dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">
              No certificates published yet
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
