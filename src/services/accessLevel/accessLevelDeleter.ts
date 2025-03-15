
import { supabase } from '@/lib/supabase';

export const deleteAccessLevel = async (levelName: string): Promise<void> => {
  try {
    // Buscar a sessão atual - mais confiável
    const { data, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError);
      throw new Error('Erro ao verificar autenticação');
    }
    
    // Verificar se existe uma sessão válida
    if (!data.session) {
      console.error('Usuário não autenticado - sessão não encontrada');
      throw new Error('Você precisa estar autenticado para excluir níveis de acesso');
    }
    
    // Obter o perfil do usuário para verificar o nível de acesso
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, access_level_id')
      .eq('id', data.session.user.id)
      .single();
      
    if (profileError || !profileData) {
      console.error('Erro ao obter perfil do usuário:', profileError);
      throw new Error('Não foi possível verificar seu nível de acesso');
    }
    
    // Verificar se é administrador ou supervisor
    const isAdmin = profileData.role === 'admin';
    
    // Se não for admin, verificar o access_level_id
    if (!isAdmin && profileData.access_level_id) {
      const { data: accessLevelData, error: accessLevelError } = await supabase
        .from('access_levels')
        .select('name')
        .eq('id', profileData.access_level_id)
        .single();
        
      if (accessLevelError || !accessLevelData) {
        throw new Error('Erro ao verificar nível de acesso');
      }
      
      const levelName = accessLevelData.name.toLowerCase();
      if (levelName !== 'supervisor' && levelName !== 'administrador') {
        throw new Error('Apenas administradores e supervisores podem gerenciar níveis de acesso');
      }
    } else if (!isAdmin) {
      throw new Error('Apenas administradores e supervisores podem gerenciar níveis de acesso');
    }
    
    // Verify if it's the "Agente" level, which should be removable
    if (levelName.toLowerCase() === 'agente') {
      console.log('Removendo nível de acesso "Agente" conforme solicitado');
    }
    
    // Find the UUID of the access level by name
    const { data: existingLevels, error: fetchError } = await supabase
      .from('access_levels')
      .select('id')
      .eq('name', levelName)
      .limit(1);
    
    if (fetchError || !existingLevels || existingLevels.length === 0) {
      console.error('Erro ao encontrar nível de acesso:', fetchError);
      throw fetchError || new Error('Nível de acesso não encontrado');
    }
    
    const supabaseId = existingLevels[0].id;
    
    const { error } = await supabase
      .from('access_levels')
      .delete()
      .eq('id', supabaseId);
    
    if (error) {
      console.error('Erro ao excluir nível de acesso:', error);
      
      // Verificar se é um erro de RLS
      if (error.message.includes('violates row-level security policy')) {
        throw new Error('Você não tem permissão para excluir níveis de acesso. Você precisa ter função de administrador.');
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Falha ao excluir nível de acesso:', error);
    throw error;
  }
};
