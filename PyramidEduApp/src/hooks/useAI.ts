import { chatbotReply } from "../ai/chatbot";
import { generateRecommendations } from "../ai/recommendations";
import { predictRisk } from "../ai/riskPrediction";

export function useAI() {
  return {
    chatbotReply,
    generateRecommendations,
    predictRisk,
  };
}