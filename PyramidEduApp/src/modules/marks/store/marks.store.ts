import { create } from 'zustand';

interface MarksState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useMarksStore = create<MarksState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
