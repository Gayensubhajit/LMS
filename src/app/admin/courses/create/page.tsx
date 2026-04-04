"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  ChevronLeft, 
  Sparkles, 
  Loader2,
  AlertCircle,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { backendRequest } from "@/lib/backend-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(2, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
  shortDescription: z.string().min(20, "Short description must be at least 20 characters"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: "BEGINNER",
      category: "Development",
    },
  });

  const onSubmit = async (data: CourseFormValues) => {
    setLoading(true);
    setError(null);

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const payload = {
      ...data,
      slug,
      longDescription: data.shortDescription, // Initial copy
      instructorName: user?.fullName || "EduNova Instructor",
      oneMonthPrice: 0,
      threeMonthPrice: 0,
      sixMonthPrice: 0,
      isFree: true, // Default to free for draft
      isPublished: false,
    };

    try {
      const res = await backendRequest<{ ok: boolean; item?: { id: string }; error?: string }>(
        "/admin/courses", 
        {
          method: "POST",
          body: payload,
          clerkUserId: user?.id,
        }
      );

      if (res.ok && res.item) {
        router.push(`/admin/courses/${res.item.id}/builder`);
      } else {
        setError(res.error || "Failed to create course. Try a different title.");
      }
    } catch (err) {
      setError("Service unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      {/* Back Header */}
      <Link href="/admin/courses" className="flex items-center gap-2 text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Courses</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-700 dark:text-white tracking-tight">Create <span className="text-blue-600 dark:text-blue-500">New Course</span></h1>
        <p className="text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest text-xs leading-relaxed">
          The first step toward building your learning legacy.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6 p-8 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none relative overflow-hidden group">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest px-1">Course Title</label>
            <input 
              {...form.register("title")}
              placeholder="e.g. Master React and Next.js 15"
              className="w-full bg-slate-50 dark:bg-[#0a0a1f] border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-700 dark:text-white font-bold focus:border-blue-500/50 dark:focus:border-blue-600/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-800"
            />
            {form.formState.errors.title && <p className="text-xs text-red-500 font-bold px-1 mt-1">{form.formState.errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest px-1">Category</label>
              <select 
                {...form.register("category")}
                className="w-full bg-slate-50 dark:bg-[#0a0a1f] border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-700 dark:text-white font-bold focus:border-blue-500/50 dark:focus:border-blue-600/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="AI/ML">Artificial Intelligence</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest px-1">Level</label>
              <select 
                {...form.register("level")}
                className="w-full bg-slate-50 dark:bg-[#0a0a1f] border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-700 dark:text-white font-bold focus:border-blue-500/50 dark:focus:border-blue-600/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="ALL_LEVELS">All Levels</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest px-1">Pitch / Short Description</label>
            <textarea 
              {...form.register("shortDescription")}
              placeholder="Give students a reason to enroll in 1-2 powerful sentences."
              rows={3}
              className="w-full bg-slate-50 dark:bg-[#0a0a1f] border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-700 dark:text-white font-bold focus:border-blue-500/50 dark:focus:border-blue-600/50 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-gray-800"
            />
            {form.formState.errors.shortDescription && <p className="text-xs text-red-500 font-bold px-1 mt-1">{form.formState.errors.shortDescription.message}</p>}
          </div>

          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl pointer-events-none" />
        </div>

        {error && (
          <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-3 text-red-600 dark:text-red-500 text-sm font-bold">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-600 dark:to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-black py-5 rounded-[2.5rem] tracking-[0.2em] uppercase text-xs transition-all shadow-[0_15px_35px_rgba(0,86,210,0.25)] dark:shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Creating Framework...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Initialize Course & Build Curriculum
            </>
          )}
        </button>
      </form>
    </div>
  );
}
