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
} from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import { useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";

interface Certificate {
  id: string;
  certificateId: string;
  issuedAt: string;
  course: {
    title: true;
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
  const { user, isLoaded } = useUser();
  const [certificates, setCertificates] = useState<any[]>([]);
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
        }
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

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-violet-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Header Section */}
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4"
          >
            Accomplishments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl"
          >
            Track your milestones, view earned credentials, and share your path to mastery with the world.
          </motion.p>
        </div>

        {/* Name Verification Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group mb-16"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10 shrink-0">
                <ShieldCheck className="w-8 h-8 text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Name Verification</h2>
                <div className="flex items-center gap-2 text-slate-300 mb-3">
                  <span>Your name,</span>
                  <span className="font-semibold text-violet-400">
                    {profile?.verifiedName || user?.fullName || "Not Verified"}
                  </span>
                  <span>is {profile?.isNameVerified ? "verified" : "not verified"}.</span>
                  {profile?.isNameVerified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-sm text-slate-500 max-w-lg">
                  This is the name that will appear on your official EduNova certificates.
                  Ensure it matches your government-issued ID.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChangingName(true)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white transition-all flex items-center gap-2 group/btn shrink-0"
            >
              <UserCheck className="w-4 h-4 text-violet-400" />
              Request Name Change
            </button>
          </div>
        </motion.div>

        {/* Certificates Section */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            Certificates
            <span className="text-sm font-normal text-slate-500 ml-2 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
              {certificates.length}
            </span>
          </h3>
          <div className="flex gap-2">
            <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
              <Filter className="w-5 h-5 text-slate-400" />
            </button>
            <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
              <Search className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl bg-slate-900/20"
          >
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-slate-600" />
            </div>
            <h4 className="text-xl font-semibold text-slate-300 mb-2">No certificates yet</h4>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Complete your first course to earn an official certificate and showcase your skills.
            </p>
            <button className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-lg shadow-violet-600/20 transition-all active:scale-95 flex items-center gap-2 mx-auto">
              Explore Our Catalog
              <ExternalLink className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {certificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex gap-6 overflow-hidden">
                  {/* Certificate Preview/Thumbnail */}
                  <div className="w-48 h-32 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 overflow-hidden relative border border-white/5 shrink-0">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <div className="text-[10px] text-violet-400 font-bold uppercase tracking-[0.2em] mb-1">EduNova</div>
                      <div className="text-[8px] text-slate-500 font-medium text-center line-clamp-2">{cert.course.title}</div>
                      <Award className="w-8 h-8 text-amber-500/50 mt-2 rotate-12" />
                    </div>
                    {/* Corner Decoration */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-fuchsia-500/10 rounded-full blur-2xl" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-500/80 uppercase tracking-widest leading-none bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 h-6 flex items-center justify-center">Course</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-1 group-hover:text-violet-400 transition-colors line-clamp-2 leading-tight">
                        {cert.course.title}
                      </h4>
                      <p className="text-sm text-slate-500 mb-4">{cert.course.instructorName} • EduNova</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-xs text-slate-500">
                        Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
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
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col items-center text-center">
          <p className="text-slate-500 mb-6 text-sm">Didn't find what you were looking for? Check out our support docs.</p>
          <button className="text-violet-400 font-semibold hover:text-violet-300 transition-colors flex items-center gap-2 underline underline-offset-4 decoration-violet-500/30">
            View Accomplishments Support
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
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-violet-500/10"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Request Name Change</h3>
              <p className="text-slate-400 text-sm mb-6">
                Enter your full legal name as it should appear on your certificates.
              </p>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Verified Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Subhajit Gayen"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsChangingName(false)}
                  className="flex-1 px-6 py-3 border border-white/10 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNameChange}
                  className="flex-1 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-violet-600/20"
                >
                  Verify Name
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
