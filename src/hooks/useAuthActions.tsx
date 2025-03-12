
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { 
  loginWithSupabase, 
  registerWithSupabase, 
  logoutWithSupabase,
  formatAuthError,
  createAuthUser
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        const authUser = await createAuthUser(data.session);
        setUser(authUser);
        toast.success("Login realizado com sucesso!");
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error("Erro na autenticação");
      }
      
    } catch (error: any) {
      const errorMessage = formatAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
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
      navigate('/login', { replace: true });
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
