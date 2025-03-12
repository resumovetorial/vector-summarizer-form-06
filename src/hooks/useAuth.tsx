
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import AuthContext, { AuthProvider as AuthContextProvider } from '@/contexts/AuthContext';
import { AuthUser, AuthContextType } from '@/types/auth';
import { 
  createAuthUser, 
  loginWithSupabase, 
  registerWithSupabase, 
  logoutWithSupabase,
  formatAuthError
} from '@/utils/authUtils';

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component that wraps the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize the auth state from Supabase session
  useEffect(() => {
    console.log('Inicializando autenticação...');
    let isMounted = true;
    
    const initializeAuth = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Verificando sessão...');
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao obter sessão:', sessionError);
          setError(sessionError.message);
          setUser(null);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          console.log('Sessão encontrada, criando usuário...');
          try {
            const authUser = await createAuthUser(session);
            console.log('Usuário autenticado:', authUser);
            
            if (isMounted) {
              setUser(authUser);
              setIsInitialized(true);
              setIsLoading(false);
            }
          } catch (error: any) {
            console.error('Erro ao inicializar autenticação:', error);
            if (isMounted) {
              setError(error.message || 'Erro ao inicializar autenticação');
              setUser(null);
              setIsInitialized(true);
              setIsLoading(false);
            }
          }
        } else {
          console.log('Nenhuma sessão encontrada');
          if (isMounted) {
            setUser(null);
            setIsInitialized(true);
            setIsLoading(false);
          }
        }
      } catch (error: any) {
        console.error('Erro ao verificar sessão:', error);
        if (isMounted) {
          setError(error.message || 'Erro ao verificar sessão');
          setUser(null);
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted) return;
        
        if (session) {
          try {
            console.log('Sessão atualizada, criando usuário...');
            const authUser = await createAuthUser(session);
            console.log('Usuário atualizado:', authUser);
            
            if (isMounted) {
              setUser(authUser);
              setError(null);
            }
          } catch (error: any) {
            console.error('Erro ao atualizar estado da autenticação:', error);
            if (isMounted) {
              setError(error.message || 'Erro ao atualizar estado da autenticação');
              setUser(null);
            }
          }
        } else {
          console.log('Sessão encerrada');
          if (isMounted) {
            setUser(null);
          }
        }
        
        // Garantir que o estado de loading e inicialização estejam corretos
        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Tentando login com:', email);
      const data = await loginWithSupabase(email, password);
      
      if (data.user) {
        console.log('Login bem-sucedido:', data.user);
        toast.success("Login bem-sucedido!");
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      const errorMessage = formatAuthError(error);
      console.error("Erro de login:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Tentando registrar:', email);
      const data = await registerWithSupabase(email, password);
      
      if (data.user) {
        console.log('Registro bem-sucedido:', data.user);
        toast.success("Cadastro realizado com sucesso! Você já pode fazer login.");
        return;
      }
    } catch (error: any) {
      const errorMessage = formatAuthError(error);
      console.error("Erro de registro:", error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error; // Propagate error
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Realizando logout...');
      await logoutWithSupabase();
      
      setUser(null);
      navigate('/login');
      toast.success("Logout realizado com sucesso");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      setError(error.message || "Erro ao fazer logout");
      toast.error(error.message || "Erro ao fazer logout");
    } finally {
      setIsLoading(false);
    }
  };

  // Criar valor do contexto de autenticação
  const authContextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    error
  };

  console.log('Estado atual da autenticação:', {
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    user: user ? { ...user, id: '[REDACTED]' } : null
  });

  return (
    <AuthContextProvider value={authContextValue}>
      {children}
    </AuthContextProvider>
  );
}
