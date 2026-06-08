import api from '@/lib/api';

export interface Exam {
  id: string;
  subjectId: string;
  termId?: string;
  examTitle: string;
  examType: 'QUIZ' | 'ASSIGNMENT' | 'MIDTERM' | 'FINAL';
  examDate: string;
  totalMarks: number;
  startTime?: string;
  duration?: number;
  batch?: string;
  batchId?: string;
  isPublished: boolean;
  isApproved: boolean;
  subject: { subjectName: string; subjectCode?: string };
  _count: { questions: number; submissions: number };
}

export interface CreateExamPayload {
  subjectId: string;
  termId?: string;
  examTitle: string;
  examType: 'QUIZ' | 'ASSIGNMENT' | 'MIDTERM' | 'FINAL';
  examDate: string;
  totalMarks: number;
  startTime?: string;
  duration?: number;
  batch?: string;
  batchId?: string;
}

export const fetchTeacherExams = async (): Promise<Exam[]> => {
  const { data } = await api.get('/exams');
  return data.data;
};

export const createExam = async (payload: CreateExamPayload): Promise<Exam> => {
  const { data } = await api.post('/exams', payload);
  return data.data;
};

export const fetchExamById = async (id: string) => {
  const { data } = await api.get(`/exams/${id}`);
  return data.data;
};

export const addExamQuestion = async (examId: string, payload: any) => {
  const { data } = await api.post(`/exams/${examId}/questions`, payload);
  return data.data;
};

export const deleteExamQuestion = async (examId: string, questionId: string) => {
  const { data } = await api.delete(`/exams/${examId}/questions/${questionId}`);
  return data.data;
};

export const updateExamQuestion = async (examId: string, questionId: string, payload: any) => {
  const { data } = await api.patch(`/exams/${examId}/questions/${questionId}`, payload);
  return data.data;
};

export const deleteExam = async (examId: string) => {
  const { data } = await api.delete(`/exams/${examId}`);
  return data.data;
};

export const updateExam = async (examId: string, payload: any) => {
  const { data } = await api.patch(`/exams/${examId}`, payload);
  return data.data;
};
