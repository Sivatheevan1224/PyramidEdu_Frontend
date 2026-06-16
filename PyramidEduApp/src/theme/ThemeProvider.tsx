import React, { useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { colors } from './colors';
import { useThemeStore, loadTheme } from '../store/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    loadTheme();
  }, []);

  const isDark = theme === 'DARK';
  const themeColors = isDark ? colors.dark : colors.light;

  const value = {
    theme,
    colors: themeColors,
    isDark,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
