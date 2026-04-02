"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Send, Bot, X, Minimize2, GraduationCap, DollarSign, Zap, ImagePlus } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessage = { 
  role: "user" | "assistant" | "system"; 
  content: string;
  image?: string;
};

const QUICK_CHIPS = [
  { label: "Top courses for 2026", icon: Zap, prompt: "What are the best courses to take in 2026?" },
  { label: "Free courses", icon: GraduationCap, prompt: "Show me all the free courses on EduNova." },
  { label: "Pricing info", icon: DollarSign, prompt: "What are the pricing plans and costs?" },
];

export default function AssistantWidget() {
  const { user, isLoaded: userLoaded } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && userLoaded) {
      const name = user?.firstName ?? "there";
      setMessages([{
        role: "assistant",
        content: `Hey ${name}! 👋 I'm **EduNova Intel**, your personal learning guide. Ask me anything about our courses, pricing, or your learning path!`,
      }]);
    }
  }, [userLoaded, user?.firstName, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const canSend = useMemo(() => (input.trim().length > 0 || !!selectedImage) && !loading, [input, selectedImage, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
    // Reset the file input so the same file can be selected again
    e.target.value = "";
  };

  const sendMessage = async (overrideText?: string) => {
    const text = overrideText ?? input.trim();
    if ((!text && !selectedImage) || loading) return;

    setLoading(true);
    if (!overrideText) setInput("");
    const capturedImage = selectedImage;
    setSelectedImage(null);

    const userMsg: ChatMessage = { role: "user", content: text, image: capturedImage ?? undefined };
    setMessages(prev => [...prev, userMsg]);

    try {
      const contentPayload = capturedImage
        ? [{ type: "text", text: text || "Please analyze this image." }, { type: "image_url", image_url: { url: capturedImage } }]
        : text;

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: user?.firstName,
          messages: [
            ...messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: contentPayload },
          ],
        }),
      });

      const data: { reply?: string; error?: string } = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Neural Engine Cooling: OpenRouter free tier rate limit hit. Please wait 10-15 minutes or try again later.");
        }
        throw new Error(data.error ?? `Server error (${res.status})`);
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: data.reply ?? "" }]);
    } catch (err) {
      const errorMessage = (err as Error).message;
      const displayError = errorMessage.includes("429") || errorMessage.includes("rate limit")
        ? `⚠️ **Cooldown Active:** ${errorMessage}`
        : `❌ **Error:** ${errorMessage}`;
        
      setMessages(prev => [...prev, { role: "assistant", content: displayError }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          aria-label="Open AI Assistant"
          className="fixed right-5 bottom-5 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
          style={{ background: "linear-gradient(135deg, #0F766E, #14B8A6)" }}
        >
          <Bot className="size-6 text-white" />
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="p-0 flex flex-col focus:outline-none border-l border-white/5"
        style={{ 
          width: "min(100vw, 420px)", 
          maxWidth: "100vw",
          background: "#0B1120" 
        }}
      >
        {/* ─── Header ─── */}
        <div className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-white/5" style={{ background: "#0F1A2E" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#0F766E" }}>
            <Bot size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white tracking-wide">EduNova Intel</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest">Active</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors">
            <Minimize2 size={16} />
          </button>
        </div>

        {/* ─── Messages ─── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 py-5 space-y-4 overscroll-contain"
          style={{ minHeight: 0 }}
        >
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 shrink-0 rounded-xl flex items-center justify-center mb-0.5" style={{ background: "#0F766E" }}>
                      <Bot size={13} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "text-white rounded-br-none"
                        : "text-gray-200 rounded-bl-none border border-white/10"
                    }`}
                    style={isUser ? { background: "#0F766E" } : { background: "#141E33" }}
                  >
                    {m.image && (
                      <div className="mb-2 rounded-xl overflow-hidden">
                        <img src={m.image} alt="Attached" className="w-full h-auto max-h-40 object-cover" />
                      </div>
                    )}
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:my-2 prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-code:text-teal-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2"
            >
              <div className="w-7 h-7 shrink-0 rounded-xl flex items-center justify-center" style={{ background: "#0F766E" }}>
                <Bot size={13} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-none text-xs text-gray-400 flex items-center gap-2 border border-white/10" style={{ background: "#141E33" }}>
                <Spinner className="size-3.5 text-teal-400" />
                <span>Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ─── Input Area ─── */}
        <div className="shrink-0 px-5 py-4 border-t border-white/5" style={{ background: "#0F1A2E" }}>
          {/* Quick chips — show only when early in conversation */}
          {messages.length <= 1 && !loading && (
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => void sendMessage(chip.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-semibold text-white/60 hover:text-white hover:border-teal-500/50 hover:bg-teal-500/10 transition-all"
                >
                  <chip.icon size={11} className="text-teal-400" />
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Image preview */}
          {selectedImage && (
            <div className="mb-3 relative w-16 h-16 group">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-xl border border-white/20" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          )}

          {/* Message input */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Ask anything..."
                rows={2}
                className="w-full text-sm text-white rounded-2xl px-4 py-3 resize-none border-white/10 focus:border-teal-500/50 focus-visible:ring-0 placeholder:text-white/25"
                style={{ background: "#1A2540" }}
              />
              {/* Image attach button inside textarea */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-3 bottom-3 text-white/30 hover:text-teal-400 transition-colors"
                title="Attach image"
              >
                <ImagePlus size={17} />
              </button>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>

            <button
              onClick={() => void sendMessage()}
              disabled={!canSend}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                canSend
                  ? "text-white hover:scale-105 active:scale-95 shadow-lg"
                  : "text-white/20 cursor-not-allowed"
              }`}
              style={canSend ? { background: "#0F766E" } : { background: "#1A2540" }}
            >
              {loading ? <Spinner className="size-4" /> : <Send size={16} />}
            </button>
          </div>

          <p className="text-[9px] text-white/15 text-center mt-2 uppercase tracking-widest">
            EduNova Intel · Powered by OpenRouter
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
