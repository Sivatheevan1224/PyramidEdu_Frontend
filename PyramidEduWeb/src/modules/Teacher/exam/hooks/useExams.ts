import { useState, useCallback } from 'react';
import * as api from '../services/exam.api';

export const useExams = () => {
  const [exams, setExams] = useState<api.Exam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.fetchTeacherExams();
      setExams(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch exams');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createExam = async (payload: api.CreateExamPayload) => {
    setIsLoading(true);
    try {
      const newExam = await api.createExam(payload);
      setExams((prev) => [newExam, ...prev]);
      return newExam;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExam = async (id: string) => {
    try {
      await api.deleteExam(id);
      setExams((prev) => prev.filter(e => e.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete exam');
    }
  };

  const updateExam = async (id: string, payload: Partial<api.CreateExamPayload>) => {
    setIsLoading(true);
    try {
      const updated = await api.updateExam(id, payload);
      setExams((prev) => prev.map(e => e.id === id ? { ...e, ...updated } : e));
      return updated;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update exam');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    exams,
    isLoading,
    error,
    fetchExams,
    createExam,
    deleteExam,
    updateExam,
  };
};

export const useExamDetails = (examId: string) => {
  const [exam, setExam] = useState<api.Exam & { questions?: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!examId) return;
    setIsLoading(true);
    try {
      const data = await api.fetchExamById(examId);
      setExam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  return { exam, isLoading, fetchDetails, setExam };
};
