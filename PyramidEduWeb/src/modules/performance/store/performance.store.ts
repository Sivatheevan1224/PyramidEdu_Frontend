import { create } from 'zustand';

interface PerformanceState {
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
  selectedStudentId: null,
  setSelectedStudentId: (id) => set({ selectedStudentId: id }),
}));
