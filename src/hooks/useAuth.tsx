
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
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize the auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          try {
            const authUser = await createAuthUser(session);
            setUser(authUser);
            
            // If on login page and user is authenticated, redirect to home
            if (location.pathname === '/login') {
              const from = (location.state as any)?.from?.pathname || '/';
              navigate(from, { replace: true });
            }
          } catch (error) {
            console.error('Error initializing auth:', error);
            setUser(null);
          }
        } else if (location.pathname !== '/login') {
          // If no session and not on login page, redirect to login
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            try {
              const authUser = await createAuthUser(session);
              setUser(authUser);
              
              // If on login page and user is authenticated, redirect to home
              if (location.pathname === '/login') {
                const from = (location.state as any)?.from?.pathname || '/';
                navigate(from, { replace: true });
              }
            } catch (error) {
              console.error('Error updating auth state:', error);
              setUser(null);
            }
          } else {
            setUser(null);
            
            // If not on login page and user is not authenticated, redirect to login
            if (location.pathname !== '/login') {
              navigate('/login', { replace: true });
            }
          }
        }
      );
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, [navigate, location]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const data = await loginWithSupabase(email, password);
      
      if (data.user) {
        toast.success("Login bem-sucedido!");
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const data = await registerWithSupabase(email, password);
      
      if (data.user) {
        toast.success("Cadastro realizado com sucesso! Você já pode fazer login.");
        return;
      }
    } catch (error: any) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      console.error("Registration error:", error);
      throw error; // Propagate error
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutWithSupabase();
      
      setUser(null);
      navigate('/login');
      toast.success("Logout realizado com sucesso");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create the auth context value
  const authContextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContextProvider value={authContextValue}>
      {children}
    </AuthContextProvider>
  );
}
