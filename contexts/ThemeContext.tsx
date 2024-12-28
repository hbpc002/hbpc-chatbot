import React, { createContext, useState, useContext, useEffect } from 'react';
import { themes } from '../components/chat/ThemeSettings';

interface ThemeContextProps {
  theme: typeof themes[0];
  updateTheme: (theme: typeof themes[0]) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<typeof themes[0]>(themes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('chatTheme');
    if (savedTheme) {
      const parsedTheme = JSON.parse(savedTheme);
      const foundTheme = themes.find(t => t.id === parsedTheme.id);
      if (foundTheme) {
        setTheme(foundTheme);
      }
    }
  }, []);

  const updateTheme = (newTheme: typeof themes[0]) => {
    setTheme(newTheme);
    localStorage.setItem('chatTheme', JSON.stringify(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}; 