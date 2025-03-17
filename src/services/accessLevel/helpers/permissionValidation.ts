
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Verifies if the user has permission to manage access levels
 */
export const verifyUserPermission = async (supabase: SupabaseClient, userId: string, isSimulatedMode: boolean) => {
  if (isSimulatedMode) {
    console.log('Modo de demonstração ativo - ignorando verificações de permissão detalhadas');
    return true;
  }
  
  // Obter o perfil do usuário para verificar o nível de acesso
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role, access_level_id')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    console.error('Erro ao obter perfil do usuário:', profileError);
    return false;
  }
  
  // Verificar se é administrador ou supervisor
  const isAdmin = profileData?.role === 'admin';
  const accessLevelId = profileData?.access_level_id;
  
  console.log('Dados do perfil:', {
    role: profileData?.role,
    accessLevelId: accessLevelId,
    isAdmin
  });
  
  // Se não for admin, verificar o access_level_id
  if (!isAdmin && accessLevelId) {
    const { data: accessLevelData, error: accessLevelError } = await supabase
      .from('access_levels')
      .select('name')
      .eq('id', accessLevelId)
      .single();
      
    if (accessLevelError) {
      console.error('Erro ao verificar nível de acesso:', accessLevelError);
      // Continuar e tentar criar mesmo com erro na verificação
    } else if (accessLevelData) {
      const levelName = accessLevelData.name.toLowerCase();
      console.log('Nome do nível de acesso:', levelName);
      if (levelName !== 'supervisor' && levelName !== 'administrador') {
        throw new Error('Apenas administradores e supervisores podem gerenciar níveis de acesso');
      }
    }
  } else if (!isAdmin) {
    // Mesmo sem nível de acesso, tentaremos criar - a RLS do banco cuidará da permissão real
    console.log('Usuário não é admin e não tem nível de acesso específico. Tentando criar mesmo assim.');
  }
  
  return true;
};
