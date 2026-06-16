import { StatusBarStyle } from 'react-native';

export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#FFFFFF', // Pearl Bush
    border: '#E0E0E0',
    textPrimary: '#212121',
    textSecondary: '#666666',
    textTertiary: '#757575',
    primary: '#25d366', // Renewable Energy Light Green
    primarySurface: '#E3F9EC',
    success: '#128c7e', // Teal Green
    error: '#D32F2F',
    warning: '#ED6C02',
    info: '#34b7f1', // Picton Blue
    cardBg: '#FFFFFF',
    cardBorder: '#E0E0E0',
    headerBg: '#FFFFFF', // White header background in light theme
    headerText: '#212121', // Dark text on light header
    statusBar: 'dark-content' as StatusBarStyle,
  },
  dark: {
    background: '#121212',
    surface: '#121212',
    surfaceAlt: '#121212',
    border: '#2C2C2C',
    textPrimary: 'rgba(255, 255, 255, 0.87)',
    textSecondary: 'rgba(255, 255, 255, 0.60)',
    textTertiary: 'rgba(255, 255, 255, 0.38)',
    primary: '#25d366', // Renewable Energy Light Green
    primarySurface: '#122E21',
    success: '#128c7e', // Teal Green
    error: '#EF5350',
    warning: '#FFB74D',
    info: '#34b7f1', // Picton Blue
    cardBg: '#121212',
    cardBorder: '#2C2C2C',
    headerBg: '#121212',
    headerText: 'rgba(255, 255, 255, 0.87)',
    statusBar: 'light-content' as StatusBarStyle,
  },
};

export type ColorTheme = typeof colors.light;
