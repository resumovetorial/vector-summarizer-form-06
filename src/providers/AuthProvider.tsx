
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthUser, AuthContextType } from '@/types/auth';
import AuthContext from '@/contexts/AuthContext';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuthActions } from '@/hooks/useAuthActions';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    user, 
    setUser, 
    isLoading: isSessionLoading, 
    isInitialized, 
    error, 
    setError 
  } = useAuthSession();
  
  const { login, register, logout } = useAuthActions(
    setUser,
    setError,
    setIsLoading
  );

  // Effect to handle redirection only after proper initialization
  useEffect(() => {
    if (!isInitialized || isSessionLoading) {
      return; // Don't do anything until auth is fully initialized
    }

    const path = location.pathname;
    
    // Only redirect if we're on login page and already authenticated
    if (user && path === '/login') {
      const from = location.state?.from?.pathname || '/';
      console.log('AuthProvider - Redirecting authenticated user to:', from);
      navigate(from, { replace: true });
    }
  }, [user, isInitialized, isSessionLoading, location, navigate]);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading: isLoading || isSessionLoading,
    isInitialized,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
