"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Send, Bot, X, Minimize2, GraduationCap, DollarSign, Zap, ImagePlus, Sparkles, BrainCircuit } from "lucide-react";
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

function AiLogo({ size = 22 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #0d9488, #6366f1)",
        boxShadow: "0 4px 14px rgba(13,148,136,0.4)",
      }}
    >
      <BrainCircuit size={Math.round(size * 0.58)} className="text-white" strokeWidth={1.8} />
    </div>
  );
}

export default function AssistantWidget() {
  const pathname = usePathname();
  const { user, isLoaded: userLoaded } = useUser();
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("edunova_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("edunova_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Define logic for where the chatbot is needed
  const isNeeded = pathname === "/" || pathname.startsWith("/courses") || pathname.startsWith("/dashboard");

  useEffect(() => {
    // Only show greeting if there's no history
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
    setMessages((prev) => [...prev, userMsg]);

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
            ...messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
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

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "" }]);
    } catch (err) {
      const errorMessage = (err as Error).message;
      const displayError = errorMessage.includes("429") || errorMessage.includes("rate limit")
        ? `⚠️ **Cooldown Active:** ${errorMessage}`
        : `❌ **Error:** ${errorMessage}`;

      setMessages((prev) => [...prev, { role: "assistant", content: displayError }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isNeeded) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed right-6 bottom-6 z-50 group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(13,148,136,0.35)] bg-gradient-to-br from-teal-500 via-teal-600 to-indigo-600 border border-white/15 overflow-hidden transition-all group-hover:shadow-[0_12px_40px_rgba(13,148,136,0.55)]">
              <BrainCircuit size={20} className="text-white" strokeWidth={1.8} />
              <div className="absolute top-0.5 right-0.5">
                <Sparkles size={7} className="text-white/60" />
              </div>
            </div>
          </div>
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="p-0 flex flex-col focus:outline-none border-l border-white/10 backdrop-blur-2xl"
        style={{
          width: "min(100vw, 440px)",
          maxWidth: "100vw",
          background: isDark ? "rgba(11, 17, 32, 0.85)" : "rgba(255, 255, 255, 0.85)"
        }}
      >
        {/* ─── Header ─── */}
        <div className="shrink-0 flex items-center gap-4 px-6 py-5 border-b border-white/10" style={{ background: isDark ? "rgba(15, 26, 46, 0.4)" : "rgba(248, 250, 252, 0.4)" }}>
          <AiLogo size={38} />
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>EduNova Intel</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-pulse" />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-teal-400" : "text-teal-600"}`}>Neural Engine Active</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className={`p-2 rounded-xl transition-all ${isDark ? "text-white/30 hover:text-white hover:bg-white/5" : "text-slate-400 hover:text-slate-900 hover:bg-slate-200/50"}`}>
            <Minimize2 size={18} />
          </button>
        </div>

        {/* ─── Messages ─── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 py-5 space-y-4 overscroll-contain"
          style={{ minHeight: 0, background: isDark ? undefined : "#f8fafc" }}
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
                    <div className="shrink-0 mb-0.5">
                      <AiLogo size={26} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-5 py-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "text-white rounded-br-none"
                        : isDark ? "text-gray-200 rounded-bl-none border border-white/10" : "text-slate-700 rounded-bl-none border border-slate-200"
                    }`}
                    style={isUser ? { background: "linear-gradient(135deg, #0D7068, #115E59)" } : { background: isDark ? "rgba(20, 30, 51, 0.8)" : "rgba(255, 255, 255, 0.9)" }}
                  >
                    {m.image && (
                      <div className="mb-2 rounded-xl overflow-hidden">
                        <img src={m.image} alt="Attached" className="w-full h-auto max-h-40 object-cover" />
                      </div>
                    )}
                    <div className={`prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:my-2 ${isDark ? "prose-invert prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-code:text-teal-300" : "prose-pre:bg-slate-100 prose-pre:border prose-pre:border-slate-200 prose-code:text-teal-600"}`}>
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
              <div className="shrink-0">
                <AiLogo size={26} />
              </div>
              <div className={`px-4 py-3 rounded-2xl rounded-bl-none text-xs flex items-center gap-2 border ${isDark ? "text-gray-400 border-white/10" : "text-slate-500 border-slate-200"}`} style={{ background: isDark ? "#141E33" : "#f1f5f9" }}>
                <Spinner className="size-3.5 text-teal-400" />
                <span>Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ─── Input Area ─── */}
        <div className="shrink-0 px-5 py-4 border-t border-white/5 dark:border-white/5" style={{ background: isDark ? "#0F1A2E" : "#f8fafc" }}>
          {/* Quick chips — show only when early in conversation */}
          {messages.length <= 1 && !loading && (
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => void sendMessage(chip.prompt)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                    isDark
                      ? "border border-white/10 text-white/60 hover:text-white hover:border-teal-500/50 hover:bg-teal-500/10"
                      : "border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-teal-500/50 hover:bg-teal-50"
                  }`}
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
                className={`w-full text-sm rounded-2xl px-4 py-3 resize-none focus-visible:ring-0 ${
                  isDark
                    ? "text-white border-white/10 focus:border-teal-500/50 placeholder:text-white/25"
                    : "text-slate-900 border-slate-200 focus:border-teal-500/50 placeholder:text-slate-400"
                }`}
                style={{ background: isDark ? "#1A2540" : "#ffffff" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`absolute right-3 bottom-3 transition-colors ${isDark ? "text-white/30 hover:text-teal-400" : "text-slate-400 hover:text-teal-600"}`}
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
                  : isDark ? "text-white/20 cursor-not-allowed" : "text-slate-300 cursor-not-allowed"
              }`}
              style={canSend ? { background: "#0F766E" } : { background: isDark ? "#1A2540" : "#e2e8f0" }}
            >
              {loading ? <Spinner className="size-4" /> : <Send size={16} />}
            </button>
          </div>

          <p className={`text-[9px] text-center mt-2 uppercase tracking-widest ${isDark ? "text-white/15" : "text-slate-400"}`}>
            EduNova Intel · Powered by OpenRouter
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
