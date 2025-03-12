
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

  // Effect para redirecionamento após login bem-sucedido
  useEffect(() => {
    if (user && isInitialized && !isSessionLoading && location.pathname === '/login') {
      const from = (location.state as any)?.from?.pathname || '/';
      console.log('AuthProvider - Redirecionando usuário autenticado para:', from);
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

  console.log('AuthProvider - Estado atual:', {
    isAuthenticated: !!user,
    isLoading: isLoading || isSessionLoading,
    isInitialized,
    pathname: location.pathname,
    user: user ? { email: user.email, role: user.role } : null
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
