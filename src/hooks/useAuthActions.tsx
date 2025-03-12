
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  loginWithSupabase, 
  registerWithSupabase, 
  logoutWithSupabase,
  formatAuthError
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
      
      // Primeiro verifica a autenticação antes de redirecionar
      const { session } = await loginWithSupabase(email, password);
      
      // Não redirecionamos aqui - deixamos o useAuthSession fazer isso quando detectar a mudança de sessão
      console.log('Login bem-sucedido, session:', session?.user?.email);
      toast.success("Login realizado com sucesso!");
      
    } catch (error: any) {
      const errorMessage = formatAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
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
  };

  const logout = async () => {
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
  };

  return { login, register, logout };
}
