
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
    
    const userId = data.session.user.id;
    console.log('Usuário autenticado com ID:', userId);
    
    // Checar se o token JWT ainda é válido
    const now = Math.floor(Date.now() / 1000);
    if (data.session.expires_at && now >= data.session.expires_at) {
      console.error('Token de autenticação expirado');
      throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
    }
    
    // Obter o perfil do usuário para verificar o nível de acesso
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, access_level_id')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Erro ao obter perfil do usuário:', profileError);
      
      // Verificação adicional - tentar inserir mesmo sem verificação de perfil
      // Isso permitirá que administradores ainda possam criar níveis mesmo com erros na verificação de perfil
      console.log('Tentando criar nível de acesso sem verificação de perfil');
      
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
        id: parseInt(insertData.id), // Manter compatibilidade com o tipo existente
        name: insertData.name,
        description: insertData.description || '',
        permissions: insertData.permissions,
      };
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
    
    // Não podemos acessar supabaseKey diretamente, mas podemos usar o token de autenticação
    // que já está configurado no cliente Supabase automaticamente
    console.log('Tentando criar nível de acesso como usuário:', userId);
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
