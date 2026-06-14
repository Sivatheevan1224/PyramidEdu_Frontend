"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "../types/chat.types";
import { sendChatMessage, getChatSession } from "../services/chat.api";
import { useAuth } from "@/context/AuthContext";

const starters = [
  "How is Grade 10-A performing this term?",
  "Predict at-risk students this month",
  "Generate a reminder for unpaid fees",
  "Summarize today's attendance",
];

const formatMessage = (text: string) => {
  if (!text) return "";
  // Split by both bold (**text**) and markdown links ([text](url))
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
            key={idx}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80 transition-colors"
          >
            {match[1]}
          </a>
        );
      }
    }
    return part;
  });
};

export function AiChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const getStorageKey = () => `chat_messages_${user?.id || 'guest'}`;

  // 1. Initial Load: localStorage -> Database Sync
  useEffect(() => {
    if (!user) return;

    const storageKey = getStorageKey();
    
    // Step 1: Check localStorage first for instant UI
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        setMessages(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to parse cached messages", e);
      }
    } else {
      // Default welcome message
      setMessages([{ role: "assistant", text: "Hi! I'm your PyramidEdu RAG assistant. Ask me anything about the uploaded study materials and notes." }]);
    }

    // Step 2: Fetch from Database to sync
    const syncDatabase = async () => {
      try {
        const res = await getChatSession();
        if (res.success && res.data) {
          if (res.data.id) setConversationId(res.data.id);
          
          if (res.data.messages && res.data.messages.length > 0) {
            const dbMessages: Message[] = res.data.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              text: m.content,
              timestamp: m.createdAt,
            }));
            
            // Step 3: Update UI with DB truth and update cache
            setMessages(dbMessages);
            localStorage.setItem(storageKey, JSON.stringify(dbMessages));
          }
        }
      } catch (err) {
        console.error("Failed to sync chat session", err);
      }
    };

    syncDatabase();
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;

    const storageKey = getStorageKey();
    const tempId = `temp_${Date.now()}`;
    const userMsg: Message = { id: tempId, role: "user", text, timestamp: new Date().toISOString() };
    
    // Step 1: Save to localStorage immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    
    setInput("");
    setTyping(true);

    try {
      // Step 2 & 3: Insert into DB and get AI response
      const response = await sendChatMessage(text, conversationId);
      
      if (response.success && response.data) {
        const { userMessage, answerMessage, answer, conversationId: newConvoId } = response.data;
        
        if (!conversationId && newConvoId) {
          setConversationId(newConvoId);
        }

        setMessages((prev) => {
          // Replace temp user message with DB confirmed message
          const filtered = prev.filter(m => m.id !== tempId);
          
          const finalMessages: Message[] = [
            ...filtered,
            { id: userMessage.id, role: userMessage.role, text: userMessage.message, timestamp: userMessage.timestamp },
            { id: answerMessage.id, role: answerMessage.role, text: answerMessage.message, timestamp: answerMessage.timestamp }
          ];
          
          // Step 5: Save AI response to localStorage
          localStorage.setItem(storageKey, JSON.stringify(finalMessages));
          return finalMessages;
        });
      } else {
        throw new Error(response.message || "Failed to generate answer");
      }
    } catch (error: any) {
      console.error("RAG Chat Error:", error);
      const backendErrorMsg = error.response?.data?.message || error.message;
      setMessages((m) => {
        const errorMsgs = [
          ...m,
          {
            role: "assistant",
            text: `⚠️ **Error:** ${backendErrorMsg || "An unexpected error occurred while communicating with the RAG service. Please try again."}`,
          } as Message
        ];
        localStorage.setItem(storageKey, JSON.stringify(errorMsgs));
        return errorMsgs;
      });
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full flex-col">
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-gradient-hero px-5 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">PyramidEdu RAG Assistant</h3>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> RAG-powered study notes assistant
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={m.id || i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
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
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your study materials..." className="h-11" />
          <Button type="submit" variant="hero" size="icon" className="h-11 w-11"><Send className="h-4 w-4" /></Button>
        </form>
      </Card>
    </div>
  );
}
