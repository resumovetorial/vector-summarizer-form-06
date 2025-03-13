
import { supabase } from '@/lib/supabase';
import { AccessLevel } from '@/types/admin';

export const updateAccessLevel = async (level: AccessLevel): Promise<AccessLevel> => {
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
      throw new Error('Você precisa estar autenticado para atualizar níveis de acesso');
    }
    
    // In Supabase, ID is a UUID, so we need to find the correct UUID
    const { data: existingLevels, error: fetchError } = await supabase
      .from('access_levels')
      .select('id')
      .eq('name', level.name)
      .limit(1);
    
    if (fetchError || !existingLevels || existingLevels.length === 0) {
      console.error('Erro ao encontrar nível de acesso:', fetchError);
      throw fetchError || new Error('Nível de acesso não encontrado');
    }
    
    const supabaseId = existingLevels[0].id;
    
    const { data: updateData, error } = await supabase
      .from('access_levels')
      .update({
        name: level.name,
        description: level.description,
        permissions: level.permissions,
      })
      .eq('id', supabaseId)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar nível de acesso:', error);
      
      // Verificar se é um erro de RLS
      if (error.message.includes('violates row-level security policy')) {
        throw new Error('Você não tem permissão para atualizar níveis de acesso. Você precisa ter função de administrador.');
      }
      
      throw error;
    }
    
    return {
      id: level.id, // Keep original ID for interface consistency
      name: updateData.name,
      description: updateData.description || '',
      permissions: updateData.permissions,
    };
  } catch (error: any) {
    console.error('Falha ao atualizar nível de acesso:', error);
    throw error;
  }
};
