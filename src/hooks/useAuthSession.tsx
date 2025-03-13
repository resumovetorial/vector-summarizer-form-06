
import { useState, useEffect } from 'react';
import { AuthUser } from '@/types/auth';

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useAuthSession - Inicializando sessão de autenticação');
    
    // No real authentication is being performed, just initialize the state
    setIsInitialized(true);
    setIsLoading(false);
    
  }, []);

  return { user, setUser, isLoading, isInitialized, error, setError };
}
