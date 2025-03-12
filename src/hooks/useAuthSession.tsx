
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
    let mounted = true;
    console.log('useAuthSession - Iniciando inicialização');

    const initializeAuth = async () => {
      try {
        console.log('useAuthSession - Verificando sessão existente');
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          console.log('useAuthSession - Sessão encontrada, criando usuário', session.user.email);
          const authUser = await createAuthUser(session);
          console.log('useAuthSession - Usuário criado:', authUser);
          setUser(authUser);
        } else {
          console.log('useAuthSession - Nenhuma sessão encontrada');
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

      try {
        if (session?.user) {
          const authUser = await createAuthUser(session);
          console.log('useAuthSession - Usuário atualizado:', authUser);
          setUser(authUser);
        } else {
          console.log('useAuthSession - Usuário deslogado');
          setUser(null);
        }
      } catch (error) {
        console.error('useAuthSession - Erro ao atualizar usuário:', error);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, isInitialized, error, setError };
}
