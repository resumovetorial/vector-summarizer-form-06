
import { useState, useEffect } from 'react';
import { AuthContextType } from '@/types/auth';
import AuthContext from '@/contexts/AuthContext';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuthActions } from '@/hooks/useAuthActions';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Função para verificar se o usuário tem a permissão (role) necessária
  const hasPermission = (requiredRole: string): boolean => {
    if (!user) return false;
    
    // 'admin' tem acesso a tudo
    if (user.role === 'admin') return true;
    
    // Verifica se o usuário tem o papel específico
    return user.role === requiredRole;
  };
  
  // Função para verificar se o usuário tem o nível de acesso necessário
  const hasAccessLevel = (requiredLevel: 'agente' | 'supervisor' | 'administrador'): boolean => {
    if (!user) return false;
    
    // Se o usuário for admin, tem acesso a tudo
    if (user.role === 'admin') return true;
    
    // Se não tiver nível de acesso definido, não tem acesso
    if (!user.accessLevel) return false;
    
    // Hierarquia de acesso: administrador > supervisor > agente
    if (user.accessLevel === 'administrador') return true;
    if (user.accessLevel === 'supervisor' && requiredLevel !== 'administrador') return true;
    if (user.accessLevel === 'agente' && requiredLevel === 'agente') return true;
    
    return false;
  };

  useEffect(() => {
    console.log('AuthProvider - Estado de autenticação atualizado:', { 
      user: user ? 'logado' : 'deslogado',
      role: user?.role || 'nenhum',
      accessLevel: user?.accessLevel || 'nenhum',
      isInitialized, 
      isLoading: isLoading || isSessionLoading 
    });
  }, [user, isInitialized, isLoading, isSessionLoading]);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading: isLoading || isSessionLoading,
    isInitialized,
    error,
    hasPermission,
    hasAccessLevel
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
