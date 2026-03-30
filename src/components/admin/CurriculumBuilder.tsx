"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  GripVertical, 
  Video, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Edit3,
  CheckCircle2,
  Sparkles,
  Loader2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backendRequest } from "@/lib/backend-client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import LessonEditor from "./LessonEditor";

interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  position: number;
  isPreview: boolean;
}

interface Section {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

export default function CurriculumBuilder({ courseId }: { courseId: string }) {
  const { user } = useUser();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const fetchCurriculum = async () => {
    try {
      const res = await backendRequest<{ ok: boolean; items: Section[] }>(
        `/admin/courses/${courseId}/curriculum`, 
        { clerkUserId: user?.id }
      );
      if (res.ok) setSections(res.items);
    } catch (err) {
      toast.error("Failed to load curriculum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchCurriculum();
  }, [user?.id, courseId]);

  const addSection = async () => {
    if (!newSectionTitle.trim()) return;
    try {
      const res = await backendRequest<{ ok: boolean }>(
        `/admin/courses/${courseId}/sections`,
        {
          method: "POST",
          body: { title: newSectionTitle, position: sections.length },
          clerkUserId: user?.id
        }
      );
      if (res.ok) {
        setNewSectionTitle("");
        setIsAddingSection(false);
        fetchCurriculum();
        toast.success("Module added");
      }
    } catch (err) {
      toast.error("Failed to add module");
    }
  };

  const addLesson = async (sectionId: string, position: number) => {
    try {
      const res = await backendRequest<{ ok: boolean }>(
        `/admin/sections/${sectionId}/lessons`,
        {
          method: "POST",
          body: { title: "Untitled Lesson", position, videoUrl: "" },
          clerkUserId: user?.id
        }
      );
      if (res.ok) {
        fetchCurriculum();
        toast.success("Lesson added");
      }
    } catch (err) {
      toast.error("Failed to add lesson");
    }
  };

  const deleteSection = async (id: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    try {
      const res = await backendRequest<{ ok: boolean }>(`/admin/sections/${id}`, {
        method: "DELETE",
        clerkUserId: user?.id
      });
      if (res.ok) {
        fetchCurriculum();
        toast.success("Module deleted");
      }
    } catch (err) {
      toast.error("Error deleting module");
    }
  };

  const deleteLesson = async (id: string) => {
    try {
      const res = await backendRequest<{ ok: boolean }>(`/admin/lessons/${id}`, {
        method: "DELETE",
        clerkUserId: user?.id
      });
      if (res.ok) {
        fetchCurriculum();
        toast.success("Lesson deleted");
      }
    } catch (err) {
      toast.error("Error deleting lesson");
    }
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest leading-relaxed">Synthesizing Curriculum...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          Curriculum <span className="text-[10px] font-black bg-white/5 border border-white/5 px-2 py-1 rounded-lg text-gray-500">{sections.length} Modules</span>
        </h2>
        
        {!isAddingSection ? (
          <button 
            onClick={() => setIsAddingSection(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Plus size={14} /> Add Module
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input 
              autoFocus
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Module Title..."
              className="bg-[#080a18] border border-violet-500/30 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && addSection()}
            />
            <button onClick={addSection} className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-colors"><CheckCircle2 size={16} /></button>
            <button onClick={() => setIsAddingSection(false)} className="p-2 bg-white/5 text-gray-400 rounded-xl hover:text-white transition-colors"><X size={16} /></button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {sections.map((section, sIdx) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] bg-white/2 border border-white/5 overflow-hidden group/section"
          >
            {/* Section Header */}
            <div className="p-5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <GripVertical size={18} className="text-gray-700 cursor-grab active:cursor-grabbing" />
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Section {sIdx + 1}</span>
                  <h3 className="text-sm font-black text-white">{section.title}</h3>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity">
                <button onClick={() => addLesson(section.id, section.lessons.length)} className="px-3 py-1.5 bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-widest rounded-lg transition-all">Add Lesson</button>
                <div className="h-4 w-px bg-white/5 mx-1" />
                <button onClick={() => deleteSection(section.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            {/* Lessons List */}
            <div className="p-2 space-y-1">
              {section.lessons.length === 0 ? (
                <div className="py-8 text-center bg-transparent">
                  <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">No Lessons in this Section</p>
                </div>
              ) : (
                section.lessons.map((lesson, lIdx) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 group/lesson transition-all duration-300 border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-[#0a0a20] flex items-center justify-center border border-white/[0.03]">
                        <Video size={14} className={lesson.videoUrl ? "text-violet-400" : "text-gray-700"} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Lesson {lIdx + 1}</p>
                        <h4 className="text-sm font-bold text-gray-200">{lesson.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                      {lesson.isPreview && <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20 mr-2">Preview</span>}
                      <button 
                        onClick={() => setEditingLesson(lesson)}
                        className="p-2 text-gray-600 hover:text-violet-400 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => deleteLesson(lesson.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ))}

        {sections.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-6 border-2 border-dashed border-white/5 rounded-[40px]">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
              <FileText size={32} />
            </div>
            <div>
              <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-2">Curriculum Empty</p>
              <button 
                onClick={() => setIsAddingSection(true)} 
                className="text-xs font-bold text-violet-400 hover:underline"
              >
                Create your first module to begin
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingLesson && (
          <LessonEditor 
            lesson={editingLesson}
            onClose={() => setEditingLesson(null)}
            onSave={fetchCurriculum}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
