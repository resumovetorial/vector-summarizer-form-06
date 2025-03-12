
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

  // Redirecionamento somente após inicialização completa
  useEffect(() => {
    if (!isInitialized) {
      return; // Não faça nada até que a autenticação esteja totalmente inicializada
    }

    // Apenas redirecione se estivermos na página de login e já estiver autenticado
    if (user && location.pathname === '/login') {
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('AuthProvider - Redirecionando usuário autenticado para:', from);
      navigate(from, { replace: true });
    }
  }, [user, isInitialized, location, navigate]);

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
