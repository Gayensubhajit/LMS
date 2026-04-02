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
  Zap,
  Image as ImageIcon,
  Paperclip
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessage = { 
  role: "user" | "assistant" | "system"; 
  content: string | any;
  image?: string;
};

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    // Small delay to ensure the content is rendered before scrolling
    const timer = setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const canSend = useMemo(() => (input.trim().length > 0 || selectedImage) && !loading, [input, selectedImage, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const text = overrideText ?? input.trim();
    if ((!text && !selectedImage) || loading) return;

    setLoading(true);
    if (!overrideText) setInput("");
    
    const userImage = selectedImage;
    setSelectedImage(null);

    const userMessage: ChatMessage = { 
      role: "user", 
      content: text,
      image: userImage ?? undefined
    };
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Build the multimodal payload if an image exists
      const contentPayload = userImage 
        ? [
            { type: "text", text: text || "Analyze this image." },
            { type: "image_url", image_url: { url: userImage } }
          ]
        : text;

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: user?.firstName,
          messages: [
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: contentPayload }
          ],
        }),
      });

      const data: { reply?: string; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I encountered a neural synchronization error. Please check your deployment environment variables." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 bg-[#0A192F] shadow-2xl group transition-all"
        >
          <Sparkles className="size-6 text-white group-hover:scale-110 transition-transform" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute inset-0 bg-white rounded-2xl" 
          />
        </motion.button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="p-0 border-l border-white/5 w-full sm:max-w-md shadow-2xl flex flex-col focus:outline-none bg-[#020617]"
      >
        {/* Header - Solid Deep Sea */}
        <div className="border-b border-white/5 py-5 px-6 bg-[#0A192F]">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="size-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base tracking-tight uppercase">EduNova <span className="opacity-50">Intel</span></h3>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Active Guide
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
              <Minimize2 size={18} />
            </button>
          </div>
        </div>

        {/* Message Container - Fix scroll */}
        <div className="flex-grow relative h-0"> 
          <ScrollArea className="h-full px-6">
            <div className="flex flex-col gap-6 py-6 pb-12">
              <AnimatePresence initial={false}>
                {messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  return (
                    <motion.div
                      key={`${m.role}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`
                        max-w-[85%] px-5 py-4 text-sm leading-relaxed
                        ${isUser 
                          ? "bg-white text-black rounded-3xl rounded-tr-none font-medium" 
                          : "bg-white/5 border border-white/10 text-white rounded-3xl rounded-tl-none"}
                      `}>
                        {m.image && (
                          <div className="mb-3 rounded-xl overflow-hidden border border-white/10">
                            <img src={m.image} alt="Upload" className="w-full h-auto object-cover max-h-48" />
                          </div>
                        )}
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {typeof m.content === 'string' ? m.content : m.content[0]?.text ?? ""}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 text-xs text-white/50 flex items-center gap-3 font-medium">
                    <Spinner className="size-4" />
                    <span>Processing Knowledge...</span>
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Footer - Input Area */}
        <div className="p-6 border-t border-white/5 bg-[#0A192F]/50">
          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="mb-4 relative w-20 h-20 group">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-xl border border-white/20 shadow-xl" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {messages.length < 3 && !loading && !selectedImage && (
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => void sendMessage(chip.prompt)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-[10px] font-bold text-white/60 hover:text-white transition-all"
                >
                  <chip.icon size={12} />
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="relative flex items-end gap-2">
              <div className="flex-grow relative">
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
                  className="min-h-[100px] max-h-[200px] w-full bg-white/5 border-white/10 focus:border-white/30 rounded-3xl p-5 text-sm text-white resize-none transition-all focus-visible:ring-0 placeholder:text-white/20"
                />
                
                <div className="absolute left-4 bottom-4 flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button
                    className="p-2 text-white/40 hover:text-white transition-colors"
                  >
                    <Paperclip size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => void sendMessage()}
                disabled={!canSend}
                className={`p-4 rounded-full transition-all flex items-center justify-center ${
                  canSend ? "bg-white text-black shadow-xl hover:scale-105 active:scale-95" : "bg-white/5 text-white/10"
                }`}
              >
                {loading ? <Spinner className="size-5" /> : <Send className="size-5" />}
              </button>
            </div>
            <p className="text-[9px] text-white/20 text-center uppercase tracking-[0.2em] font-black">
              Neural Guide 4.0 // No-Cost Intelligence
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
