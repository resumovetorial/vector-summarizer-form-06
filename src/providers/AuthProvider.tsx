
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

  // Simplified redirection logic
  useEffect(() => {
    // Don't redirect until authentication is initialized
    if (!isInitialized) return;
    
    // If user is authenticated and on the login page, redirect to dashboard
    if (user && location.pathname === '/login') {
      const destination = location.state?.from?.pathname || '/dashboard';
      // Small delay to prevent immediate redirection that might cause loops
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 50);
    }
  }, [user, isInitialized, location.pathname, navigate, location.state]);

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
