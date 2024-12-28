'use client';

import { useThemeStore } from '../lib/store/theme';
import { createContext, useContext, ReactNode } from 'react';

const ThemeContext = createContext<ReturnType<typeof useThemeStore>['currentTheme']>(null!);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { currentTheme } = useThemeStore();
  
  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 