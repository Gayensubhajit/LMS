"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ChevronRight,
  Download,
  Share2,
  CheckCircle2,
  UserCheck,
  Search,
  BookOpen,
  Filter,
  ExternalLink,
  ShieldCheck,
  Star,
  Zap,
  Trophy,
  Target,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import { SignIn, useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import BadgeCard from "@/components/lms/BadgeCard";
import { dark } from "@clerk/themes";
import PortfolioStats from "@/components/lms/PortfolioStats";
interface Certificate {
  id: string;
  certificateId: string;
  issuedAt: string;
  course: {
    title: string;
    slug: string;
    instructorName: string;
    category: string;
  };
}
interface Profile {
  isNameVerified: boolean;
  verifiedName: string;
}
export default function AccomplishmentsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [stats, setStats] = useState<{ xp: number; level: number; rank: string | number }>({
    xp: 0,
    level: 1,
    rank: "...",
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChangingName, setIsChangingName] = useState(false);
  const [newName, setNewName] = useState("");
  useEffect(() => {
    if (!isLoaded || !user?.id) {
      if (isLoaded && !user) setLoading(false);
      return;
    }
    async function fetchData() {
      try {
        const data = await backendRequest<{
          ok: boolean;
          certificates: any[];
          profile: Profile;
        }>("/accomplishments", {
          clerkUserId: user?.id,
        });
        if (data.ok) {
          setCertificates(data.certificates);
          setProfile(data.profile);
        }

        // Fetch badges
        const badgesRes = await backendRequest<{ ok: boolean, badges: any[] }>("/gamification/badges");
        if (badgesRes.ok) setBadges(badgesRes.badges);

        const userBadgesRes = await backendRequest<{ ok: boolean, item?: any }>("/gamification/me", {
          clerkUserId: user?.id
        });
        if (userBadgesRes.ok && userBadgesRes.item) {
          setUserBadges(userBadgesRes.item.badges || []);
          setStats(s => ({ ...s, xp: userBadgesRes.item.xp, level: userBadgesRes.item.level }));
        }

        // Fetch leaderboard for rank
        const leaderboardRes = await backendRequest<{ ok: boolean, leaderboard: any[] }>("/gamification/leaderboard");
        if (leaderboardRes.ok) {
          const myRank = leaderboardRes.leaderboard.findIndex(u => u.name === (profile?.verifiedName || user?.fullName)) + 1;
          if (myRank > 0) setStats(s => ({ ...s, rank: myRank }));
        }
      } catch (err) {
        console.error("Failed to fetch accomplishments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isLoaded, user?.id]);
  const handleNameChange = async () => {
    if (!newName.trim() || !user?.id) return;
    try {
      const data = await backendRequest<{ ok: boolean; user: Profile }>(
        "/accomplishments/verify-name",
        {
          method: "POST",
          clerkUserId: user.id,
          body: { name: newName },
        },
      );
      if (data.ok) {
        setProfile(data.user);
        setIsChangingName(false);
        setNewName("");
      }
    } catch (err) {
      console.error("Failed to update name:", err);
    }
  };
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#080a10] text-foreground flex items-center justify-center pt-20">
        <SignIn />
      </div>
    );
  }
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#020617] text-slate-900 dark:text-slate-200 selection:bg-violet-500/30 overflow-x-hidden">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* Header Section */}
        <div className="mb-12 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-blue-500/50 dark:bg-violet-500/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-violet-400">
              Student Records
            </span>
          </motion.div>
          
          <div className="relative inline-block">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-violet-400 mb-6 uppercase tracking-[-0.04em] leading-none"
            >
              Accomplishments
            </motion.h1>
            {/* Subtle floating glow behind text */}
            <div className="absolute -inset-10 bg-blue-500/10 dark:bg-violet-500/10 blur-[100px] -z-10 rounded-full animate-pulse" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 md:text-xl max-w-2xl font-medium leading-relaxed"
          >
            A prestigious gallery of your certificates, badges, and learning milestones.
          </motion.p>
        </div>
        {/* Portfolio Stats Hero */}
        <PortfolioStats stats={{
          totalBadges: (userBadges || []).length,
          totalCertificates: (certificates || []).length,
          totalXp: stats.xp,
          rank: stats.rank
        }} />

        {/* Name Verification Card - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-20 group"
        >
          {/* Decorative mesh background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-violet-500/5 rounded-[3rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl shadow-indigo-500/5">
            <div className="flex flex-col md:flex-row items-center lg:items-start gap-8 text-center md:text-left">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <ShieldCheck className="w-12 h-12 text-white" />
                </div>
                {/* Orbital Rings */}
                <div className="absolute inset-0 w-24 h-24 rounded-3xl border-2 border-blue-500/20 scale-125 animate-ping opacity-20" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Identity Status
                  </h2>
                  <div className={`
                    px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                    ${profile?.isNameVerified 
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse"}
                  `}>
                    {profile?.isNameVerified ? "Verified" : "Action Required"}
                  </div>
                </div>

                <div className="text-slate-600 dark:text-slate-300 mb-4 max-w-xl font-medium text-lg leading-snug">
                  Currently registered as <span className="text-blue-600 dark:text-violet-400 font-black">{profile?.verifiedName || user?.fullName || "Not Verified"}</span>. 
                  This name is legally bound to your official learning credentials.
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500">
                  <CheckCircle2 className={`w-4 h-4 ${profile?.isNameVerified ? "text-emerald-500" : "text-slate-300"}`} />
                  Certificate Integrity System Active
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsChangingName(true)}
              className="px-10 py-5 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/5 flex items-center gap-3 active:scale-95 group/btn shrink-0"
            >
              Update Credentials
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Badges & Achievements Section */}
        <div className="mb-20">
          <div className="flex flex-row items-center justify-between gap-4 mb-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
              <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
              Achievements
              <span className="text-sm font-black text-slate-500 ml-2 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">
                {(userBadges || []).length} / {(badges || []).length}
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.isArray(badges) && badges.map((badge) => {
              if (!badge) return null;
              const userBadge = Array.isArray(userBadges) ? userBadges.find(ub => ub && ub.badgeId === badge.id) : null;
              return (
                <BadgeCard 
                  key={badge.id}
                  badge={badge}
                  earnedAt={userBadge?.earnedAt}
                  isUnlocked={!!userBadge}
                />
              );
            })}
          </div>
        </div>
        {/* Certificates Section */}
        <div className="flex flex-row items-center md:justify-between gap-4 mb-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
            <Award className="w-6 h-6 text-blue-500 dark:text-amber-400 shrink-0" />
            Credentials
            <span className="text-sm font-black text-slate-500 ml-2 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">
              {certificates.length}
            </span>
          </h3>
          <div className="flex gap-2">
            <button className="p-2.5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all shadow-sm">
              <Filter className="w-5 h-5 text-slate-400 dark:text-slate-400" />
            </button>
            <button className="p-2.5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all shadow-sm">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-400" />
            </button>
          </div>
        </div>
        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-white/5 shadow-inner">
              <Zap className="w-10 h-10 text-slate-400" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-slate-300 mb-2 uppercase tracking-tight">
              No credentials yet
            </h4>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
              Complete your first course to earn an official certificate and
              showcase your skills.
            </p>
            <button className="px-8 py-3 bg-blue-600 dark:bg-violet-600 hover:bg-blue-500 dark:hover:bg-violet-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 dark:shadow-violet-600/20 transition-all active:scale-95 flex items-center gap-2 mx-auto">
              Explore Our Catalog
              <ExternalLink className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.isArray(certificates) && certificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 flex flex-col sm:flex-row gap-6 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-700">
                  {/* Certificate Preview/Thumbnail */}
                  <div className="w-full sm:w-48 h-40 sm:h-32 rounded-2xl bg-linear-to-br from-slate-50 to-white dark:from-indigo-900 dark:to-slate-900 overflow-hidden relative border border-slate-200 dark:border-white/5 shrink-0 shadow-inner">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <div className="text-[10px] text-blue-600 dark:text-violet-400 font-extrabold uppercase tracking-[0.2em] mb-1">
                        EduNova
                      </div>
                      <div className="text-[8px] text-slate-400 dark:text-slate-500 font-bold text-center line-clamp-2 uppercase italic tracking-tighter">
                        {cert.course.title}
                      </div>
                      <Award className="w-8 h-8 text-blue-500/20 dark:text-amber-500/50 mt-2 rotate-12" />
                    </div>
                    {/* Corner Decoration */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/10 dark:bg-violet-500/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-indigo-500/10 dark:bg-fuchsia-500/10 rounded-full blur-2xl" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-blue-600 dark:text-amber-500 fill-current shrink-0" />
                        <span className="text-[9px] font-black text-blue-600 dark:text-amber-500/80 uppercase tracking-[0.15em] leading-none bg-blue-500/5 dark:bg-amber-500/10 px-2.5 py-1 rounded-full border border-blue-500/10 dark:border-amber-500/20 h-6 flex items-center justify-center italic">
                          Standard
                        </span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2 leading-tight uppercase tracking-tight break-words">
                        {cert.course?.title || "Unknown Course"}
                      </h4>
                      <p className="text-sm text-slate-400 dark:text-gray-500 font-bold italic truncate">
                        {cert.course.instructorName} • EduNova
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {new Date(cert.issuedAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {/* Support Section */}
        <div className="mt-24 pt-12 border-t border-slate-200 dark:border-white/5 flex flex-col items-center text-center">
          <p className="text-slate-400 dark:text-slate-500 mb-6 text-[10px] font-black uppercase tracking-widest">
            Identity & Credential Support Hub
          </p>
          <button className="text-blue-600 dark:text-violet-400 font-black text-xs uppercase tracking-widest hover:text-blue-800 dark:hover:text-violet-300 transition-colors flex items-center gap-2 underline underline-offset-8 decoration-blue-500/30">
            View Documentation
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
      <AnimatePresence>
        {isChangingName && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChangingName(false)}
              className="absolute inset-0 bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-700"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-2xl shadow-blue-500/10 dark:shadow-violet-500/10 transition-colors duration-700"
            >
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter italic">
                Request Change
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">
                Enter your full legal name as it should appear on your official
                certificates.
              </p>
              <div className="mb-8">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">
                  New Verified Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Subhajit Gayen"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-blue-500 dark:focus:border-violet-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsChangingName(false)}
                  className="flex-1 px-6 py-4 border border-slate-200 dark:border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNameChange}
                  className="flex-1 px-6 py-4 bg-blue-600 dark:bg-violet-600 hover:bg-blue-500 dark:hover:bg-violet-500 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-xl shadow-blue-600/20 dark:shadow-violet-600/20"
                >
                  Verify Name
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
