"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  room: string;
  message: string;
  author: string;
  avatar?: string;
  timestamp: number;
};

type Props = {
  courseId?: string;
  courseTitle?: string;
};

export default function LiveChat({ courseId, courseTitle }: Props) {
  const { user, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSignedIn || !courseId) return;

    // Connect to socket server
    socketRef.current = io("http://localhost:3001");

    socketRef.current.emit("join_room", courseId);

    socketRef.current.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [courseId, isSignedIn]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !user || !courseId) return;

    const data: Message = {
      room: courseId,
      message: input,
      author: user.fullName || "Student",
      avatar: user.imageUrl,
      timestamp: Date.now(),
    };

    socketRef.current.emit("send_message", data);
    setInput("");
  };

  if (!isSignedIn || !courseId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-[0_8px_32px_rgba(124,58,237,0.4)] hover:bg-violet-500 transition-all group"
          >
            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#08080f] rounded-full" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ 
                y: 0, 
                opacity: 1, 
                scale: 1,
                height: isMinimized ? 64 : 500,
                width: 360
            }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-[#0a0a14] border border-slate-200 dark:border-violet-500/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                  Live Chat: {courseTitle || "Course Room"}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5"
                >
                  {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-white/50 dark:bg-transparent"
                >
                  <div className="text-center py-4">
                    <p className="text-[10px] text-slate-400 dark:text-gray-600 font-bold uppercase tracking-widest">
                      Welcome to the live chat!
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-gray-700 mt-1">
                        Interact with other students in real-time.
                    </p>
                  </div>

                  {messages.map((msg, i) => {
                    const isMe = msg.author === (user?.fullName || "Student");
                    return (
                      <div 
                        key={i} 
                        className={`flex items-start gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                      >
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-white/10 shrink-0 overflow-hidden border border-slate-200 dark:border-white/10">
                          {msg.avatar ? (
                            <img src={msg.avatar} alt={msg.author} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] flex items-center justify-center h-full font-bold">
                              {msg.author[0]}
                            </span>
                          )}
                        </div>
                        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <p className="text-[9px] text-slate-500 dark:text-gray-500 font-bold mb-0.5 px-1 text-[8px]">
                            {msg.author}
                          </p>
                          <div className={`px-3 py-2 rounded-2xl text-xs max-w-[240px] shadow-sm ${
                            isMe 
                              ? "bg-violet-600 text-white rounded-tr-none" 
                              : "bg-white dark:bg-white/5 text-slate-900 dark:text-gray-200 border border-slate-100 dark:border-white/5 rounded-tl-none"
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5">
                  <div className="relative flex items-center gap-2">
                    <input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-violet-500/50"
                    />
                    <button 
                      onClick={sendMessage}
                      className="p-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
