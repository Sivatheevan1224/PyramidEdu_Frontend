export interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}
