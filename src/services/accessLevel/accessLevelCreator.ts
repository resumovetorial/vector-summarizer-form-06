
import { supabase } from '@/lib/supabase';
import { AccessLevel } from '@/types/admin';

export const createAccessLevel = async (level: Omit<AccessLevel, 'id'>): Promise<AccessLevel> => {
  try {
    // Verificar a sessão atual do usuário - Modificado para compatibilidade
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Usuário não autenticado');
      throw new Error('Você precisa estar autenticado para adicionar níveis de acesso');
    }
    
    console.log('Tentando criar nível de acesso como usuário:', session.user.id);
    console.log('Dados do nível de acesso:', level);
    
    const { data, error } = await supabase
      .from('access_levels')
      .insert([{
        name: level.name,
        description: level.description,
        permissions: level.permissions,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar nível de acesso:', error);
      
      // Verificar se é um erro de RLS
      if (error.message.includes('violates row-level security policy')) {
        throw new Error('Você não tem permissão para adicionar níveis de acesso. Você precisa ter função de administrador.');
      }
      
      throw error;
    }
    
    return {
      id: parseInt(data.id), // Keeping compatibility with existing type
      name: data.name,
      description: data.description || '',
      permissions: data.permissions,
    };
  } catch (error: any) {
    console.error('Falha ao criar nível de acesso:', error);
    throw error;
  }
};
