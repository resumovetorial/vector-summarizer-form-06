
import { supabase } from '@/lib/supabase';

export const deleteAccessLevel = async (levelName: string): Promise<void> => {
  try {
    // Verificar a sessão atual do usuário - Modificado para compatibilidade
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Usuário não autenticado');
      throw new Error('Você precisa estar autenticado para excluir níveis de acesso');
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
