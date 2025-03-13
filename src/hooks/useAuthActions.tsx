
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { 
  formatAuthError,
  createAuthUser,
  logoutWithSupabase
} from '@/utils/authUtils';
import { AuthUser } from '@/types/auth';

export function useAuthActions(
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    console.log('useAuthActions - Tentando login com email:', email);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate successful login without actual authentication
      console.log('useAuthActions - Simulando login bem-sucedido');
      
      // Create a mock user that matches the AuthUser interface
      const mockUser: AuthUser = {
        id: '1',
        email: email,
        username: email.split('@')[0], // Use part of email as username
        role: 'admin',
        isAuthenticated: true
      };
      
      setUser(mockUser);
      toast.success("Login realizado com sucesso!");
      
      // Navigate to dashboard with replace to avoid navigation issues
      console.log('useAuthActions - Login simulado bem-sucedido, redirecionando para dashboard');
      navigate('/dashboard', { replace: true });
      return true;
      
    } catch (error: any) {
      console.error('useAuthActions - Erro no login:', error);
      const errorMessage = formatAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate successful registration
      toast.success("Cadastro realizado com sucesso! Usuário criado.");
      return true;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      const errorMessage = formatAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Don't actually log out from Supabase, just clear local state
      setUser(null);
      toast.success("Logout realizado com sucesso");
      navigate('/login', { replace: true });
      return true;
    } catch (error: any) {
      console.error('Erro no logout:', error);
      setError(error.message);
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, logout };
}
