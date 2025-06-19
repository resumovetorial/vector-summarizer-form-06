
import { supabase } from '@/integrations/supabase/client';
import { AccessLevel } from '@/types/admin';

export const createAccessLevel = async (level: Omit<AccessLevel, 'id'>): Promise<AccessLevel> => {
  try {
    console.log('Iniciando criação de nível de acesso com dados:', level);
    
    // Verificar se o usuário está autenticado
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError);
      throw new Error('Erro ao verificar autenticação');
    }
    
    if (!session.session) {
      console.error('Usuário não autenticado - sessão não encontrada');
      throw new Error('Você precisa estar autenticado para adicionar níveis de acesso');
    }
    
    // Inserir o novo nível de acesso
    const { data, error } = await supabase
      .from('access_levels')
      .insert({
        name: level.name,
        description: level.description,
        permissions: level.permissions,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar nível de acesso:', error);
      throw new Error(`Erro ao criar nível de acesso: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('Nível de acesso não foi criado por razões desconhecidas');
    }
    
    console.log('Nível de acesso criado com sucesso:', data);
    
    // Retornar o nível de acesso criado
    return {
      id: parseInt(data.id), // Convertendo UUID para number para compatibilidade com o tipo existente
      name: data.name,
      description: data.description || '',
      permissions: data.permissions,
    };
  } catch (error: any) {
    console.error('Falha ao criar nível de acesso:', error);
    throw error;
  }
};
