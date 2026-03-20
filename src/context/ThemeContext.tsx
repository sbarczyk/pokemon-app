import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSystemColorScheme,
  subscribeSystemColorScheme,
} from '../lib/nativeTheme';

const THEME_STORAGE_KEY = '@app_theme';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode | 'system';

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
  /** Zapisany wybór użytkownika: jasny, ciemny lub zgodny z systemem (TurboModule / Appearance). */
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  /** Rzeczywisty motyw UI po rozwiązaniu trybu systemowego. */
  theme: ThemeMode;
  colors: (typeof themeColors)['light'];
  isDark: boolean;
  followSystem: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function parseStored(value: string | null): ThemePreference {
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>('system');
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark'>(() =>
    getSystemColorScheme(),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      setThemePreferenceState(parseStored(stored));
      setHydrated(true);
    });
  }, []);

  const setThemePreference = useCallback((pref: ThemePreference) => {
    setThemePreferenceState(pref);
    AsyncStorage.setItem(THEME_STORAGE_KEY, pref);
  }, []);

  useEffect(() => {
    if (!hydrated || themePreference !== 'system') return;
    setSystemScheme(getSystemColorScheme());
    const sub = subscribeSystemColorScheme(setSystemScheme);
    return () => sub.remove();
  }, [hydrated, themePreference]);

  const theme: ThemeMode = useMemo(() => {
    if (themePreference === 'system') return systemScheme;
    return themePreference;
  }, [themePreference, systemScheme]);

  const colors = themeColors[theme];
  const isDark = theme === 'dark';
  const followSystem = themePreference === 'system';

  const value = useMemo(
    () => ({
      themePreference,
      setThemePreference,
      theme,
      colors,
      isDark,
      followSystem,
    }),
    [themePreference, setThemePreference, theme, colors, isDark, followSystem],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
