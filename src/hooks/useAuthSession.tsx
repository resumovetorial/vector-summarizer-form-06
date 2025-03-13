
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/types/auth';
import { createAuthUser } from '@/utils/authUtils';

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Inicializa a sessão de autenticação
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Obtém a sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (session?.user) {
          const authUser = await createAuthUser(session);
          setUser(authUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Erro na inicialização');
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };
    
    // Inicializa a autenticação ao montar
    initializeAuth();
    
    // Configura o listener para mudanças de estado da autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user) {
          try {
            setIsLoading(true);
            const authUser = await createAuthUser(session);
            setUser(authUser);
          } catch (error) {
            console.error('Erro ao processar mudança de estado:', error);
          } finally {
            setIsLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    // Limpeza
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, isInitialized, error, setError };
}
