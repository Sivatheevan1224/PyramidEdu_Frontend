import { api } from '@/lib/api';
import { UnifiedMark, MarksFilterParams } from '../types/marks.types';

export const getMarks = async (params: MarksFilterParams): Promise<UnifiedMark[]> => {
  const response = await api.get('/marks', { params });
  return response.data?.data || response.data || [];
};

export const getBatches = async (): Promise<any[]> => {
  const response = await api.get('/batches');
  return response.data?.data || response.data || [];
};

export const getSubjects = async (): Promise<any[]> => {
  const response = await api.get('/subjects');
  return response.data?.data?.data || response.data?.data || response.data || [];
};

export const getStreams = async (): Promise<any[]> => {
  const response = await api.get('/subjects/streams');
  return response.data?.data || response.data || [];
};

export const getTeachers = async (): Promise<any[]> => {
  const response = await api.get('/teachers');
  return response.data?.data?.data || response.data?.data || response.data || [];
};
