import { create } from 'zustand';
import { MarksFilterParams } from '../types/marks.types';

interface MarksState {
  filters: MarksFilterParams;
  setFilters: (filters: Partial<MarksFilterParams>) => void;
  resetFilters: () => void;
}

const initialFilters: MarksFilterParams = {
  batchId: '',
  subjectId: '',
  streamId: '',
  teacherId: '',
  type: '',
  search: '',
};

export const useMarksStore = create<MarksState>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}));
