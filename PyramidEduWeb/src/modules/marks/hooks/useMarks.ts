import { useQuery } from '@tanstack/react-query';
import { getMarks, getBatches, getSubjects, getStreams, getTeachers } from '../services/marks.service';
import { MarksFilterParams } from '../types/marks.types';

export const useMarksList = (filters: MarksFilterParams) => {
  return useQuery({
    queryKey: ['marks', filters],
    queryFn: () => getMarks(filters),
  });
};

export const useBatches = () => {
  return useQuery({
    queryKey: ['batches'],
    queryFn: getBatches,
  });
};

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });
};

export const useStreams = () => {
  return useQuery({
    queryKey: ['streams'],
    queryFn: getStreams,
  });
};

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  });
};
