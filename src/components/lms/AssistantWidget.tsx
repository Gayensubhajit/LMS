"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Send, Sparkles, X, Minimize2 } from "lucide-react";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export default function AssistantWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m your EduNova learning assistant. Ask me anything about courses, roadmaps, or next steps in your learning journey.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setLoading(true);
    setInput("");

    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.5,
          messages: [
            ...messages.slice(-8).filter((m) => m.role !== "system"),
            userMessage,
          ],
        }),
      });

      const data: { reply?: string; error?: string } = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? `Assistant failed (${res.status})`);
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply ?? "",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const message =
        (err as Error)?.message ??
        "Something went wrong contacting the assistant.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(124,58,237,0.6)" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full flex items-center justify-center border border-violet-500/30 group"
          style={{
            background: "rgba(124,58,237,0.15)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 25px rgba(124,58,237,0.4)",
          }}
          aria-label="Open AI assistant"
        >
          {/* Pulsing glow */}
          <div className="absolute inset-0 rounded-full animate-pulse bg-violet-500/10" />
          <Sparkles className="size-6 text-violet-400 group-hover:text-white transition-colors" />
        </motion.button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="p-0 border-l border-white/10 w-full sm:max-w-md shadow-2xl"
        style={{ 
          background: "rgba(8,10,16,0.95)", 
          backdropFilter: "blur(24px)" 
        }}
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-white/5 py-5 px-6">
          {/* Header background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <Sparkles className="size-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-tight">Pioneer Assistant</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Adaptive Intelligence
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="ml-auto p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Minimize2 size={18} />
            </button>
          </div>
        </div>

        {/* Message area */}
        <ScrollArea className="h-[calc(100vh-145px)] px-6">
          <div className="flex flex-col gap-5 py-6">
            <AnimatePresence initial={false}>
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={`${m.role}-${idx}`}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={[
                        "max-w-[88%] px-4 py-3 text-sm leading-relaxed",
                        isUser
                          ? "bg-violet-600/20 border border-violet-500/30 rounded-2xl rounded-tr-none text-white shadow-[0_4px_15px_rgba(124,58,237,0.1)]"
                          : "bg-white/5 border border-white/10 rounded-2xl rounded-tl-none text-gray-300 backdrop-blur-md",
                      ].join(" ")}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-400 backdrop-blur-md flex items-center gap-3">
                  <Spinner className="size-3" />
                  <span>Synthesizing response...</span>
                </div>
              </motion.div>
            )}

            <div ref={endRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 p-6 bg-transparent">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
            className="relative"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Ask me anything..."
              className="min-h-[60px] max-h-[160px] w-full bg-white/5 border-white/10 focus:border-violet-500/50 rounded-2xl p-4 text-sm text-white resize-none pr-12 transition-all ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-600"
            />

            <button
              type="submit"
              disabled={!canSend}
              className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
                canSend 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" 
                  : "bg-white/5 text-gray-600 cursor-not-allowed"
              }`}
            >
              {loading ? <Spinner className="size-4" /> : <Send className="size-4" />}
            </button>
          </form>
          <p className="text-[10px] text-gray-600 mt-2 text-center font-medium uppercase tracking-widest opacity-50">
            Powered by EduNova AI Neural Engine
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

