
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

  // Corrigindo loop infinito - simplificando a lógica de redirecionamento
  useEffect(() => {
    // Não redirecionar até que a autenticação seja inicializada
    if (!isInitialized) return;
    
    // Páginas que não exigem autenticação
    const publicPages = ['/login', '/unauthorized'];
    const isPublicPage = publicPages.includes(location.pathname);
    
    // Redirecionamento básico - apenas redirecionar para a dashboard no login bem-sucedido
    // ou para login quando em página protegida sem autenticação
    if (user && location.pathname === '/login') {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } else if (!user && !isPublicPage) {
      // Apenas redirecionar para login quando definitivamente não autenticado
      // e não estiver em uma página pública
      navigate('/login', { 
        replace: true,
        state: { from: location } 
      });
    }
  }, [user, isInitialized, location.pathname, navigate, location]);

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
