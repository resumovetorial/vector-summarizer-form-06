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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    console.log('AuthProvider - Iniciando inicialização');

    const initializeAuth = async () => {
      try {
        console.log('AuthProvider - Verificando sessão existente');
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          console.log('AuthProvider - Sessão encontrada, criando usuário', session.user.email);
          const authUser = await createAuthUser(session);
          console.log('AuthProvider - Usuário criado:', authUser);
          setUser(authUser);
        } else {
          console.log('AuthProvider - Nenhuma sessão encontrada');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthProvider - Erro na inicialização:', error);
        setError(error instanceof Error ? error.message : 'Erro na inicialização');
      } finally {
        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
          console.log('AuthProvider - Inicialização completa');
        }
      }
    };

    initializeAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider - Mudança no estado de autenticação:', event);

      if (!mounted) return;

      try {
        if (session?.user) {
          const authUser = await createAuthUser(session);
          console.log('AuthProvider - Usuário atualizado:', authUser);
          setUser(authUser);
        } else {
          console.log('AuthProvider - Usuário deslogado');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthProvider - Erro ao atualizar usuário:', error);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    login: async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await loginWithSupabase(email, password);
      } catch (error: any) {
        const errorMessage = formatAuthError(error);
        setError(errorMessage);
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    register: async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await registerWithSupabase(email, password);
        toast.success("Cadastro realizado com sucesso!");
      } catch (error: any) {
        const errorMessage = formatAuthError(error);
        setError(errorMessage);
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    logout: async () => {
      try {
        setIsLoading(true);
        await logoutWithSupabase();
        setUser(null);
        navigate('/login');
        toast.success("Logout realizado com sucesso");
      } catch (error: any) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    error
  };

  console.log('AuthProvider - Estado atual:', {
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    user: user ? { email: user.email, role: user.role } : null
  });

  return (
    <AuthContextProvider value={value}>
      {children}
    </AuthContextProvider>
  );
}
