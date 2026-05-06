"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  ChevronRight,
  Zap,
  Trophy,
  Brain
} from "lucide-react";
import { usePathname } from "next/navigation";
import { backendRequest } from "@/lib/backend-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLearningContext } from "@/contexts/LearningContext";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

export default function EduBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm EduBot, your AI tutor. How can I help you excel today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "How to earn XP?",
    "Tell me about badges",
    "View recent courses"
  ]);
  
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { courseTitle, lessonTitle, transcript, lessonId } = useLearningContext();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Context-aware suggestions based on URL and Learning Context
  useEffect(() => {
    if (lessonTitle) {
      setSuggestions([
        `Summarize ${lessonTitle}`,
        `Explain the core concept`,
        "Quiz me on this",
        "Key takeaways"
      ]);
    } else if (pathname.includes("leaderboard")) {
      setSuggestions(["How do I rank up?", "Who is the top student?", "What is level 10?"]);
    } else if (pathname.includes("accomplishments") || pathname.includes("students")) {
      setSuggestions(["Show my badges", "How to get certified?", "What is Mastery?"]);
    } else {
      setSuggestions(["Latest courses", "How to earn XP?", "Tell me about badges"]);
    }
  }, [pathname, lessonTitle]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await backendRequest<{ ok: boolean, response: string, suggestions?: string[] }>("/ai/chat", {
        method: "POST",
        body: { 
          message: text, 
          context: pathname,
          lessonId,
          lessonTitle,
          courseTitle,
          transcript: transcript // Send transcript to AI
        }
      });

      if (res.ok) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: res.response,
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        if (res.suggestions) setSuggestions(res.suggestions);
      }
    } catch (err) {
      console.error("EduBot error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  // Magnetic trigger logic
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const sX = useSpring(mX, { stiffness: 200, damping: 20 });
  const sY = useSpring(mY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    mX.set(clientX - centerX);
    mY.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    mX.set(0);
    mY.set(0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.8, rotate: 5 }}
            className="absolute bottom-24 right-0 w-[420px] md:w-[480px] h-[650px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.4)] border border-white/20 dark:border-white/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Brain className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase tracking-wider leading-none">EduBot</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                      {lessonTitle ? `Tutoring: ${lessonTitle}` : "Online Tutor"}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/50 dark:bg-transparent"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`
                    max-w-[85%] p-5 rounded-2xl text-base font-semibold leading-relaxed
                    ${msg.sender === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm"}
                  `}>
                    {msg.sender === "bot" ? (
                      <div className="edubot-prose">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions & Input */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSendMessage(s)}
                    className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-violet-500/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(input)}
                  placeholder="Ask your tutor anything..."
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-5 pl-8 pr-16 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
                <button 
                  onClick={() => handleSendMessage(input)}
                  className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Pulse Button */}
      <motion.button
        style={{ x: sX, y: sY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500
          ${isOpen ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-90" : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"}
        `}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Sparkles className="w-8 h-8 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Unread dot */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-4 border-white dark:border-slate-800 rounded-full animate-bounce" />
        )}
      </motion.button>
    </div>
  );
}
