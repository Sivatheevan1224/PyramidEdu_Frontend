import { useSyncExternalStore } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Exam, Question, MCQAnswer, EssayDraftState, UploadState } from "../types";

export interface ExamStoreState {
  currentExam: Exam | null;
  questions: Question[];
  answers: MCQAnswer;
  essayDraft: EssayDraftState | null;
  startTimeStamp: number | null;
  remainingTime: number; // in seconds
  submissionState: "idle" | "submitting" | "success" | "error";
  submissionError: string | null;
  uploadState: UploadState;
  activeView: "list" | "history" | "mcq" | "essay" | "success" | "result";
  activeResultExamId: string | null;
}

const initialUploadState: UploadState = {
  status: "idle",
  progress: 0,
  error: null,
  uploadedUrl: null,
};

const initialState: ExamStoreState = {
  currentExam: null,
  questions: [],
  answers: {},
  essayDraft: null,
  startTimeStamp: null,
  remainingTime: 0,
  submissionState: "idle",
  submissionError: null,
  uploadState: initialUploadState,
  activeView: "list",
  activeResultExamId: null,
};

let state: ExamStoreState = initialState;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: Partial<ExamStoreState>) {
  state = { ...state, ...nextState };
  emitChange();
}

function getSnapshot(): ExamStoreState {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// STORAGE HELPERS
const EXAM_DRAFT_KEY = "pyramidedu_exam_draft_v1";

function canUseWebStorage(): boolean {
  return (
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

async function saveToSecureStorage(key: string, value: string): Promise<void> {
  if (canUseWebStorage()) {
    window.localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getFromSecureStorage(key: string): Promise<string | null> {
  if (canUseWebStorage()) {
    return window.localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

async function removeFromSecureStorage(key: string): Promise<void> {
  if (canUseWebStorage()) {
    window.localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const examStore = {
  getState: getSnapshot,

  setCurrentExam: (exam: Exam | null) => {
    setState({ currentExam: exam });
  },

  setQuestions: (questions: Question[]) => {
    setState({ questions });
  },

  setAnswer: (questionId: string, answer: string) => {
    const newAnswers = { ...state.answers, [questionId]: answer };
    setState({ answers: newAnswers });
    examStore.saveDraftToStorage();
  },

  setAnswers: (answers: MCQAnswer) => {
    setState({ answers });
    examStore.saveDraftToStorage();
  },

  setEssayDraft: (essayDraft: EssayDraftState | null) => {
    setState({ essayDraft });
    examStore.saveDraftToStorage();
  },

  setStartTimeStamp: (startTimeStamp: number | null) => {
    setState({ startTimeStamp });
    examStore.saveDraftToStorage();
  },

  setRemainingTime: (remainingTime: number) => {
    setState({ remainingTime });
  },

  setSubmissionState: (
    submissionState: "idle" | "submitting" | "success" | "error",
    submissionError: string | null = null
  ) => {
    setState({ submissionState, submissionError });
  },

  setUploadState: (nextUploadState: Partial<UploadState>) => {
    setState({
      uploadState: { ...state.uploadState, ...nextUploadState },
    });
  },

  setActiveView: (view: "list" | "history" | "mcq" | "essay" | "success" | "result") => {
    setState({ activeView: view });
  },

  viewResult: (examId: string) => {
    setState({ activeView: "result", activeResultExamId: examId });
  },

  resetStore: () => {
    setState({
      currentExam: null,
      questions: [],
      answers: {},
      essayDraft: null,
      startTimeStamp: null,
      remainingTime: 0,
      submissionState: "idle",
      submissionError: null,
      uploadState: initialUploadState,
    });
  },

  saveDraftToStorage: async () => {
    if (!state.currentExam) return;
    try {
      const draftData = {
        examId: state.currentExam.id,
        answers: state.answers,
        essayDraft: state.essayDraft,
        startTimeStamp: state.startTimeStamp,
      };
      await saveToSecureStorage(EXAM_DRAFT_KEY, JSON.stringify(draftData));
    } catch (err) {
      console.error("Failed to save exam draft to storage:", err);
    }
  },

  loadDraftFromStorage: async (examId: string): Promise<boolean> => {
    try {
      const raw = await getFromSecureStorage(EXAM_DRAFT_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data && data.examId === examId) {
        setState({
          answers: data.answers || {},
          essayDraft: data.essayDraft || null,
          startTimeStamp: data.startTimeStamp || null,
        });
        return true;
      }
    } catch (err) {
      console.error("Failed to load exam draft from storage:", err);
    }
    return false;
  },

  clearDraftFromStorage: async () => {
    try {
      await removeFromSecureStorage(EXAM_DRAFT_KEY);
    } catch (err) {
      console.error("Failed to clear exam draft from storage:", err);
    }
  },
};

export function useExamStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    ...snapshot,
    ...examStore,
  };
}
