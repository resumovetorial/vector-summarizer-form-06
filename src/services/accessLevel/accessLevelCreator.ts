
import { supabase } from '@/lib/supabase';
import { AccessLevel } from '@/types/admin';

export const createAccessLevel = async (level: Omit<AccessLevel, 'id'>): Promise<AccessLevel> => {
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
      throw new Error('Você precisa estar autenticado para adicionar níveis de acesso');
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
    
    console.log('Tentando criar nível de acesso como usuário:', data.session.user.id);
    console.log('Dados do nível de acesso:', level);
    
    const { data: insertData, error } = await supabase
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
      id: parseInt(insertData.id), // Keeping compatibility with existing type
      name: insertData.name,
      description: insertData.description || '',
      permissions: insertData.permissions,
    };
  } catch (error: any) {
    console.error('Falha ao criar nível de acesso:', error);
    throw error;
  }
};
