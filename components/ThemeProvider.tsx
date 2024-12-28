'use client';

import { useThemeStore, Theme } from '../lib/store/theme';
import { createContext, useContext, ReactNode } from 'react';

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { currentTheme } = useThemeStore();
  
  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用');
  }
  return theme;
} 