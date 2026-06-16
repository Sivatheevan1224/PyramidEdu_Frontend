import { createContext } from 'react';
import { colors, type ColorTheme } from './colors';
import type { ThemeType } from '../store/themeStore';

export interface ThemeContextType {
  theme: ThemeType;
  colors: ColorTheme;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void | Promise<void>;
  toggleTheme: () => void | Promise<void>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
