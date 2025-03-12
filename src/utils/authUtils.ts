
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/types/auth';
import { toast } from 'sonner';

/**
 * Creates an AuthUser object from a Supabase session and profile data
 */
export const createAuthUser = async (session: Session): Promise<AuthUser> => {
  if (!session.user) {
    throw new Error('No user in session');
  }
  
  try {
    // Fetch user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // If profile fetch fails, return basic user data
      return {
        id: session.user.id,
        username: session.user.email || session.user.id,
        email: session.user.email,
        role: 'user',
        isAuthenticated: true,
      };
    }
    
    // Return full user data with profile information
    return {
      id: session.user.id,
      username: profileData?.username || session.user.email || session.user.id,
      email: session.user.email,
      role: profileData?.role || 'user',
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Error creating auth user:', error);
    // Return basic user data as fallback
    return {
      id: session.user.id,
      username: session.user.email || session.user.id,
      email: session.user.email,
      role: 'user',
      isAuthenticated: true,
    };
  }
};

/**
 * Handles user login with Supabase
 */
export const loginWithSupabase = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Handles user registration with Supabase
 */
export const registerWithSupabase = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Handles user logout with Supabase
 */
export const logoutWithSupabase = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Format error messages for common auth errors
 */
export const formatAuthError = (error: any): string => {
  let errorMessage = "Erro inesperado. Tente novamente.";
  
  if (error.message) {
    if (error.message.includes("already registered")) {
      errorMessage = "Este email já está cadastrado. Por favor, faça login.";
    } else if (error.message.includes("password")) {
      errorMessage = "A senha deve ter pelo menos 6 caracteres.";
    } else if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Email ou senha inválidos. Tente novamente.";
    } else {
      errorMessage = error.message;
    }
  }
  
  return errorMessage;
};
