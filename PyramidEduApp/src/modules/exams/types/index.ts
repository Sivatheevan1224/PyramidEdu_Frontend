export type ExamType = "MCQ" | "ESSAY";

export type ExamStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "LATE";

export interface Question {
  id: string;
  examId: string;
  questionText: string | null;
  imageUrl: string | null;
  questionType: "TEXT" | "IMAGE";
  marks: number;
  options: any; // [{ id: "opt1", text: "A" }, ...]
  order: number;
}

export interface Exam {
  id: string;
  subjectId: string;
  teacherId: string;
  termId: string | null;
  examTitle: string;
  examType: ExamType;
  examDate: string;
  totalMarks: number;
  isPublished: boolean;
  startTime: string | null;
  duration: number | null; // minutes
  pdfUrl: string | null;
  batch: string | null;
  batchId: string | null;
  createdAt: string;
  updatedAt: string;
  subject?: {
    subjectName: string;
  };
  questions?: Question[];
  submissions?: ExamSubmission[];
}

export interface ExamAnswer {
  id: string;
  submissionId: string;
  questionId: string;
  answer: string;
  isCorrect: boolean | null;
  marksAwarded: number | null;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  submittedAt: string;
  totalScore: number | null;
  status: "GRADED" | "PENDING_MANUAL";
  submissionStatus: "SUBMITTED" | "LATE_SUBMISSION";
  answers?: ExamAnswer[];
}

export type MCQAnswer = Record<string, string>;

export interface EssayDraftState {
  fileName: string;
  fileSize: number;
  localUri: string;
  fileObject?: any;
}

export interface ExamTimerState {
  examId: string;
  startTimeStamp: number; // Date.now() when started
  duration: number; // in minutes
  remainingSeconds: number;
}

export interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  error: string | null;
  uploadedUrl: string | null;
}
