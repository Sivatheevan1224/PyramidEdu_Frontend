import { useState, useCallback } from 'react';
import api from '@/lib/api';

export const useExamSubmission = (examId: string) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (!examId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/exams/${examId}/submissions`);
      setSubmissions(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch submissions');
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  const gradeSubmission = async (submissionId: string, payload: { totalScore: number; feedback: string; status: 'GRADED' | 'PENDING_MANUAL'; answers?: any[] }) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/exams/${examId}/results`, {
        submissionId,
        ...payload
      });
      setSubmissions((prev) => prev.map(sub => sub.id === submissionId ? { ...sub, ...data.data } : sub));
      return data.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to submit grades');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submissions,
    isLoading,
    error,
    fetchSubmissions,
    gradeSubmission
  };
};
