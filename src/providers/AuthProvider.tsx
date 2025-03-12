
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

  // Simplificando a lógica de redirecionamento para evitar loops
  useEffect(() => {
    // Não faça nada até a autenticação ser inicializada
    if (!isInitialized) return;
    
    // Se estamos na página de login e já estamos autenticados, redirecione
    if (user && location.pathname === '/login') {
      // Redirecione para o dashboard ou para a rota de origem
      const destination = location.state?.from?.pathname || '/dashboard';
      console.log('AuthProvider - Redirecionando para:', destination);
      // Use setTimeout para garantir que o redirecionamento aconteça depois do render atual
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 0);
    }
  }, [user, isInitialized, location.pathname]);

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
