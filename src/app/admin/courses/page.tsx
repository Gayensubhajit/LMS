"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  BookOpen, 
  Plus, 
  MoreHorizontal, 
  ExternalLink, 
  Loader2,
  AlertCircle,
  Eye,
  Edit2,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { backendRequest } from "@/lib/backend-client";

interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: string;
  isPublished: boolean;
  instructorName: string;
  _count: {
    sections: number;
  };
}

interface CoursesResponse {
  ok: boolean;
  items: Course[];
}

export default function AdminCoursesPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await backendRequest<CoursesResponse>("/admin/courses", {
          clerkUserId: user?.id
        });
        if (res.ok) {
          setCourses(res.items);
        } else {
          setError("Failed to load courses");
        }
      } catch (err) {
        setError("Could not connect to service");
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) fetchCourses();
  }, [user?.id]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-700 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            <BookOpen className="text-blue-600 dark:text-blue-500" size={32} />
            My Courses
          </h1>
          <p className="text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Manage your curriculum and content
          </p>
        </div>
        
        <Link href="/admin/courses/create">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 dark:hover:bg-blue-500 active:scale-95 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] dark:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Plus size={16} />
            New Course
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col gap-4 items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 dark:text-gray-600 font-black text-[10px] uppercase tracking-widest">Loading Catalog...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="text-red-500" size={40} />
          <p className="text-red-900 dark:text-white font-bold">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs font-black text-red-600 dark:text-red-500 uppercase tracking-widest hover:underline">Retry</button>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-transparent flex items-center justify-center shadow-sm dark:shadow-none">
            <BookOpen className="text-slate-400 dark:text-gray-700" size={40} />
          </div>
          <div className="max-w-xs">
            <h3 className="text-slate-700 dark:text-white font-black text-lg mb-2">No Courses Found</h3>
            <p className="text-slate-500 dark:text-gray-500 text-sm font-medium leading-relaxed">
              You haven&apos;t created any courses yet. Start your instructor journey now!
            </p>
          </div>
          <Link href="/admin/courses/create">
            <button className="px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm dark:shadow-none">
              Create Your First Course
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 rounded-[32px] transition-all duration-500 flex flex-col gap-6 shadow-sm hover:shadow-md dark:shadow-none"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#0a0a1f] border border-slate-200 dark:border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm dark:shadow-2xl">
                    <BookOpen size={24} className={course.isPublished ? "text-blue-600 dark:text-blue-500" : "text-amber-500"} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-slate-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate uppercase tracking-tight">{course.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[9px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest">
                        {course.category}
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${course.isPublished ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-500" : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500"}`}>
                        {course.isPublished ? "Public" : "Draft"}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 dark:text-gray-600 uppercase tracking-widest">
                        <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-gray-700" />
                        {course._count.sections} Modules
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <Link href={`/admin/courses/${course.id}/builder`} className="flex-1 sm:flex-none">
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-blue-600/20 hover:border-blue-200 dark:hover:border-blue-600/50 hover:text-blue-600 dark:hover:text-white text-slate-500 dark:text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                      <Edit2 size={14} />
                      Edit
                    </button>
                  </Link>
                  
                  <Link href={`/courses/${course.slug}`} target="_blank">
                    <button className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-white rounded-2xl transition-all shadow-sm dark:shadow-lg" title="View Public Page">
                      <Eye size={18} />
                    </button>
                  </Link>
  
                  <button className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/30 text-slate-400 dark:text-gray-700 hover:text-red-600 dark:hover:text-red-500 rounded-2xl transition-all shadow-sm dark:shadow-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
