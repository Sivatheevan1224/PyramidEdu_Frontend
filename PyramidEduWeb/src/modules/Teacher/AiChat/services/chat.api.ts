import { api } from "@/lib/api";

export const sendChatMessage = async (question: string, conversationId?: string, subjectId?: string, batchId?: string) => {
  const res = await api.post("/chat/ask", { question, conversationId, subjectId, batchId });
  return res.data;
};

export const getChatSession = async () => {
  const res = await api.get("/chat/session");
  return res.data;
};
