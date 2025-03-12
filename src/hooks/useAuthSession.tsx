
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/types/auth';
import { createAuthUser } from '@/utils/authUtils';

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializationAttempted = useRef(false);

  useEffect(() => {
    let mounted = true;
    console.log('useAuthSession - Iniciando verificação de sessão');

    // Evitar múltiplas inicializações
    if (initializationAttempted.current) {
      console.log('useAuthSession - Inicialização já foi tentada');
      return;
    }
    
    initializationAttempted.current = true;
    
    const initializeAuth = async () => {
      try {
        console.log('useAuthSession - Verificando sessão existente');
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          console.log('useAuthSession - Sessão encontrada para', session.user.email);
          const authUser = await createAuthUser(session);
          setUser(authUser);
        } else {
          console.log('useAuthSession - Nenhuma sessão ativa encontrada');
          setUser(null);
        }
      } catch (error) {
        console.error('useAuthSession - Erro na inicialização:', error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Erro na inicialização');
        }
      } finally {
        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
          console.log('useAuthSession - Inicialização completa');
        }
      }
    };

    initializeAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuthSession - Mudança no estado de autenticação:', event);

      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setIsLoading(true);

        try {
          if (session?.user) {
            console.log('useAuthSession - Usuário autenticado:', session.user.email);
            const authUser = await createAuthUser(session);
            setUser(authUser);
          } else {
            console.log('useAuthSession - Usuário deslogado');
            setUser(null);
          }
        } catch (error) {
          console.error('useAuthSession - Erro ao processar mudança de estado:', error);
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, isInitialized, error, setError };
}
