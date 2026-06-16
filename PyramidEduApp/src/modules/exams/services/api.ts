import client from "../../../api/client";
import { Exam, Question, ExamSubmission } from "../types";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export const ExamService = {
  getAvailableExams: async (accessToken?: string): Promise<Exam[]> => {
    // client handles Authorization header via interceptors
    const response = await client.get<ApiEnvelope<Exam[]>>("/exams/my-upcoming");
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to load available exams.");
    }
    return response.data.data;
  },

  getExamDetails: async (examId: string, accessToken?: string): Promise<Question[]> => {
    const response = await client.get<ApiEnvelope<Question[]>>(`/exams/${examId}/questions`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to load exam details.");
    }
    return response.data.data;
  },

  startExam: async (examId: string, accessToken?: string): Promise<Question[]> => {
    return ExamService.getExamDetails(examId, accessToken);
  },

  submitMCQExam: async (
    examId: string,
    answers: Record<string, string>,
    accessToken?: string
  ): Promise<ExamSubmission> => {
    const response = await client.post<ApiEnvelope<ExamSubmission>>(`/exams/${examId}/submit`, { answers });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to submit MCQ exam.");
    }
    return response.data.data;
  },

  submitEssayExam: async (
    examId: string,
    answers: Record<string, string>,
    accessToken?: string,
    answerPdfUrl?: string,
    answerPdfPublicId?: string
  ): Promise<ExamSubmission> => {
    const response = await client.post<ApiEnvelope<ExamSubmission>>(`/exams/${examId}/submit`, {
      answers,
      answerPdfUrl,
      answerPdfPublicId,
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to submit essay exam.");
    }
    return response.data.data;
  },

  getSubmissionStatus: async (
    examId: string,
    accessToken?: string
  ): Promise<any> => {
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
    accessToken?: string,
    fileObject?: any
  ): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append("bucket", "answer-pdfs");
    formData.append("file", fileObject || ({
      uri: fileUri,
      name: fileName || "submission.pdf",
      type: "application/pdf",
    } as any));

    const response = await client.post<ApiEnvelope<{ url: string; public_id: string }>>(
      "/exams/upload-file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to upload answer PDF.");
    }

    return {
      url: response.data.data.url,
      publicId: response.data.data.public_id,
    };
  },
};
