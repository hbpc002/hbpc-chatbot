export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    border: string;
    hover: string;
    text: {
      primary: string;
      secondary: string;
    };
    button: {
      primary: string;
      hover: string;
    };
    message: {
      user: string;
      assistant: string;
    };
    input: {
      background: string;
      border: string;
      text: string;
    };
  };
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: '清逸蓝',
    colors: {
      primary: 'from-blue-500 to-blue-600',
      secondary: 'bg-blue-50',
      background: 'bg-gray-50',
      foreground: 'bg-white',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-50',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600'
      },
      button: {
        primary: 'bg-blue-500 hover:bg-blue-600',
        hover: 'hover:bg-blue-50'
      },
      message: {
        user: 'bg-blue-100',
        assistant: 'bg-gray-100'
      },
      input: {
        background: 'bg-white',
        border: 'border-gray-300',
        text: 'text-gray-700'
      }
    }
  },
  {
    id: 'green',
    name: '宁静绿',
    colors: {
      primary: 'from-green-500 to-green-600', 
      secondary: 'bg-green-50',
      background: 'bg-green-50/30',
      foreground: 'bg-white',
      border: 'border-green-100',
      hover: 'hover:bg-green-50',
      text: {
        primary: 'text-green-900',
        secondary: 'text-green-600'
      },
      button: {
        primary: 'bg-green-500 hover:bg-green-600',
        hover: 'hover:bg-green-50'
      },
      message: {
        user: 'bg-green-100',
        assistant: 'bg-gray-100'
      },
      input: {
        background: 'bg-white',
        border: 'border-green-300',
        text: 'text-gray-700'
      }
    }
  },
  // 其他主题配置...
];

import { create } from 'zustand';

interface ThemeStore {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: themes[0],
  setTheme: (themeId) => set({ 
    currentTheme: themes.find(t => t.id === themeId) || themes[0] 
  }),
})); 