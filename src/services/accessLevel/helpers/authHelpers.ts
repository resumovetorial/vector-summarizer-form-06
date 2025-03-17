
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Verifies the current user session
 */
export const verifySession = async (supabase: SupabaseClient) => {
  const { data, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Erro ao verificar sessão:', sessionError);
    throw new Error('Erro ao verificar autenticação');
  }
  
  // Verificar se existe uma sessão válida
  if (!data.session) {
    console.error('Usuário não autenticado - sessão não encontrada');
    throw new Error('Você precisa estar autenticado para adicionar níveis de acesso');
  }
  
  const userId = data.session.user.id;
  console.log('Usuário autenticado com ID:', userId);
  
  // Checar se o token JWT ainda é válido
  const now = Math.floor(Date.now() / 1000);
  if (data.session.expires_at && now >= data.session.expires_at) {
    console.error('Token de autenticação expirado');
    throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
  }
  
  return { userId, session: data.session };
};

/**
 * Logs authentication information for debugging
 */
export const logAuthInfo = (userId: string, session: any) => {
  console.log('Verificando token de acesso atual:', {
    token: session.access_token ? session.access_token.substring(0, 20) + '...' : 'Nenhum',
    expires_at: session.expires_at,
    expires_in: session.expires_in
  });
};
