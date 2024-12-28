import { useState, useEffect } from 'react';

export const useTheme = (defaultTheme: any) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('chatTheme');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'chatTheme') {
        const newTheme = localStorage.getItem('chatTheme');
        if (newTheme) {
          setTheme(JSON.parse(newTheme));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateTheme = (newTheme: any) => {
    setTheme({...newTheme});
    localStorage.setItem('chatTheme', JSON.stringify(newTheme));
  };

  return { theme, updateTheme };
}; 