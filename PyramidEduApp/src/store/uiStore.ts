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

export function useThemeColors() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    isDark,
    theme,
    background: isDark ? "#0B141A" : "#FFFFFF",
    surface: isDark ? "#121B22" : "#FFFFFF",
    surfaceAlt: isDark ? "#1F2C34" : "#F5F5F5",
    border: isDark ? "#222D34" : "#EAEAEA",
    textPrimary: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#8E8E93" : "#656565",
    textTertiary: isDark ? "#667781" : "#999999",
    cardBg: isDark ? "#121B22" : "#FFFFFF",
    cardBorder: isDark ? "#222D34" : "#EAEAEA",
    primary: "#25D366",
    primarySurface: isDark ? "#122E21" : "#F0F7F4",
  };
}

export const uiStore = {
  get theme() {
    return themeState;
  },
  toggleTheme,
  hydrateTheme,
};