
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/types/auth';
import { createAuthUser } from '@/utils/authUtils';

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useAuthSession - Inicializando sessão de autenticação');
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Obtém a sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (session?.user) {
          console.log('useAuthSession - Sessão encontrada, criando usuário autenticado');
          const authUser = await createAuthUser(session);
          setUser(authUser);
        } else {
          console.log('useAuthSession - Nenhuma sessão encontrada');
          setUser(null);
        }
      } catch (error) {
        console.error('useAuthSession - Erro na inicialização:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Erro na inicialização');
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
          console.log('useAuthSession - Inicialização concluída');
        }
      }
    };
    
    // Inicializa a autenticação ao montar
    initializeAuth();
    
    // Configura o listener para mudanças de estado da autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log('useAuthSession - Mudança de estado de autenticação:', event);
      
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user) {
          try {
            setIsLoading(true);
            const authUser = await createAuthUser(session);
            setUser(authUser);
          } catch (error) {
            console.error('useAuthSession - Erro ao processar mudança de estado:', error);
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
      console.log('useAuthSession - Limpando listeners');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, isInitialized, error, setError };
}
