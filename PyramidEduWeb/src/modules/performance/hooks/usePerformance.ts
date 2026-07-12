import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calculatePerformanceForStudent, calculatePerformanceForAll, getStudentPerformanceHistory, getPerformanceStudentsList } from '../services/performance.service';
import { toast } from 'sonner';

export const usePerformanceHistory = (studentId: string, enabled = true) => {
  return useQuery({
    queryKey: ['performanceHistory', studentId],
    queryFn: () => getStudentPerformanceHistory(studentId),
    enabled: !!studentId && enabled,
  });
};

export const useCalculateStudentPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: string) => calculatePerformanceForStudent(studentId),
    onSuccess: (_, studentId) => {
      toast.success('Performance calculation complete');
      queryClient.invalidateQueries({ queryKey: ['performanceHistory', studentId] });
      queryClient.invalidateQueries({ queryKey: ['students'] }); // Invalidate students list if needed
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to calculate performance');
    }
  });
};

export const useCalculateAllPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => calculatePerformanceForAll(),
    onSuccess: () => {
      toast.success('Performance calculated for all students');
      queryClient.invalidateQueries({ queryKey: ['performanceHistory'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to calculate performance');
    }
  });
};

export const usePerformanceStudents = () => {
  return useQuery({
    queryKey: ['performanceStudents'],
    queryFn: () => getPerformanceStudentsList(),
  });
};
