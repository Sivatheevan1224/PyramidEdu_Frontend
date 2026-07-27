import { useState, useEffect, useCallback } from 'react';
import { fetchExamMarks } from '../services/marks.service';
import { Exam } from '../types/marks.types';

export const useMarks = (accessToken: string | null) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMarks = useCallback(
    async (isRefresh = false) => {
      if (!accessToken) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const data = await fetchExamMarks(accessToken);
        setExams(data);
      } catch (err: any) {
        console.error('Error fetching exams for marks:', err);
        setError(err.message || 'Failed to load marks.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    loadMarks();
  }, [loadMarks]);

  return {
    exams,
    loading,
    refreshing,
    error,
    refresh: () => loadMarks(true),
  };
};
