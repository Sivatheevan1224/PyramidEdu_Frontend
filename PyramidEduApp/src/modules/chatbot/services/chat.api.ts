import client from "../../../api/client";
import { BASE_API_URL } from "../../../api/config";

export const sendChatMessage = async (question: string, conversationId?: string) => {
  const res = await client.post("/chat/ask", { question, conversationId }, { baseURL: BASE_API_URL });
  return res.data;
};

export const getChatSession = async () => {
  const res = await client.get("/chat/session", { baseURL: BASE_API_URL });
  return res.data;
};

export const clearChatHistory = async (conversationId?: string) => {
  const res = await client.delete("/chat/clear", {
    data: { conversationId },
    baseURL: BASE_API_URL,
  });
  return res.data;
};

export const deleteChatMessage = async (messageId: string) => {
  const res = await client.delete(`/chat/message/${messageId}`, {
    baseURL: BASE_API_URL,
  });
  return res.data;
};
