import { useState, useCallback } from 'react';
import * as api from '../services/exam.api';

export const useExamQuestions = (examId: string) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    if (!examId) return;
    setIsLoading(true);
    setError(null);
    try {
      // Direct call to endpoint via custom fetch or api
      const data = await api.fetchExamById(examId);
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  const addQuestion = async (payload: any) => {
    setIsLoading(true);
    try {
      const newQuestion = await api.addExamQuestion(examId, payload);
      setQuestions((prev) => [...prev, newQuestion]);
      return newQuestion;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add question');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuestion = async (questionId: string, payload: any) => {
    setIsLoading(true);
    try {
      const updated = await api.updateExamQuestion(examId, questionId, payload);
      setQuestions((prev) => prev.map(q => q.id === questionId ? { ...q, ...updated } : q));
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update question');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    setIsLoading(true);
    try {
      await api.deleteExamQuestion(examId, questionId);
      setQuestions((prev) => prev.filter(q => q.id !== questionId));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete question');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions,
    isLoading,
    error,
    fetchQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion
  };
};
