
import { supabase } from '@/lib/supabase';
import { AccessLevel } from '@/types/admin';
import { toast } from 'sonner';

export const fetchAccessLevels = async (): Promise<AccessLevel[]> => {
  // Attempt to fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('access_levels')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar níveis de acesso:', error);
      throw error;
    }
    
    // Log the access levels we've fetched
    console.log('Fetched access levels:', data);
    
    // Convert the data to match our AccessLevel type
    return data.map(level => ({
      id: parseInt(level.id), // Keeping compatibility with existing type that uses number
      name: level.name,
      description: level.description || '',
      permissions: level.permissions,
    }));
  } catch (error) {
    console.error('Erro ao buscar níveis de acesso do Supabase, usando fallback:', error);
    
    // Return default levels if Supabase query fails
    return [
      {
        id: 1,
        name: 'Administrador',
        description: 'Acesso completo ao sistema',
        permissions: ['dashboard', 'form', 'admin', 'reports', 'settings']
      },
      {
        id: 2,
        name: 'Supervisor Geral',
        description: 'Acesso ao dashboard e formulários',
        permissions: ['dashboard', 'form', 'reports']
      },
      {
        id: 3,
        name: 'Supervisor Area',
        description: 'Acesso ao dashboard e formulários de áreas específicas',
        permissions: ['dashboard', 'form', 'reports']
      },
      {
        id: 4,
        name: 'Agente',
        description: 'Acesso apenas aos formulários',
        permissions: ['form']
      }
    ];
  }
};

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

export const updateAccessLevel = async (level: AccessLevel): Promise<AccessLevel> => {
  try {
    // Verificar a sessão atual do usuário - Modificado para compatibilidade
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Usuário não autenticado');
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
    
    const { data, error } = await supabase
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
      name: data.name,
      description: data.description || '',
      permissions: data.permissions,
    };
  } catch (error: any) {
    console.error('Falha ao atualizar nível de acesso:', error);
    throw error;
  }
};

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
