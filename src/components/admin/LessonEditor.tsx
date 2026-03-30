"use client";

import { useState } from "react";
import { 
  X, 
  Video, 
  Type, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backendRequest } from "@/lib/backend-client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  isPreview: boolean;
}

interface LessonEditorProps {
  lesson: Lesson;
  onClose: () => void;
  onSave: () => void;
}

export default function LessonEditor({ lesson, onClose, onSave }: LessonEditorProps) {
  const { user } = useUser();
  const [title, setTitle] = useState(lesson.title);
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || "");
  const [isPreview, setIsPreview] = useState(lesson.isPreview);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await backendRequest<{ ok: boolean }>(`/admin/lessons/${lesson.id}`, {
        method: "PATCH",
        body: { title, videoUrl, isPreview },
        clerkUserId: user?.id
      });
      if (res.ok) {
        toast.success("Lesson updated");
        onSave();
        onClose();
      }
    } catch (err) {
      toast.error("Failed to update lesson");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-20">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-[#0a0a20] border border-white/5 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="p-8 sm:p-10 space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">Edit Lesson</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Update lesson content and settings</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Title Field */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Type size={14} className="text-violet-500" />
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lesson Title</label>
              </div>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Intro to Figma Basics"
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-violet-600/50 outline-none transition-all"
              />
            </div>

            {/* Video URL Field */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Video size={14} className="text-violet-500" />
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">YouTube Video URL</label>
              </div>
              <input 
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-violet-600/50 outline-none transition-all placeholder:text-gray-700"
              />
              <div className="p-4 bg-violet-600/5 border border-violet-600/10 rounded-2xl flex items-center gap-3">
                <AlertCircle size={16} className="text-violet-400 shrink-0" />
                <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic">
                  Ensure the video is Public or Unlisted on YouTube for students to access it.
                </p>
              </div>
            </div>

            {/* Preview Toggle */}
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Free Preview</p>
                <p className="text-[10px] font-bold text-gray-500 leading-none">Allow users to watch without enrolling</p>
              </div>
              <button 
                onClick={() => setIsPreview(!isPreview)}
                className={`w-12 h-6 rounded-full transition-all relative ${isPreview ? "bg-violet-600" : "bg-gray-800"}`}
              >
                <motion.div 
                  animate={{ x: isPreview ? 26 : 4 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                />
              </button>
            </div>
          </div>

          <button 
            disabled={saving}
            onClick={handleSave}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900/50 disabled:text-gray-500 text-white font-black py-5 rounded-[2.5rem] tracking-[0.2em] uppercase text-xs transition-all shadow-[0_20px_50px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
            {saving ? "Updating Framework..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
