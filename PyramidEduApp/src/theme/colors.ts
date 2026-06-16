import { StatusBarStyle } from 'react-native';

export const colors = {
  light: {
    background: '#F8F9FA',
    surface: '#F8F9FA',
    surfaceAlt: '#F1F3F5',
    border: '#F8F9FA',
    textPrimary: '#1C1E21',
    textSecondary: '#606770',
    textTertiary: '#8D949E',
    primary: '#25D366',
    primarySurface: '#E3F9EC',
    success: '#2E7D32',
    error: '#D32F2F',
    warning: '#ED6C02',
    info: '#0288D1',
    cardBg: '#F8F9FA',
    cardBorder: '#F8F9FA',
    statusBar: 'dark-content' as StatusBarStyle,
  },
  dark: {
    background: '#0a0a0aff',
    surface: '#0a0a0aff',
    surfaceAlt: '#1F1F1F',
    border: '#0a0a0aff',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    primary: '#25D366',
    primarySurface: '#122E21',
    success: '#4CAF50',
    error: '#EF5350',
    warning: '#FFB74D',
    info: '#29B6F6',
    cardBg: '#0a0a0aff',
    cardBorder: '#0a0a0aff',
    statusBar: 'light-content' as StatusBarStyle,
  },
};

export type ColorTheme = typeof colors.light;
