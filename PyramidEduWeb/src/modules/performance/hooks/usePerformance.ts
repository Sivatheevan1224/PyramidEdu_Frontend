import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calculatePerformanceForStudent, calculatePerformanceForAll, getStudentPerformanceHistory, getPerformanceStudentsList, generateStudentAiRecommendation } from '../services/performance.service';
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
      queryClient.invalidateQueries({ queryKey: ['performanceStudents'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to calculate performance');
    }
  });
};

export const useCalculateAllPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentIds?: string[]) => calculatePerformanceForAll(studentIds),
    onSuccess: () => {
      toast.success('Performance calculated successfully');
      queryClient.invalidateQueries({ queryKey: ['performanceHistory'] });
      queryClient.invalidateQueries({ queryKey: ['performanceStudents'] });
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

export const useGenerateStudentAiRecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: string) => generateStudentAiRecommendation(studentId),
    onSuccess: (res, studentId) => {
      toast.success(res?.message || 'Personalized AI study recommendation generated!');
      queryClient.invalidateQueries({ queryKey: ['performanceHistory', studentId] });
      queryClient.invalidateQueries({ queryKey: ['performanceStudents'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to generate AI recommendation');
    }
  });
};

