import { useSyncExternalStore } from 'react';
import { Appearance, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export type ThemeType = 'LIGHT' | 'DARK';

const PYRAMID_THEME_KEY = 'PYRAMID_THEME';

// Get system default theme, fallback to LIGHT
const getSystemTheme = (): ThemeType => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? 'DARK' : 'LIGHT';
};

let themeState: ThemeType = getSystemTheme();
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

// Resilient storage helper
async function getThemeFromStorage(): Promise<string | null> {
  // 1. Try Web LocalStorage
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(PYRAMID_THEME_KEY);
      }
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
    return null;
  }

  // 2. Try AsyncStorage (Primary requested)
  try {
    const value = await AsyncStorage.getItem(PYRAMID_THEME_KEY);
    return value;
  } catch (error: any) {
    // If native module is null, fall back to SecureStore
    if (error?.message?.includes('Native module is null') || error?.message?.includes('cannot access legacy storage')) {
      try {
        const value = await SecureStore.getItemAsync(PYRAMID_THEME_KEY);
        return value;
      } catch (secError) {
        console.error('SecureStore fallback failed:', secError);
      }
    } else {
      console.error('AsyncStorage failed:', error);
    }
  }
  return null;
}

async function saveThemeToStorage(theme: ThemeType): Promise<void> {
  // 1. Try Web LocalStorage
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PYRAMID_THEME_KEY, theme);
      }
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
    return;
  }

  // 2. Try AsyncStorage (Primary requested)
  try {
    await AsyncStorage.setItem(PYRAMID_THEME_KEY, theme);
  } catch (error: any) {
    // If native module is null, fall back to SecureStore
    if (error?.message?.includes('Native module is null') || error?.message?.includes('cannot access legacy storage')) {
      try {
        await SecureStore.setItemAsync(PYRAMID_THEME_KEY, theme);
      } catch (secError) {
        console.error('SecureStore write fallback failed:', secError);
      }
    } else {
      console.error('AsyncStorage write failed:', error);
    }
  }
}

export async function loadTheme(): Promise<ThemeType> {
  if (isHydrated) return themeState;
  try {
    const storedTheme = await getThemeFromStorage();
    if (storedTheme === 'LIGHT' || storedTheme === 'DARK') {
      themeState = storedTheme;
      emitChange();
    }
  } catch (error) {
    console.error('Failed to load theme:', error);
  } finally {
    isHydrated = true;
  }
  return themeState;
}

export async function setTheme(theme: ThemeType) {
  themeState = theme;
  emitChange();
  try {
    await saveThemeToStorage(theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

export async function toggleTheme() {
  const nextTheme: ThemeType = themeState === 'LIGHT' ? 'DARK' : 'LIGHT';
  await setTheme(nextTheme);
}

export function useThemeStore() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    theme,
    setTheme,
    toggleTheme,
    loadTheme,
  };
}

export const themeStore = {
  get theme() {
    return themeState;
  },
  setTheme,
  toggleTheme,
  loadTheme,
};
