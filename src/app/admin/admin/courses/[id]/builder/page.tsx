"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  ChevronLeft, 
  Settings, 
  Eye, 
  Rocket, 
  Loader2,
  CheckCircle2,
  MoreVertical,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { backendRequest } from "@/lib/backend-client";
import CurriculumBuilder from "@/components/admin/CurriculumBuilder";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
}

export default function MasterBuilderPage() {
  const { id } = useParams() as { id: string };
  const { user } = useUser();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await backendRequest<{ ok: boolean; items: any[] }>("/admin/courses", {
          clerkUserId: user?.id
        });
        if (res.ok) {
          const found = res.items.find((c: any) => c.id === id);
          if (found) setCourse(found);
          else router.push("/admin/courses");
        }
      } catch (err) {
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) fetchCourse();
  }, [user?.id, id, router]);

  const togglePublish = async () => {
    if (!course) return;
    setIsPublishing(true);
    try {
      const res = await backendRequest<{ ok: boolean; item: Course }>(`/admin/courses/${id}`, {
        method: "PATCH",
        body: { isPublished: !course.isPublished },
        clerkUserId: user?.id
      });
      if (res.ok) {
        setCourse(res.item);
        toast.success(res.item.isPublished ? "Course is now LIVE! 🚀" : "Course moved to Drafts");
      }
    } catch (err) {
      toast.error("Error updating status");
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      <p className="text-gray-600 font-black text-[10px] uppercase tracking-widest leading-relaxed">Loading Builder Context...</p>
    </div>
  );

  if (!course) return null;

  return (
    <div className="space-y-10 pb-20">
      {/* Header Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/admin/courses" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group mb-4">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight">{course.title}</h1>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${course.isPublished ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"}`}>
              {course.isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Builder ID: {course.id.slice(-8)} • Last edited just now
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/courses/${course.slug}`} target="_blank">
            <button className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              <Eye size={16} />
              Preview
            </button>
          </Link>

          <button 
            disabled={isPublishing}
            onClick={togglePublish}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
              ${course.isPublished 
                ? "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10" 
                : "bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_30px_rgba(124,58,237,0.3)]"}
            `}
          >
            {isPublishing ? <Loader2 className="animate-spin" size={16} /> : (course.isPublished ? <CheckCircle2 size={16} /> : <Rocket size={16} />)}
            {course.isPublished ? "Unpublish" : "Publish Course"}
          </button>
          
          <button className="p-3 bg-white/5 border border-white/10 text-gray-500 hover:text-white rounded-2xl transition-all">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="h-px bg-white/5 w-full" />

      {/* Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Curriculum Column */}
        <div className="lg:col-span-3">
          <CurriculumBuilder courseId={course.id} />
        </div>

        {/* Sidebar / Checklist */}
        <div className="space-y-8">
          <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-sm font-black text-white tracking-widest uppercase">Course Checklist</h3>
            <div className="space-y-4">
              {[
                { label: "Basic Information", done: true },
                { label: "Curriculum Modules", done: true },
                { label: "Pricing Setup", done: false },
                { label: "Preview Video", done: false },
                { label: "Course Thumbnail", done: false },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${step.done ? "bg-violet-600 border-violet-600" : "border-white/10"}`}>
                    {step.done && <CheckCircle2 className="text-white" size={10} />}
                  </div>
                  <span className={`text-xs font-bold ${step.done ? "text-gray-300" : "text-gray-600"}`}>{step.label}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-white/5 pt-2" />
            
            <p className="text-[10px] font-medium text-gray-500 leading-relaxed italic">
              Your course must have at least one module and one lesson to be eligible for publication.
            </p>
          </div>

          <div className="p-8 rounded-[40px] bg-violet-600/10 border border-violet-600/20 group hover:border-violet-500/50 transition-all">
             <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={20} className="text-white" />
             </div>
             <h4 className="text-sm font-black text-white mb-2">Need help?</h4>
             <p className="text-xs font-bold text-gray-400 mb-6 leading-relaxed">
               Read our Guide on how to structure your backend design course for maximum student impact.
             </p>
             <button className="text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-white transition-colors">Open Documentation</button>
          </div>
        </div>
      </div>
    </div>
  );
}
