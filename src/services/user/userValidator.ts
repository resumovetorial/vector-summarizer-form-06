
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a user with the given email already exists
 * Throws an error if the user exists
 */
export const checkUserExists = async (email: string): Promise<void> => {
  const { data: existingUsers, error: searchError } = await supabase
    .from('profiles')
    .select('id, username')
    .ilike('username', email)
    .limit(1);
    
  if (searchError) {
    console.error('Erro ao verificar existência do usuário:', searchError);
    throw new Error(`Erro ao verificar usuário: ${searchError.message}`);
  }

  if (existingUsers && existingUsers.length > 0) {
    console.error(`Usuário com email ${email} já existe`);
    throw new Error(`Usuário com email ${email} já existe`);
  }
};
