
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
    let isMounted = true;
    
    // Initialize auth session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
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
    
    // Initialize auth on mount
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user) {
          try {
            setIsLoading(true);
            const authUser = await createAuthUser(session);
            setUser(authUser);
          } catch (error) {
            console.error('Error handling auth state change:', error);
          } finally {
            setIsLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, isInitialized, error, setError };
}
