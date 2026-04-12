"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { 
  Send, 
  Users, 
  MessageSquare,
  Sparkles,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  room: string;
  message: string;
  author: string;
  avatar?: string;
  timestamp: number;
};

type Member = {
  name: string;
  avatar?: string;
};

type Props = {
  lessonId: string;
  courseTitle: string;
  lessonTitle: string;
};

export default function GroupStudyChat({ lessonId, courseTitle, lessonTitle }: Props) {
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSignedIn || !lessonId || !user) return;

    // Connect to socket server
    socketRef.current = io("http://localhost:3001");

    // Join lesson-specific room with presence data
    socketRef.current.emit("join_room", {
      room: lessonId,
      user: {
        id: user.id,
        name: user.fullName || "Student",
        avatar: user.imageUrl
      }
    });

    socketRef.current.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socketRef.current.on("presence_update", (data: { room: string, members: Member[] }) => {
      if (data.room === lessonId) {
        setMembers(data.members);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [lessonId, isSignedIn, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !user || !lessonId) return;

    const data: Message = {
      room: lessonId,
      message: input,
      author: user.fullName || "Student",
      avatar: user.imageUrl,
      timestamp: Date.now(),
    };

    socketRef.current.emit("send_message", data);
    setInput("");
  };

  if (!isSignedIn || !lessonId) return null;

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-white/2 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl shadow-indigo-500/5">
      {/* Real-time Presence Bar */}
      <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 overflow-hidden">
            {members.slice(0, 5).map((member, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: -10 }}
                animate={{ scale: 1, x: 0 }}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden bg-slate-100 dark:bg-white/10"
              >
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px] font-black uppercase">
                    {member.name[0]}
                  </div>
                )}
              </motion.div>
            ))}
            {members.length > 5 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-indigo-600 text-white text-[10px] font-black">
                +{members.length - 5}
              </div>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {members.length} {members.length === 1 ? 'Explorer' : 'Explorers'} Live
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[9px] uppercase tracking-widest">
           <Zap size={10} fill="currentColor" /> Studying Now
        </div>
      </div>

      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <MessageSquare size={40} className="text-slate-300 dark:text-gray-700" />
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Live Study Room</p>
              <p className="text-[10px] font-medium text-slate-400 max-w-[200px]">No messages yet. Be the first to spark a discussion!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.author === (user?.fullName || "Student");
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-4 ${isMe ? "flex-row-reverse" : ""}`}
              >
                <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-white/10 shrink-0 overflow-hidden border border-slate-200 dark:border-white/10">
                  {msg.avatar ? (
                    <img src={msg.avatar} alt={msg.author} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs flex items-center justify-center h-full font-black uppercase">
                      {msg.author[0]}
                    </span>
                  )}
                </div>
                <div className={`flex flex-col ${isMe ? "items-end text-right" : "items-start text-left"}`}>
                  <p className="text-[10px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-tighter mb-1.5 px-1">
                    {msg.author}
                  </p>
                  <div className={`
                    px-5 py-4 rounded-3xl text-[13px] font-semibold leading-relaxed shadow-sm
                    ${isMe 
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20 shadow-xl" 
                      : "bg-white dark:bg-white/5 text-slate-800 dark:text-gray-100 border border-slate-200 dark:border-white/5 rounded-tl-none"}
                  `}>
                    {msg.message}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modern Input Block */}
      <div className="p-6 bg-slate-50/50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5">
        <div className="relative group">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={`Sync with ${members.length - 1} others...`}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] pl-6 pr-16 py-4.5 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all shadow-inner"
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim()}
            className="absolute right-2 top-2 h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:scale-100"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
