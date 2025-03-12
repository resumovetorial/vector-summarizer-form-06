
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthUser {
  username: string;
  role: string;
  isAuthenticated: boolean;
  id: string;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize the auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await handleSessionChange(session);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session) {
            await handleSessionChange(session);
          } else {
            setUser(null);
          }
        }
      );
      
      setIsLoading(false);
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, [navigate]);

  const handleSessionChange = async (session: Session) => {
    if (!session.user) return;
    
    try {
      // Buscar dados do perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', profileError);
      }
      
      // Get user's role from profile or default to "user"
      const role = profileData?.role || 'user';
      
      const authUser: AuthUser = {
        id: session.user.id,
        username: profileData?.username || session.user.email || session.user.id,
        email: session.user.email,
        role: role,
        isAuthenticated: true,
      };
      
      setUser(authUser);
    } catch (error) {
      console.error('Error setting user data:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Login bem-sucedido!");
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login. Tente novamente.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Cadastro realizado com sucesso! Você já pode fazer login.");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      isAuthenticated: !!user,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
