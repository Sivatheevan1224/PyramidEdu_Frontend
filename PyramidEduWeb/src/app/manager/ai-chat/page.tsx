"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; text: string; }

const starters = [
  "How is Grade 10-A performing this term?",
  "Predict at-risk students this month",
  "Generate a reminder for unpaid fees",
  "Summarize today's attendance",
];

const formatMessage = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export default function AiChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hi! I'm your PyramidEdu assistant. Ask me anything about students, attendance, fees or performance." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;

    const updatedMessages: Msg[] = [...messages, { role: "user", text }];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured. Please check your .env.local file.");
      }

      // Convert local message format to the Gemini API expectations (role: "user" | "model")
      const contents = updatedMessages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      const systemInstruction = {
        parts: [
          {
            text: "You are PyramidEdu AI, a highly intelligent and helpful educational assistant for school administrators and managers. You help manage school operations, analyze student performance, draft friendly parent/student fee and attendance reminders, structure class quizzes, plan lessons, and answer operational questions. Keep your responses friendly, professional, well-structured, and concise. Use clean markdown formatting (bolding, lists, etc.) to make information easily readable.",
          },
        ],
      };

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents,
            systemInstruction,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!replyText) {
        throw new Error("Received an empty response from the AI assistant.");
      }

      setMessages((m) => [...m, { role: "assistant", text: replyText }]);
    } catch (error: any) {
      console.error("Gemini API error:", error);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `⚠️ **Error:** ${error.message || "An unexpected error occurred while communicating with the AI. Please try again."}`,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-3xl flex-col">
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-gradient-hero px-5 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">PyramidEdu Assistant</h3>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> AI-powered insights
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className={m.role === "assistant" ? "bg-gradient-primary text-primary-foreground text-xs" : "bg-secondary text-secondary-foreground text-xs"}>
                  {m.role === "assistant" ? "AI" : "You"}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                m.role === "assistant" ? "rounded-tl-sm bg-muted text-foreground" : "rounded-tr-sm bg-gradient-primary text-primary-foreground"
              )}>{formatMessage(m.text)}</div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">AI</AvatarFallback></Avatar>
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2 border-t border-border bg-muted/30 p-3">
            {starters.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-base hover:border-primary hover:text-primary">
                {s}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-border bg-card p-3">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="h-11" />
          <Button type="submit" variant="hero" size="icon" className="h-11 w-11"><Send className="h-4 w-4" /></Button>
        </form>
      </Card>
    </div>
  );
}
