import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@app_theme';

export type ThemeMode = 'light' | 'dark';

export const themeColors = {
  light: {
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#111111',
    textSecondary: '#888888',
    border: '#e0e0e0',
    button: '#000000',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#f5f5f5',
    textSecondary: '#b0b0b0',
    border: '#333333',
    button: 'gray',
  },
};

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  colors: (typeof themeColors)['light'];
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      }
    });
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const colors = themeColors[theme];
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
