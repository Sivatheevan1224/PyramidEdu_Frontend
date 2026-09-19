"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Sparkles, Trash2, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "../types/chat.types";
import { sendChatMessage, getChatSession, clearChatHistory, deleteChatMessage } from "../services/chat.api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const starters = [
  "Show my students results calculations",
  "Predict at-risk students this month",
  "Show my class roster and student count",
  "Show my upcoming class schedule",
  "What is my class average score?",
  "Show my exams and tests overview",
  "What study materials have I uploaded?",
  "Generate a 5-question quiz on Physics",
];

const formatMessage = (text: string) => {
  if (!text) return "";
  // Normalize **[text](url)** to [text](url) to avoid outer bold blocking link parsing
  const normalized = text.replace(/\*\*(\[[^\]]+\]\([^)]+\))\*\*/g, '$1');

  // Match:
  // 1. Markdown link: [Title](url)
  // 2. Raw URL: http:// or https:// or www.
  // 3. Bold text: **text**
  const regex = /(\[[^\]]+\]\([^)]+\)|(?:https?:\/\/|www\.)[^\s<)]+|\*\*[^*]+\*\*)/g;
  const parts = normalized.split(regex);

  return parts.filter(Boolean).map((part, idx) => {
    // Check markdown link: [title](url)
    const mdMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (mdMatch) {
      const [, title, url] = mdMatch;
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
      return (
        <a
          key={idx}
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 break-all"
        >
          {title}
          <ExternalLink className="h-3 w-3 inline" />
        </a>
      );
    }

    // Check raw URL
    const urlMatch = part.match(/^(?:https?:\/\/|www\.)[^\s<)]+/);
    if (urlMatch) {
      const url = urlMatch[0];
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
      return (
        <a
          key={idx}
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 break-all"
        >
          {url}
          <ExternalLink className="h-3 w-3 inline" />
        </a>
      );
    }

    // Check bold text
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={idx} className="font-semibold text-slate-100">
          {boldMatch[1]}
        </strong>
      );
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
  const [isClearing, setIsClearing] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height as message length changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const getStorageKey = () => `chat_messages_${user?.id || 'guest'}`;

  const getWelcomeMessage = (): Message => ({
    id: "welcome",
    role: "assistant",
    text: `Hi ${user?.fullName || "there"}! I'm your PyramidEdu AI Teaching Assistant. 🎓

I can assist you with:
• 📊 **Student Results & Performance Calculations**
• ⚠️ **At-Risk & Low-Performing Student Identification**
• 👥 **Class Rosters & Enrolled Student Breakdown**
• 📈 **Class-wide Average & Performance Analytics**
• 📅 **Class Attendance & Session Records**
• 📝 **Exams & Assessment Statistics**
• 📚 **Uploaded Study Notes & Materials**
• 💡 **Quiz Drafting, Question Creation & Lesson Outlines**

How can I help you today?`,
    timestamp: new Date().toISOString(),
  });

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
      setMessages([getWelcomeMessage()]);
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
    const updatedMessages = [...messages.filter(m => m.id !== "welcome"), userMsg];
    setMessages(updatedMessages);
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    
    setInput("");
    setTyping(true);

    try {
      // Step 2 & 3: Insert into DB and get AI response
      const response = await sendChatMessage(text, conversationId);
      
      if (response.success && response.data) {
        const { userMessage, answerMessage, conversationId: newConvoId } = response.data;
        
        if (!conversationId && newConvoId) {
          setConversationId(newConvoId);
        }

        setMessages((prev) => {
          // Replace temp user message with DB confirmed message
          const filtered = prev.filter(m => 
            m.id !== tempId && 
            m.id !== userMessage.id && 
            m.id !== answerMessage.id
          );
          
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
      console.error("Chat Error:", error);
      const backendErrorMsg = error.response?.data?.message || error.message;
      setMessages((m) => {
        const errorMsgs = [
          ...m,
          {
            id: `err_${Date.now()}`,
            role: "assistant",
            text: `⚠️ **Error:** ${backendErrorMsg || "An unexpected error occurred while communicating with the assistant. Please try again."}`,
            timestamp: new Date().toISOString(),
          } as Message
        ];
        localStorage.setItem(storageKey, JSON.stringify(errorMsgs));
        return errorMsgs;
      });
    } finally {
      setTyping(false);
    }
  };

  const handleClearHistory = async () => {
    setShowClearModal(false);
    setIsClearing(true);
    try {
      await clearChatHistory(conversationId);
      const storageKey = getStorageKey();
      const welcome = [getWelcomeMessage()];
      setMessages(welcome);
      localStorage.setItem(storageKey, JSON.stringify(welcome));
      setConversationId(undefined);
      toast.success("Chat history cleared successfully");
    } catch (error: any) {
      console.error("Failed to clear chat history:", error);
      toast.error(error.response?.data?.message || "Could not clear chat history. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteSingleMessage = async (messageId?: string) => {
    if (!messageId || messageId === "welcome" || messageId.startsWith("temp_") || messageId.startsWith("err_")) {
      // For local-only messages, remove directly from UI state
      const updated = messages.filter((m) => m.id !== messageId);
      const finalMsgs = updated.length === 0 ? [getWelcomeMessage()] : updated;
      setMessages(finalMsgs);
      localStorage.setItem(getStorageKey(), JSON.stringify(finalMsgs));
      return;
    }

    setDeletingMessageId(messageId);
    const previousMessages = [...messages];
    const updated = messages.filter((m) => m.id !== messageId);
    const finalMsgs = updated.length === 0 ? [getWelcomeMessage()] : updated;

    setMessages(finalMsgs);
    localStorage.setItem(getStorageKey(), JSON.stringify(finalMsgs));

    try {
      await deleteChatMessage(messageId);
      toast.success("Message deleted");
    } catch (error: any) {
      console.error("Failed to delete message:", error);
      toast.error(error.response?.data?.message || "Failed to delete message");
      setMessages(previousMessages);
      localStorage.setItem(getStorageKey(), JSON.stringify(previousMessages));
    } finally {
      setDeletingMessageId(null);
    }
  };

  const hasRealMessages = messages.some((m) => m.id !== "welcome");

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full flex-col">
      <Card className="flex flex-1 flex-col overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">PyramidEdu AI Assistant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                {typing ? "Generating response..." : "Always available"}
              </p>
            </div>
          </div>

          {hasRealMessages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearModal(true)}
              disabled={isClearing}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 rounded-xl transition-all gap-1.5 cursor-pointer shadow-xs"
              title="Clear all chat history"
            >
              {isClearing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              <span>Clear Chat</span>
            </Button>
          )}
        </div>

        {/* Messages List */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const canDelete = m.id !== "welcome";
            const isDeleting = deletingMessageId === m.id;

            return (
              <div
                key={m.id || i}
                className={cn("group flex gap-2.5 items-end", isUser ? "flex-row-reverse" : "flex-row")}
              >
                <Avatar className="h-8 w-8 shrink-0 mb-1">
                  <AvatarFallback className={cn(
                    "text-xs font-bold",
                    isUser
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                      : "bg-indigo-600 text-white"
                  )}>
                    {isUser ? "You" : "AI"}
                  </AvatarFallback>
                </Avatar>

                <div className={cn(
                  "max-w-[78%] whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs relative",
                  isUser
                    ? "rounded-tr-xs bg-indigo-600 text-white"
                    : "rounded-tl-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800"
                )}>
                  {formatMessage(m.text)}
                  {m.timestamp && (
                    <div className={cn(
                      "text-[10px] mt-1 text-right select-none",
                      isUser ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"
                    )}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                {/* Individual Message Delete Button (hover action) */}
                {canDelete && (
                  <button
                    onClick={() => handleDeleteSingleMessage(m.id)}
                    disabled={isDeleting}
                    className={cn(
                      "opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer mb-1 shrink-0",
                      isDeleting && "opacity-100"
                    )}
                    title="Delete message"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            );
          })}

          {typing && (
            <div className="flex gap-2.5 items-end">
              <Avatar className="h-8 w-8 shrink-0 mb-1">
                <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">AI</AvatarFallback>
              </Avatar>
              <div className="rounded-2xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-4 py-3 shadow-xs">
                <div className="flex items-center gap-1.5 py-0.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestion Starter Chips */}
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !typing) {
              send(input);
            }
          }}
          className="flex items-end gap-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5"
        >
          <div className="relative flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !typing) {
                    send(input);
                  }
                }
              }}
              placeholder="Ask about student performance, at-risk alerts, class schedules, exams, or teaching ideas... (Shift + Enter for new line)"
              className="w-full min-h-[44px] max-h-44 resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 overflow-y-auto leading-relaxed"
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || typing}
            className="h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm shrink-0 flex items-center justify-center mb-0.5"
            title="Send message (Enter)"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Confirmation Modal for Clear Chat */}
        {showClearModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 shrink-0">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Clear Conversation?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to clear your chat history? All messages in this conversation will be permanently removed.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearModal(false)}
                  className="text-xs font-semibold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All Messages
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
