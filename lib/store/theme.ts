import { create } from 'zustand';

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
  };
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: '默认蓝',
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
      }
    }
  },
  {
    id: 'green',
    name: '清新绿',
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
      }
    }
  },
  {
    id: 'purple',
    name: '典雅紫',
    colors: {
      primary: 'from-purple-500 to-purple-600',
      secondary: 'bg-purple-50',
      background: 'bg-purple-50/30',
      foreground: 'bg-white',
      border: 'border-purple-100',
      hover: 'hover:bg-purple-50',
      text: {
        primary: 'text-purple-900',
        secondary: 'text-purple-600'
      },
      button: {
        primary: 'bg-purple-500 hover:bg-purple-600',
        hover: 'hover:bg-purple-50'
      }
    }
  },
  {
    id: 'rose',
    name: '玫瑰红',
    colors: {
      primary: 'from-rose-500 to-rose-600',
      secondary: 'bg-rose-50',
      background: 'bg-rose-50/30',
      foreground: 'bg-white',
      border: 'border-rose-100',
      hover: 'hover:bg-rose-50',
      text: {
        primary: 'text-rose-900',
        secondary: 'text-rose-600'
      },
      button: {
        primary: 'bg-rose-500 hover:bg-rose-600',
        hover: 'hover:bg-rose-50'
      }
    }
  }
];

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