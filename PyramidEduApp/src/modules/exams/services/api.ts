import { MOBILE_API_BASE_URL } from "../../../api/config";
import { Exam, Question, ExamSubmission } from "../types";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as ApiEnvelope<T> | T)
    : ((await response.text()) as unknown as T);

  if (!response.ok) {
    const envelope = payload as ApiEnvelope<T>;
    throw new Error(
      envelope?.message || `Request failed with status ${response.status}`
    );
  }

  if (payload && typeof payload === "object" && "success" in payload) {
    const envelope = payload as ApiEnvelope<T>;
    if (envelope.data !== undefined) {
      return envelope.data;
    }
  }

  return payload as T;
}

async function request<T>(
  path: string,
  accessToken: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${MOBILE_API_BASE_URL}/exams${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(init.headers || {}),
    },
  });

  return parseResponse<T>(response);
}

export const ExamService = {
  getAvailableExams: async (accessToken: string): Promise<Exam[]> => {
    return request<Exam[]>("/my-upcoming", accessToken, {
      method: "GET",
    });
  },

  getExamDetails: async (examId: string, accessToken: string): Promise<Question[]> => {
    return request<Question[]>(`/${examId}/questions`, accessToken, {
      method: "GET",
    });
  },

  startExam: async (examId: string, accessToken: string): Promise<Question[]> => {
    // Starting an exam retrieves its questions
    return ExamService.getExamDetails(examId, accessToken);
  },

  submitMCQExam: async (
    examId: string,
    answers: Record<string, string>,
    accessToken: string
  ): Promise<ExamSubmission> => {
    return request<ExamSubmission>(`/${examId}/submit`, accessToken, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },

  submitEssayExam: async (
    examId: string,
    answers: Record<string, string>,
    accessToken: string,
    answerPdfUrl?: string,
    answerPdfPublicId?: string
  ): Promise<ExamSubmission> => {
    return request<ExamSubmission>(`/${examId}/submit`, accessToken, {
      method: "POST",
      body: JSON.stringify({ answers, answerPdfUrl, answerPdfPublicId }),
    });
  },

  getSubmissionStatus: async (
    examId: string,
    accessToken: string
  ): Promise<any> => {
    // Retrieve submission details (if existing) by checking upcoming list
    const exams = await ExamService.getAvailableExams(accessToken);
    const exam = exams.find((e) => e.id === examId);
    return exam?.submissions && exam.submissions.length > 0
      ? exam.submissions[0]
      : null;
  },
};

export const UploadService = {
  uploadEssayPDF: async (
    fileUri: string,
    fileName: string,
    accessToken: string,
    fileObject?: any
  ): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append("bucket", "answer-pdfs");
    formData.append("file", fileObject || {
      uri: fileUri,
      name: fileName || "submission.pdf",
      type: "application/pdf",
    } as any);

    const response = await fetch(`${MOBILE_API_BASE_URL}/exams/upload-file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const json = await parseResponse<{ url: string; public_id: string }>(response);
    return { url: json.url, publicId: json.public_id };
  },
};
