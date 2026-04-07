"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import { 
  Plus, 
  Trash2, 
  Clock, 
  StickyNote, 
  Loader2, 
  ChevronRight,
  Save,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  content: string;
  timestamp: number;
  createdAt: string;
}

interface LessonNotesProps {
  lessonId: string;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

export default function LessonNotes({ lessonId, currentTime, onSeek }: LessonNotesProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userLoaded || !user?.id) return;

    const fetchNotes = async () => {
      try {
        const data = await backendRequest<{ ok: boolean; items: Note[] }>(
          `/notes/lesson/${lessonId}`,
          { clerkUserId: user.id }
        );
        if (data.ok) {
          setNotes(data.items);
        }
      } catch (err) {
        console.error("Failed to load notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [lessonId, user?.id, userLoaded]);

  const handleCreateNote = async () => {
    if (!newNoteContent.trim() || !user?.id || saving) return;
    setSaving(true);
    try {
      const data = await backendRequest<{ ok: boolean; item: Note }>("/notes", {
        method: "POST",
        clerkUserId: user.id,
        body: {
          lessonId,
          content: newNoteContent,
          timestamp: Math.floor(currentTime),
        },
      });

      if (data.ok) {
        setNotes((prev) => [...prev, data.item].sort((a, b) => a.timestamp - b.timestamp));
        setNewNoteContent("");
        setIsAdding(false);
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!user?.id) return;
    try {
      const data = await backendRequest<{ ok: boolean }>(`/notes/${id}`, {
        method: "DELETE",
        clerkUserId: user.id,
      });
      if (data.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
        <Loader2 className="w-6 h-6 text-violet-500 animate-spin mb-3" />
        <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest">Gathering your notes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto py-6 px-4 sm:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-violet-600/20 flex items-center justify-center">
            <StickyNote className="text-blue-600 dark:text-violet-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">TIMESTAMPED NOTES</h3>
            <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest font-black mt-1">
              {notes.length} INSIGHTS SAVED
            </p>
          </div>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.03] transition-all"
          >
            <Plus size={14} /> Add Note @ {formatTime(currentTime)}
          </button>
        )}
      </div>

      {/* Add Note Area */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-white/3 border border-blue-200 dark:border-violet-500/20 rounded-2xl p-5 shadow-xl shadow-blue-500/5 items-start">
              <div className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">
                <Clock size={12} fill="currentColor" className="opacity-20" /> 
                Creating Insight at {formatTime(currentTime)}
              </div>
              <textarea
                autoFocus
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="What did you learn at this moment?"
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 resize-none min-h-[100px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleCreateNote();
                  if (e.key === "Escape") setIsAdding(false);
                }}
              />
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-4">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  disabled={!newNoteContent.trim() || saving}
                  className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Save Insight
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-10">
        {notes.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-gray-700 mb-6">
              <StickyNote size={40} />
            </div>
            <p className="text-sm font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.2em]">Curate your learning</p>
            <p className="text-[10px] text-slate-400 dark:text-gray-700 mt-3 font-medium">Save insights tied to timestamps for easy review later.</p>
          </div>
        ) : (
          notes.map((note) => (
            <motion.div
              layout
              key={note.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group bg-white dark:bg-white/2 border border-slate-200 dark:border-white/5 rounded-3xl p-6 hover:border-violet-500/40 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.03] shadow-sm hover:shadow-xl hover:shadow-violet-500/5"
            >
              <div className="flex items-start justify-between">
                <button
                  onClick={() => onSeek(note.timestamp)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 dark:bg-violet-600/20 text-blue-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  <Clock size={12} /> {formatTime(note.timestamp)}
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="mt-5 text-sm text-slate-700 dark:text-gray-300 leading-[1.6] font-medium">
                {note.content}
              </p>
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-slate-400 dark:text-gray-600 uppercase tracking-widest font-black">
                   {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <ChevronRight size={14} className="text-slate-300 dark:text-gray-700 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
