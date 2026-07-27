import { create } from 'zustand';

interface AttendanceState {
  overallPercentage: number;
  setOverallPercentage: (percentage: number) => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  overallPercentage: 87,
  setOverallPercentage: (percentage) => set({ overallPercentage: percentage }),
}));
