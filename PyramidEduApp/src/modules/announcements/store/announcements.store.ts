import { create } from 'zustand';

interface AnnouncementsState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAnnouncementsStore = create<AnnouncementsState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
