import { useState, useEffect } from 'react';

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace this with your actual user fetching logic
    setTimeout(() => {
      setUser({ name: 'Test User' });
      setIsLoading(false);
    }, 500);
  }, []);

  return { user, isLoading };
}; 