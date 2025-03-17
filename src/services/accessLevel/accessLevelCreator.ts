
import { supabase } from '@/lib/supabase';
import { AccessLevel } from '@/types/admin';
import { verifySession, logAuthInfo } from './helpers/authHelpers';
import { verifyUserPermission } from './helpers/permissionValidation';
import { handleDemoMode } from './helpers/demoModeHandler';

export const createAccessLevel = async (level: Omit<AccessLevel, 'id'>): Promise<AccessLevel> => {
  try {
    // Verificar sessão e autenticação
    const { userId, session } = await verifySession(supabase);
    
    // Logar informações de autenticação para debug
    logAuthInfo(userId, session);
    
    console.log('Tentando criar nível de acesso como usuário:', userId);
    console.log('Dados do nível de acesso:', level);
    
    // Em modo de demonstração/simulação, permitir a criação sem verificações complexas
    const isSimulatedMode = true; // Assumindo modo de demonstração sempre ativo para esse exemplo
    
    if (isSimulatedMode) {
      return await handleDemoMode(supabase, level, session);
    }
    
    // Verificar permissões de acesso do usuário
    await verifyUserPermission(supabase, userId, isSimulatedMode);
    
    // Se chegou até aqui, o usuário tem permissões
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
