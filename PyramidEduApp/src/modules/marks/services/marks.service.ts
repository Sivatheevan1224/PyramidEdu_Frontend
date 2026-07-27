import client from '../../../api/client';
import { Exam } from '../types/marks.types';

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export const fetchExamMarks = async (accessToken?: string): Promise<Exam[]> => {
  const response = await client.get<ApiEnvelope<Exam[]>>('/exams/my-upcoming');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to load exam marks.');
  }
  return response.data.data;
};
