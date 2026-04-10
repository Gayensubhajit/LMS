"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import { 
  MessageSquare, 
  Plus, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  User as UserIcon,
  ChevronRight,
  Send,
  ArrowLeft,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

type ForumThread = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    fullName: string;
    avatarUrl?: string;
  };
  _count: {
    comments: number;
    votes: number;
  };
};

type ForumComment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    fullName: string;
    avatarUrl?: string;
  };
  votes: any[];
};

type Props = {
  courseId: string;
  lessonId?: string;
};

export default function DiscussionForum({ courseId, lessonId }: Props) {
  const { user } = useUser();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threadDetail, setThreadDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [newComment, setNewComment] = useState("");

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const res = await backendRequest<{ ok: boolean; items: ForumThread[] }>(
        `/forums?courseId=${courseId}${lessonId ? `&lessonId=${lessonId}` : ""}`
      );
      if (res.ok) setThreads(res.items);
    } catch (err) {
      console.error("Failed to fetch threads", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchThreadDetail = async (id: string) => {
    try {
      const res = await backendRequest<{ ok: boolean; item: any }>(`/forums/${id}`);
      if (res.ok) setThreadDetail(res.item);
    } catch (err) {
      console.error("Failed to fetch thread detail", err);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [courseId, lessonId]);

  useEffect(() => {
    if (selectedThread) {
      fetchThreadDetail(selectedThread);
    }
  }, [selectedThread]);

  const handleCreateThread = async () => {
    if (!newThread.title || !newThread.content) return;
    try {
      const res = await backendRequest<{ ok: boolean; item: ForumThread }>(
        "/forums/threads",
        {
          method: "POST",
          clerkUserId: user?.id,
          body: { ...newThread, courseId, lessonId: lessonId || undefined },
        }
      );
      if (res.ok) {
        setThreads([res.item, ...threads]);
        setShowCreate(false);
        setNewThread({ title: "", content: "" });
      }
    } catch (err) {
      console.error("Failed to create thread", err);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment || !selectedThread) return;
    try {
      const res = await backendRequest<{ ok: boolean; item: ForumComment }>(
        "/forums/comments",
        {
          method: "POST",
          clerkUserId: user?.id,
          body: { content: newComment, threadId: selectedThread },
        }
      );
      if (res.ok) {
        setThreadDetail({
          ...threadDetail,
          comments: [...(threadDetail.comments || []), res.item],
        });
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to create comment", err);
    }
  };

  if (loading && !threads.length) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedThread ? (
        /* THREAD DETAIL VIEW */
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <button
            onClick={() => setSelectedThread(null)}
            className="text-xs text-violet-500 hover:text-violet-400 font-bold flex items-center gap-1 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Discussions
          </button>

          {threadDetail && (
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20 overflow-hidden">
                  {threadDetail.author.avatarUrl ? (
                    <img src={threadDetail.author.avatarUrl} alt={threadDetail.author.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={20} className="text-violet-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{threadDetail.author.fullName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-500">
                    {formatDistanceToNow(new Date(threadDetail.createdAt))} ago
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3">{threadDetail.title}</h2>
              <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">{threadDetail.content}</p>

              <div className="border-t border-slate-100 dark:border-white/5 pt-6 mt-6 space-y-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageCircle size={16} className="text-violet-500" />
                  Comments ({threadDetail.comments?.length || 0})
                </h3>

                <div className="space-y-4">
                  {threadDetail.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5">
                      <div className="w-8 h-8 rounded-full bg-violet-500/10 shrink-0 border border-violet-500/10 overflow-hidden">
                        {comment.author.avatarUrl ? (
                          <img src={comment.author.avatarUrl} alt={comment.author.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon size={16} className="m-2 text-violet-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{comment.author.fullName}</p>
                          <p className="text-[10px] text-slate-500 dark:text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-400 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 resize-none"
                    rows={1}
                  />
                  <button
                    onClick={handleCreateComment}
                    className="px-4 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        /* THREAD LIST VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
               <h2 className="text-sm font-bold text-slate-900 dark:text-white">Community Discussions</h2>
               <p className="text-[10px] text-slate-500 dark:text-gray-500">Ask questions and share your insights</p>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-violet-600/20"
            >
              {showCreate ? <X size={14} /> : <Plus size={14} />} 
              {showCreate ? "Cancel" : "New Topic"}
            </button>
          </div>

          <AnimatePresence>
            {showCreate && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-violet-500/30 shadow-2xl space-y-3">
                  <input
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    placeholder="Topic Title"
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-500/50"
                  />
                  <textarea
                    value={newThread.content}
                    onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                    placeholder="Tell us what's on your mind... (supports Markdown)"
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 resize-none"
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleCreateThread}
                      disabled={!newThread.title || !newThread.content}
                      className="px-6 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-violet-600/20"
                    >
                      Post Discussion
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
            {threads.length > 0 ? (
              threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread.id)}
                  className="w-full text-left p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-violet-500/50 transition-all group shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                         <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-400 transition-colors truncate">
                            {thread.title}
                         </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-gray-500 line-clamp-1">
                        {thread.content}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-[10px] font-black uppercase text-violet-500">
                            {thread.author?.fullName?.[0] || 'U'}
                          </div>
                          <span className="text-[10px] text-slate-600 dark:text-gray-400 font-bold">{thread.author.fullName}</span>
                        </div>
                        <div className="flex items-center gap-3 ml-auto">
                           <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                              <MessageCircle size={10} />
                              {thread._count.comments}
                           </div>
                           <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                              <ThumbsUp size={10} />
                              {thread._count.votes}
                           </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 dark:text-gray-700 group-hover:text-violet-400 transition-transform group-hover:translate-x-1 self-center" />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-white/2 rounded-3xl border border-dashed border-slate-200 dark:border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-white/10">
                   <MessageSquare size={28} className="text-slate-300 dark:text-gray-700" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-gray-400">No discussions yet</p>
                <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">Be the first to start a conversation about this lesson.</p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-6 text-xs font-bold text-violet-500 hover:text-violet-400 underline decoration-violet-500/30"
                >
                  Create a Topic
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
