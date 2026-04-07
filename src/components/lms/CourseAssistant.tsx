"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X, ChevronRight, Loader2, Bot, User as UserIcon, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backendRequest } from "@/lib/backend-client";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface CourseAssistantProps {
  lessonId: string;
  courseTitle: string;
  lessonTitle: string;
  transcript?: any[];
}

const SUGGESTIONS = [
  "Summarize this lesson",
  "What are the key takeaways?",
  "Explain the core concept in simple terms",
  "Give me a related practice question"
];

export default function CourseAssistant({ 
  lessonId, 
  courseTitle, 
  lessonTitle, 
  transcript 
}: CourseAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: Message = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await backendRequest<{ text: string }>("/ai/chat", {
        method: "POST",
        body: {
          lessonId,
          message: text,
          history: messages,
          transcript
        }
      });

      setMessages(prev => [...prev, { role: "assistant", text: res.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 group"
      >
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping group-hover:hidden" />
        <Sparkles size={28} className="relative z-10" />
      </motion.button>

      {/* Main Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(20px)" }}
            className="fixed bottom-8 right-8 z-[60] w-[calc(100vw-2rem)] sm:w-[420px] h-[640px] max-h-[calc(100vh-6rem)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[3rem] border border-white/20 dark:border-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-7 bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/30 shadow-lg">
                  <Bot size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider leading-none mb-1">EduNova Intelligence</h4>
                  <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest opacity-80">{courseTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={handleClear}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all"
                  title="Clear Chat"
                >
                  <RefreshCcw size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Message History */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-8 py-8 space-y-6 no-scrollbar"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 relative">
                    <Sparkles size={40} />
                    <div className="absolute inset-0 rounded-[2rem] bg-blue-500/10 animate-pulse scale-125 -z-10" />
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-lg">AI Tutor Active</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed font-medium">
                      I've analyzed the transcript for <span className="text-blue-600 dark:text-blue-400">"{lessonTitle}"</span>. 
                      How can I facilitate your learning today?
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div 
                    className={`max-w-[88%] px-6 py-5 rounded-[2rem] text-xs leading-relaxed shadow-sm
                      ${msg.role === "assistant" 
                        ? "bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white rounded-tl-none border border-slate-200 dark:border-white/5" 
                        : "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-500/20"
                      }`}
                  >
                    <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 dark:bg-white/5 px-6 py-5 rounded-[2rem] rounded-tl-none border border-slate-200 dark:border-white/5 flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-0.3s]" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bottom Actions & Input */}
            <div className="p-8 border-t border-slate-100 dark:border-white/5 space-y-6">
              {/* Quick Suggestions */}
              {messages.length < 4 && (
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSendMessage(s)}
                      className="text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all border border-slate-100 dark:border-white/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                    placeholder="Inquire with AI Assistant..."
                    className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-blue-500/50 rounded-2xl px-6 py-4.5 text-[11px] text-slate-900 dark:text-white outline-none transition-all pr-14 font-semibold"
                  />
                  <button 
                    onClick={() => handleSendMessage(input)}
                    disabled={isThinking || !input.trim()}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 disabled:scale-100"
                  >
                    {isThinking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
