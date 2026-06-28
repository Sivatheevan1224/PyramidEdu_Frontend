import { useState, useEffect, useRef, useMemo } from "react";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { useExamStore } from "../store/examStore";
import { Exam, Question } from "../types";
import { ExamService, UploadService } from "../services/api";

// 1. useExamTimer
export function useExamTimer(autoSubmitCallback?: () => void) {
  const { currentExam, startTimeStamp, remainingTime, setRemainingTime, setStartTimeStamp } = useExamStore();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!currentExam || !currentExam.duration) return;

    // Initialize start timestamp if not set
    let start = startTimeStamp;
    if (!start) {
      start = Date.now();
      setStartTimeStamp(start);
    }

    const durationMs = currentExam.duration * 60 * 1000;
    if (isNaN(durationMs)) return;
    const endTime = start + durationMs;

    const updateTimer = () => {
      const now = Date.now();
      const secondsLeft = Math.max(0, Math.floor((endTime - now) / 1000));
      setRemainingTime(secondsLeft);

      if (secondsLeft <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (autoSubmitCallback) {
          autoSubmitCallback();
        }
      }
    };

    updateTimer(); // run initially
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentExam, startTimeStamp]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(remainingTime / 60);
    const secs = remainingTime % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [remainingTime]);

  return {
    remainingTime,
    formattedTime,
  };
}

// 2. useMCQExam
export function useMCQExam() {
  const { questions, answers, setAnswer } = useExamStore();
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentQuestion = questions[currentIdx] || null;

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const selectQuestion = (idx: number) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentIdx(idx);
    }
  };

  const unansweredQuestions = useMemo(() => {
    return questions
      .map((q, idx) => ({ id: q.id, index: idx, answered: !!answers[q.id] }))
      .filter((item) => !item.answered);
  }, [questions, answers]);

  return {
    currentIdx,
    currentQuestion,
    totalQuestions: questions.length,
    answers,
    setAnswer,
    handleNext,
    handlePrev,
    selectQuestion,
    unansweredQuestions,
  };
}

// 3. useEssayExam
export function useEssayExam() {
  const { essayDraft, setEssayDraft, uploadState, setUploadState } = useExamStore();

  const handlePickPDF = async () => {
    try {
      if (!DocumentPicker || !DocumentPicker.getDocumentAsync) {
        Alert.alert("Error", "Document Picker is not available on this device.");
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];

      // Validate size (20MB = 20 * 1024 * 1024 bytes)
      const maxSizeBytes = 20 * 1024 * 1024;
      if (file.size && file.size > maxSizeBytes) {
        Alert.alert("File Too Large", "The selected PDF exceeds the 20MB size limit.");
        return;
      }

      setEssayDraft({
        fileName: file.name,
        fileSize: file.size || 0,
        localUri: file.uri,
        fileObject: (file as any).file,
      });
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to select document.");
    }
  };

  const handleRemoveFile = () => {
    setEssayDraft(null);
    setUploadState({ status: "idle", progress: 0, error: null, uploadedUrl: null });
  };

  return {
    essayDraft,
    uploadState,
    handlePickPDF,
    handleRemoveFile,
  };
}

// 4. useExamStatus
export function useExamStatus() {
  const getStatus = (exam: Exam): { status: "UPCOMING" | "ONGOING" | "COMPLETED" | "UNCOMPLETED" | "LATE"; label: string } => {
    // If student already submitted
    if (exam.submissions && exam.submissions.length > 0) {
      return { status: "COMPLETED", label: "Completed" };
    }

    const now = new Date();
    if (!exam.startTime) {
      return { status: "UPCOMING", label: "Upcoming" };
    }

    const start = new Date(exam.startTime);
    const durationMins = exam.duration || 0;
    const end = new Date(start.getTime() + durationMins * 60 * 1000);
    const lateMins = exam.lateExamAvailableTime || 0;
    const lateEnd = new Date(end.getTime() + lateMins * 60 * 1000);

    if (now < start) {
      return { status: "UPCOMING", label: "Upcoming" };
    } else if (now >= start && now <= end) {
      return { status: "ONGOING", label: "Ongoing" };
    } else if (lateMins > 0 && now > end && now <= lateEnd) {
      return { status: "LATE", label: "Late" };
    } else {
      // Past the late duration (or regular duration if no late time).
      return { status: "UNCOMPLETED", label: "Expired" };
    }
  };

  return {
    getStatus,
  };
}

// 5. useExamSubmission
export function useExamSubmission() {
  const {
    currentExam,
    answers,
    essayDraft,
    submissionState,
    submissionError,
    setSubmissionState,
    setUploadState,
    clearDraftFromStorage,
    resetStore,
    setView,
  } = useExamStore();

  const submitMCQ = async (accessToken: string) => {
    if (!currentExam) return;

    setSubmissionState("submitting");
    try {
      await ExamService.submitMCQExam(currentExam.id, answers, accessToken);
      setSubmissionState("success");
      await clearDraftFromStorage();
      setView("success");
    } catch (err: any) {
      setSubmissionState("error", err.message || "Failed to submit exam.");
      Alert.alert("Submission Failed", err.message || "Please check your network connection.");
    }
  };

  const submitEssay = async (accessToken: string) => {
    if (!currentExam || !essayDraft) return;

    setSubmissionState("submitting");
    setUploadState({ status: "uploading", progress: 0.3, error: null });

    try {
      // 1. Upload file via backend upload service
      const { url: fileUrl, publicId } = await UploadService.uploadEssayPDF(
        essayDraft.localUri,
        essayDraft.fileName,
        accessToken,
        essayDraft.fileObject
      );
      setUploadState({ status: "success", progress: 1.0, uploadedUrl: fileUrl });

      // 2. Submit essay answers.
      // We pass an empty answers object since the PDF is stored natively on the submission record.
      const essayAnswers: Record<string, string> = {};
      
      // If there are questions (e.g. dummy questions), we can still map them if needed, but it's optional.
      if (currentExam.questions && currentExam.questions.length > 0) {
        essayAnswers[currentExam.questions[0].id] = fileUrl;
      }

      await ExamService.submitEssayExam(currentExam.id, essayAnswers, accessToken, fileUrl, publicId);
      setSubmissionState("success");
      await clearDraftFromStorage();
      setView("success");
    } catch (err: any) {
      setUploadState({ status: "error", error: err.message || "Failed to upload file." });
      setSubmissionState("idle");
      Alert.alert("Submission Failed", err.message || "Please try again.");
    }
  };

  return {
    submissionState,
    submissionError,
    submitMCQ,
    submitEssay,
  };
}
