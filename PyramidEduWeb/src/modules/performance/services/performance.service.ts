import { api } from '@/lib/api';
import { PerformancePrediction } from '../types/performance.types';

export const calculatePerformanceForStudent = async (studentId: string): Promise<PerformancePrediction> => {
  const response = await api.post(`/performance/student/${encodeURIComponent(studentId)}/calculate`);
  return response.data.data;
};

export const calculatePerformanceForAll = async (studentIds?: string[]): Promise<any> => {
  const response = await api.post('/performance/calculate-all', { studentIds });
  return response.data.data;
};

export const getStudentPerformanceHistory = async (studentId: string): Promise<PerformancePrediction[]> => {
  const response = await api.get(`/performance/student/${encodeURIComponent(studentId)}/history`);
  return response.data.data;
};

export const getPerformanceStudentsList = async (): Promise<any[]> => {
  const response = await api.get('/performance/students');
  return response.data.data;
};
