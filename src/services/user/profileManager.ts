
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
    // Try to use the RPC function for creating/updating profile
    const { data: profileData, error: profileError } = await supabase.rpc('create_or_update_profile', {
      p_id: userId,
      p_username: formData.name,
      p_role: formData.role,
      p_active: formData.active,
      p_access_level_id: accessLevelUuid
    });
    
    if (profileError) {
      console.error('Erro ao criar/atualizar perfil via RPC:', profileError);
      throw profileError;
    }
    
    console.log("Perfil criado/atualizado com sucesso:", profileData);
    
  } catch (error: any) {
    console.error('Erro na operação de criação do perfil:', error);
    throw error;
  }
};
