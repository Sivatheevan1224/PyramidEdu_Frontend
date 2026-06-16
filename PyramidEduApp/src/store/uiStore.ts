import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const THEME_KEY = 'pyramidedu.mobile.theme';

export type ThemeType = 'light' | 'dark';

let themeState: ThemeType = 'light';
const listeners = new Set<() => void>();
let isHydrated = false;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return themeState;
}

export async function hydrateTheme() {
  if (isHydrated) return;
  try {
    let storedTheme: string | null = null;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        storedTheme = window.localStorage.getItem(THEME_KEY);
      }
    } else {
      storedTheme = await SecureStore.getItemAsync(THEME_KEY);
    }
    if (storedTheme === 'light' || storedTheme === 'dark') {
      themeState = storedTheme;
      emitChange();
    }
  } catch (error) {
    console.error('Failed to load theme:', error);
  } finally {
    isHydrated = true;
  }
}

export async function toggleTheme() {
  const nextTheme: ThemeType = themeState === 'light' ? 'dark' : 'light';
  themeState = nextTheme;
  emitChange();
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(THEME_KEY, nextTheme);
      }
    } else {
      await SecureStore.setItemAsync(THEME_KEY, nextTheme);
    }
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    theme,
    toggleTheme,
    hydrateTheme,
  };
}

export const uiStore = {
  get theme() {
    return themeState;
  },
  toggleTheme,
  hydrateTheme,
};