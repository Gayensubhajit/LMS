"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Bot, Send, Sparkles } from "lucide-react";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export default function AssistantWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m your EduNova learning assistant. Ask me anything about courses, roadmaps, or next steps.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
            // Keep this small: it's a marketing site; don't blow up tokens.
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
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon-lg"
          className="fixed right-6 bottom-6 z-50 rounded-full shadow-[0_0_25px_rgba(124,58,237,0.45)]"
          aria-label="Open AI assistant"
        >
          <Bot className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-0">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-purple-500/20">
            <Sparkles className="size-4 text-primary" />
          </span>
          <div>
            <div className="font-bold text-foreground">EduNova Assistant</div>
            <div className="text-xs text-muted-foreground">
              Cursor-friendly learning help
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)] px-4">
          <div className="flex flex-col gap-3 py-4 pr-2">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={`${m.role}-${idx}`}
                  className={[
                    "rounded-2xl border px-3 py-2 text-sm whitespace-pre-wrap",
                    isUser
                      ? "ml-auto max-w-[86%] bg-primary/10 border-primary/20 text-foreground"
                      : "mr-auto max-w-[86%] bg-background/60 border-border text-foreground",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              );
            })}

            {loading ? (
              <div className="mr-auto max-w-[86%] rounded-2xl border border-border bg-background/60 px-3 py-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Spinner />
                  Thinking...
                </div>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>
        </ScrollArea>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage();
          }}
          className="border-t border-border px-4 py-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about courses, roadmaps, or next steps..."
            rows={3}
          />

          <div className="mt-3 flex items-center justify-end gap-2">
            <Button type="submit" disabled={!canSend}>
              <Send className="size-4" />
              Send
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

