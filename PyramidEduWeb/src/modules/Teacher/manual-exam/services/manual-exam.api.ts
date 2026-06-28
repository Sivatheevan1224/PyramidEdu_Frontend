import api from '@/lib/api';

export interface ManualExam {
  id: string;
  examTitle: string;
  subjectId: string;
  teacherId: string;
  batchId: string;
  totalMarks: number;
  examDate: string;
  duration?: number;
  createdAt: string;
  subject: { subjectName: string; subjectCode?: string };
  batch: { batchName: string; _count?: { students: number } };
  _count?: { marks: number };
}

export interface CreateManualExamPayload {
  examTitle: string;
  batchId: string;
  totalMarks: number;
  examDate: string;
  duration?: number;
}

export interface StudentForManualExam {
  id: string;
  fullName: string;
  indexNumber?: string;
  nic?: string;
  marksObtained: number | null;
  isAbsent?: boolean;
}

export interface SaveManualExamMarksPayload {
  marks: {
    studentId: string;
    marksObtained?: number;
    isAbsent?: boolean;
  }[];
}

export const manualExamApi = {
  createManualExam: async (payload: CreateManualExamPayload) => {
    const response = await api.post('/manual-exams', payload);
    return response.data;
  },

  getAllManualExams: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await api.get('/manual-exams', { params });
    return response.data.data as ManualExam[];
  },

  getManualExamById: async (id: string) => {
    const response = await api.get(`/manual-exams/${id}`);
    return response.data.data as ManualExam;
  },

  getStudentsForManualExam: async (id: string) => {
    const response = await api.get(`/manual-exams/${id}/students`);
    return response.data.data as StudentForManualExam[];
  },

  saveMarks: async (id: string, payload: SaveManualExamMarksPayload) => {
    const response = await api.post(`/manual-exams/${id}/marks`, payload);
    return response.data;
  },
};
