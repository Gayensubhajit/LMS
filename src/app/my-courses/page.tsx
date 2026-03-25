"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { getCourseBySlug } from "@/lib/courses-data";
import { backendRequest } from "@/lib/backend-client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2, MoreVertical, Calendar, Target, Sparkles } from "lucide-react";

type DashboardCourseItem = {
  enrollmentId: string;
  plan: string;
  amountPaid: number;
  startsAt: string;
  expiresAt: string;
  course: {
    slug: string;
    title: string;
    category: string;
    previewVideoUrl: string | null;
  };
  progress: {
    completedLessons: number;
    totalLessons: number;
    progressPercent: number;
    nextLesson: {
      id: string;
      title: string;
      isPreview: boolean;
      sectionTitle: string;
    } | null;
  };
};

type TabType = "in-progress" | "completed";

export default function MyCoursesPage() {
  const { user, isLoaded } = useUser();
  const [enrollments, setEnrollments] = useState<DashboardCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("in-progress");

  useEffect(() => {
    const run = async () => {
      if (!isLoaded) return;
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await backendRequest<{
          ok: true;
          items: DashboardCourseItem[];
        }>("/dashboard/my-courses", {
          clerkUserId: user.id
        });
        setEnrollments(res.items || []);
      } catch (err) {
        setError((err as Error).message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [isLoaded, user?.id]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const filteredEnrollments = useMemo(() => {
    if (activeTab === "completed") {
      return enrollments.filter(e => e.progress.progressPercent === 100);
    }
    return enrollments.filter(e => e.progress.progressPercent < 100);
  }, [enrollments, activeTab]);

  return (
    <main className="min-h-screen bg-[#08080f] text-[#f0f0ff] pt-24 pb-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-2xl font-bold shadow-[0_0_30px_rgba(124,58,237,0.3)] shrink-0">
              {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "S"}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {greeting}, {user?.firstName || "Student"}
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles size={14} className="text-violet-400" />
                Your career goal is to start a career as a <span className="text-violet-300 font-semibold underline decoration-violet-500/40 underline-offset-4 cursor-pointer hover:text-white transition-colors">Full-Stack Developer</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-b border-white/5">
            <button 
              onClick={() => setActiveTab("in-progress")} 
              className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider relative transition-colors ${activeTab === "in-progress" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              In Progress
              {activeTab === "in-progress" && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-violet-600 rounded-full" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("completed")} 
              className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider relative transition-colors ${activeTab === "completed" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              Completed
              {activeTab === "completed" && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-violet-600 rounded-full" />
              )}
            </button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          
          {/* Main Course List */}
          <section className="space-y-6">
            {!isLoaded || loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-44 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : filteredEnrollments.length === 0 ? (
              <div className="glass-card rounded-3xl border border-violet-500/10 p-12 text-center">
                <Target size={48} className="mx-auto text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  {activeTab === "completed" ? "No courses completed yet" : "No courses in progress"}
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  {activeTab === "completed" 
                    ? "Complete all lessons in a course to see it here and earn your certificate." 
                    : "Discover your next challenge and start learning today."}
                </p>
                <Link 
                  href="/courses" 
                  className="inline-flex items-center justify-center bg-white text-[#08080f] px-8 py-3 rounded-2xl font-bold hover:bg-violet-50 transition-colors"
                >
                  Explore Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredEnrollments.map((enrollment, idx) => {
                  const courseMeta = getCourseBySlug(enrollment.course.slug);
                  return (
                    <motion.article 
                      key={enrollment.enrollmentId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all duration-500 group overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Course Image / Emoji */}
                        <div className="md:w-56 h-40 md:h-auto bg-white/[0.02] flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-700 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          {courseMeta?.emoji || "📚"}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                                {enrollment.course.category}
                              </span>
                              <span className="text-gray-700">•</span>
                              <span className="text-xs">EduNova Learning</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-violet-300 transition-colors truncate">
                              {enrollment.course.title}
                            </h3>
                            
                            <div className="mt-4 flex flex-col gap-3">
                              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                <span>Course • {enrollment.progress.progressPercent}% complete</span>
                                <span>Estimated completion: Apr 20, 2026</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${enrollment.progress.progressPercent}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Action Area */}
                          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                            {enrollment.progress.nextLesson ? (
                              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 min-w-[200px]">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Up Next</span>
                                <p className="text-xs font-bold text-white truncate max-w-[150px]">
                                  {enrollment.progress.nextLesson.title}
                                </p>
                                <Link 
                                  href={`/learn/${enrollment.course.slug}`}
                                  className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
                                >
                                  <Play size={14} fill="currentColor" />
                                  Resume
                                </Link>
                              </div>
                            ) : (
                                <Link 
                                  href={`/learn/${enrollment.course.slug}`}
                                  className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all"
                                >
                                  <CheckCircle2 size={16} />
                                  Review Course
                                </Link>
                            )}
                            <button className="p-2 text-gray-500 hover:text-white transition-colors self-end md:self-center">
                              <MoreVertical size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-8 hidden lg:block">
            <div className="glass-card rounded-3xl border border-white/5 p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Target size={16} className="text-violet-400" />
                  Today&apos;s goals
                </h4>
                <ul className="space-y-4">
                  {[
                    "Complete any 3 learning items • 0/3",
                    "Complete a reading",
                    "Practice with Coach"
                  ].map((goal, i) => (
                    <li key={i} className="flex items-start gap-3 group cursor-pointer">
                      <div className="mt-1 w-4 h-4 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-violet-500 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-violet-400" />
                  Learning plan
                </h4>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-400 mb-2">Set your learning plan</p>
                  <div className="flex justify-between gap-1">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 2 ? "bg-violet-600 text-white" : "bg-white/5 text-gray-500"}`}>
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl border border-white/10 p-6 bg-gradient-to-br from-violet-600/20 to-transparent">
              <h4 className="text-sm font-black text-white mb-2">Upgrade to Plus</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">Get unlimited access to 7,000+ courses and certifications.</p>
              <Link href="/pricing" className="text-xs font-bold text-violet-400 hover:text-white transition-colors">
                View Plans →
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}


