import { BASE_API_URL } from "../../../api/config";

export interface TodayStatusResponse {
  completedToday: boolean;
  dailyStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  rewardPoints: number;
  performanceStatus: string;
  todayResult?: SubmitQuizResponse | null;
}

export interface PracticeQuizQuestion {
  id: string;
  questionText: string;
  options: any[];
  order: number;
}

export interface GenerateQuizResponse {
  quizId: string;
  quizTitle: string;
  performanceLevel: string;
  questions: PracticeQuizQuestion[];
}

export interface SubmitQuizPayload {
  quizId: string;
  startedAt: string;
  answers: Array<{ questionId: string; selectedAnswer: string }>;
}

export interface SubmitQuizResponse {
  success: boolean;
  resultId: string;
  score: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  rewardPointsEarned: number;
  totalRewardPoints: number;
  dailyStreak: number;
  longestStreak: number;
  isMilestone: boolean;
  timeTaken: number;
}

export const practiceMcqService = {
  getTodayStatus: async (token: string): Promise<TodayStatusResponse> => {
    const response = await fetch(`${BASE_API_URL}/practice-mcq/today-status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || "Failed to fetch today's status.");
    }
    return json.data;
  },

  generateQuiz: async (token: string): Promise<GenerateQuizResponse> => {
    const response = await fetch(`${BASE_API_URL}/practice-mcq/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || "Failed to generate today's quiz.");
    }
    return json.data;
  },

  submitQuiz: async (token: string, payload: SubmitQuizPayload): Promise<SubmitQuizResponse> => {
    const response = await fetch(`${BASE_API_URL}/practice-mcq/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || "Failed to submit practice quiz.");
    }
    return json.data;
  },
};
