
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
    try {
      setIsLoading(true);
      setError(null);
      
      // Login direto usando supabase para garantir controle mais preciso
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.user && data.session) {
        const authUser = await createAuthUser(data.session);
        console.log('Login bem-sucedido, usuário:', authUser);
        setUser(authUser);
        toast.success("Login realizado com sucesso!");
        
        // Redirecione após definir o usuário
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
        return true;
      } else {
        throw new Error("Dados de usuário ou sessão ausentes após login");
      }
      
    } catch (error: any) {
      console.error('Erro no login:', error);
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
      
      // Registrando usuário diretamente
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar.");
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
      await logoutWithSupabase();
      setUser(null);
      
      // Redirecione após logout
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
      
      toast.success("Logout realizado com sucesso");
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
