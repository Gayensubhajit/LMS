"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { 
  Send, 
  Sparkles, 
  X, 
  Minimize2, 
  GraduationCap, 
  DollarSign, 
  Zap 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const QUICK_CHIPS = [
  { 
    label: "Recommended courses", 
    icon: Zap, 
    prompt: "What are your top recommended courses for someone starting in 2026?" 
  },
  { 
    label: "Pricing & Plans", 
    icon: DollarSign, 
    prompt: "Tell me about your course pricing and subscription plans." 
  },
  { 
    label: "Browse free content", 
    icon: GraduationCap, 
    prompt: "Show me all the free courses available on EduNova." 
  },
];

export default function AssistantWidget() {
  const { user, isLoaded: userLoaded } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Initialize greeting personally
  useEffect(() => {
    if (messages.length === 0 && userLoaded) {
      const name = user?.firstName ?? "Explorer";
      setMessages([
        {
          role: "assistant",
          content: `Welcome to EduNova Intel, ${name}. I am your neural learning guide. How can I accelerate your journey today?`,
        },
      ]);
    }
  }, [userLoaded, user?.firstName, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendMessage = async (overrideText?: string) => {
    const text = overrideText ?? input.trim();
    if (!text || loading) return;

    setLoading(true);
    if (!overrideText) setInput("");

    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.5,
          userName: user?.firstName,
          messages: [
            ...messages.slice(-8).filter((m) => m.role !== "system"),
            userMessage,
          ],
        }),
      });

      const data: { reply?: string; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I encountered a neural synchronization error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 50px rgba(124,58,237,0.8)" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed right-6 bottom-6 z-50 w-16 h-16 rounded-full hidden md:flex items-center justify-center border-2 border-violet-500/50 group overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 30px rgba(124,58,237,0.3)",
          }}
        >
          <div className="absolute inset-0 bg-violet-600/10 group-hover:bg-violet-600/30 transition-colors" />
          <Sparkles className="size-7 text-violet-400 group-hover:text-white transition-all duration-300 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 border-4 border-violet-500/20 rounded-full" 
          />
        </motion.button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="p-0 border-l border-white/10 w-full sm:max-w-md shadow-2xl flex flex-col focus:outline-none"
        style={{ background: "#050510", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="relative overflow-hidden border-b border-white/5 py-6 px-8 bg-black/40">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Sparkles className="size-6 text-violet-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-white text-xl tracking-tight uppercase italic">EduNova <span className="text-violet-500">Intel</span></h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Neural Sync Active
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-auto p-2 text-gray-500 hover:text-white transition-colors">
              <Minimize2 size={20} />
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-8">
          <div className="flex flex-col gap-6 py-8">
            <AnimatePresence initial={false}>
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={`${m.role}-${idx}`}
                    initial={{ opacity: 0, x: isUser ? 20 : -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={[
                        "max-w-[90%] px-5 py-4 text-sm leading-relaxed font-medium",
                        isUser
                          ? "bg-violet-600 border border-violet-400/30 rounded-[24px] rounded-tr-none text-white shadow-xl shadow-violet-900/20"
                          : "bg-white/5 border border-white/10 rounded-[24px] rounded-tl-none text-gray-200 backdrop-blur-3xl",
                      ].join(" ")}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 text-xs text-violet-400 flex items-center gap-3 italic font-bold tracking-tight">
                  <Spinner className="size-4" />
                  <span>Synthesizing Knowledge...</span>
                </div>
              </motion.div>
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <div className="p-8 border-t border-white/5 bg-black/40">
          {messages.length < 4 && !loading && (
            <div className="flex flex-col gap-2 mb-6">
              {QUICK_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => void sendMessage(chip.prompt)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-600/10 text-left text-xs font-bold text-gray-400 hover:text-white transition-all group"
                >
                  <chip.icon size={14} className="text-violet-500 group-hover:scale-110 transition-transform" />
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); void sendMessage(); }} className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }}
              placeholder="Query the EduNova Neural Engine..."
              className="min-h-[80px] max-h-[160px] w-full bg-white/5 border-white/10 focus:border-violet-500/50 rounded-3xl p-5 text-sm text-white resize-none pr-14 transition-all focus-visible:ring-0 placeholder:text-gray-700 font-bold"
            />
            <button
              type="submit"
              disabled={!canSend}
              className={`absolute right-4 bottom-4 p-3 rounded-2xl transition-all ${
                canSend 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/40 hover:scale-105 active:scale-95" 
                  : "bg-white/5 text-gray-700"
              }`}
            >
              {loading ? <Spinner className="size-4" /> : <Send className="size-4" />}
            </button>
          </form>
          <div className="flex items-center justify-center gap-2 mt-4 opacity-30">
             <Sparkles size={10} className="text-violet-500" />
             <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Neural Engine V4.0</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
