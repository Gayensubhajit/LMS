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
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <BookOpen className="text-violet-500" size={32} />
            My Courses
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Manage your curriculum and content
          </p>
        </div>
        
        <Link href="/admin/courses/create">
          <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-500 active:scale-95 transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)]">
            <Plus size={16} />
            New Course
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col gap-4 items-center justify-center">
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
          <p className="text-gray-600 font-black text-[10px] uppercase tracking-widest">Loading Catalog...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="text-red-500" size={40} />
          <p className="text-white font-bold">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">Retry</button>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-20 rounded-[40px] border-2 border-dashed border-white/5 bg-white/2 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <BookOpen className="text-gray-700" size={40} />
          </div>
          <div className="max-w-xs">
            <h3 className="text-white font-black text-lg mb-2">No Courses Found</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              You haven&apos;t created any courses yet. Start your instructor journey now!
            </p>
          </div>
          <Link href="/admin/courses/create">
            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              Create Your First Course
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group p-5 bg-white/5 border border-white/5 hover:border-violet-500/30 rounded-3xl transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#0a0a1f] border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="text-violet-500" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black group-hover:text-violet-400 transition-colors">{course.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-600">{course.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-800" />
                    <span className={course.isPublished ? "text-emerald-500" : "text-amber-500"}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-800" />
                    <span className="text-gray-400">{course._count.sections} Modules</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/courses/${course.id}/builder`} className="flex-1 lg:flex-none">
                  <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 hover:bg-violet-600/20 hover:border-violet-600/50 hover:text-white text-gray-400 rounded-2xl text-xs font-bold transition-all">
                    <Edit2 size={14} />
                    Edit Content
                  </button>
                </Link>
                
                <Link href={`/courses/${course.slug}`} target="_blank">
                  <button className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-500 hover:text-white rounded-2xl transition-all" title="View Public Page">
                    <Eye size={18} />
                  </button>
                </Link>

                <button className="p-3 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-gray-600 hover:text-red-500 rounded-2xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
