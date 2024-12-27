import { useState, useCallback } from 'react';

export function useError() {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: Error | string) => {
    const message = error instanceof Error ? error.message : error;
    setError(message);
    console.error(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
} 