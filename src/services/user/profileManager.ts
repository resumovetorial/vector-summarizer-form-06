
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates or updates a user profile in the database
 */
export const createOrUpdateProfile = async (
  userId: string,
  formData: {
    name: string;
    role: string;
    active: boolean;
  },
  accessLevelUuid: string | null
): Promise<void> => {
  try {
    // Tentativa 1: Usar o cliente normal para inserir o perfil
    try {
      const { error: insertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: formData.name,
          role: formData.role,
          active: formData.active,
          access_level_id: accessLevelUuid
        }, { onConflict: 'id' });
        
      if (insertError) {
        console.error('Erro ao inserir perfil diretamente:', insertError);
        // Continuar tentando outros métodos
      } else {
        console.log("Perfil inserido/atualizado com sucesso diretamente");
        return;
      }
    } catch (insertError) {
      console.error('Erro ao inserir perfil diretamente:', insertError);
    }
    
    // Tentativa 2: Tentar usar RPC
    try {
      const { data: profileData, error: profileError } = await supabase.rpc('create_or_update_profile', {
        p_id: userId,
        p_username: formData.name,
        p_role: formData.role,
        p_active: formData.active,
        p_access_level_id: accessLevelUuid
      });
      
      if (profileError) {
        console.error('Erro ao criar/atualizar perfil via RPC:', profileError);
        // Continuar em modo de demonstração
      } else {
        console.log("Perfil criado/atualizado com sucesso via RPC:", profileData);
      }
    } catch (rpcError) {
      console.error('Erro na operação RPC de criação do perfil:', rpcError);
    }
  } catch (error: any) {
    console.error('Erro na operação de criação do perfil:', error);
    // Continuar em modo de demonstração mesmo com erro
  }
};
