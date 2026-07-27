import { create } from 'zustand';

interface WelcomeState {
  hasWelcomed: boolean;
  setHasWelcomed: (val: boolean) => void;
}

export const useWelcomeStore = create<WelcomeState>((set) => ({
  hasWelcomed: false,
  setHasWelcomed: (val) => set({ hasWelcomed: val }),
}));
