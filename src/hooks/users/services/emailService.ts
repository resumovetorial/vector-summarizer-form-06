import { supabase } from '@/integrations/supabase/client';

/**
 * Busca os emails dos usuários através da API de autenticação do Supabase
 */
export const fetchUserEmails = async (): Promise<Record<string, string>> => {
  const emailMap: Record<string, string> = {};
  
  try {
    // Tentar obter usuários via API de admin
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (!authError && authUsers?.users) {
      console.log("Dados dos usuários de autenticação:", authUsers.users);
      authUsers.users.forEach((user: any) => {
        if (user.id && user.email) {
          emailMap[user.id] = user.email;
        }
      });
    } else {
      console.log("Não foi possível obter usuários de autenticação (esperado para acesso não-admin):", authError);
      
      // Tentar obter emails através da tabela auth.users como fallback
      await fetchUserEmailsFromTable(emailMap);
    }
  } catch (authError) {
    console.log("Erro ao buscar usuários de autenticação (esperado para acesso não-admin):", authError);
    await fetchUserEmailsFromTable(emailMap);
  }
  
  return emailMap;
};

/**
 * Tenta buscar emails diretamente da tabela auth.users (fallback)
 */
const fetchUserEmailsFromTable = async (emailMap: Record<string, string>) => {
  try {
    const { data: authData, error: authQueryError } = await supabase
      .from('auth.users')
      .select('id, email');
      
    if (!authQueryError && authData) {
      authData.forEach((user: any) => {
        if (user.id && user.email) {
          emailMap[user.id] = user.email;
        }
      });
    }
  } catch (e) {
    console.log("Erro ao acessar auth.users diretamente:", e);
  }
};
