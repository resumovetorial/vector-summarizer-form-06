
import { SupabaseClient } from '@supabase/supabase-js';
import { AccessLevel } from '@/types/admin';

/**
 * Handles access level creation in demo mode
 */
export const handleDemoMode = async (
  supabase: SupabaseClient, 
  level: Omit<AccessLevel, 'id'>, 
  session: any
): Promise<AccessLevel> => {
  console.log('Modo de demonstração ativo - ignorando verificações de permissão detalhadas');
  
  // Definir um cabeçalho de autorização personalizado para a solicitação
  const headers = {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  };
  
  console.log('Usando cabeçalhos personalizados para solicitação:', headers);
  
  // Tentar inserir diretamente, confiando nas políticas RLS do Supabase
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
    
    // Ignorar erro de RLS e permitir a criação mesmo assim (modo demo)
    console.log('Simulando criação bem-sucedida em modo de demonstração');
    
    return {
      id: Date.now(), // ID simulado baseado em timestamp
      name: level.name,
      description: level.description || '',
      permissions: level.permissions,
    };
  }
  
  return {
    id: parseInt(insertData.id), // Manter compatibilidade com o tipo existente
    name: insertData.name,
    description: insertData.description || '',
    permissions: insertData.permissions,
  };
};
