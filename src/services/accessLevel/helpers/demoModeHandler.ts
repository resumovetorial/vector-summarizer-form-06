
import { SupabaseClient } from '@supabase/supabase-js';
import { AccessLevel } from '@/types/admin';

/**
 * Gerencia a criação de níveis de acesso em modo de demonstração
 */
export const handleDemoMode = async (
  supabase: SupabaseClient, 
  level: Omit<AccessLevel, 'id'>,
  session: any
): Promise<AccessLevel> => {
  try {
    // Tentar inserir no Supabase primeiro
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
      console.log('Erro ao criar no banco (esperado em modo de demo):', error);
      console.log('Continuando em modo de demonstração com dados locais');
      
      // Em modo de demonstração, retornar um objeto simulado se a inserção falhar
      return {
        id: Math.floor(Math.random() * 1000) + 100, // ID aleatório para simulação
        name: level.name,
        description: level.description,
        permissions: level.permissions,
      };
    }
    
    console.log('Nível de acesso criado com sucesso no Supabase:', insertData);
    
    // Se a inserção for bem-sucedida, retornar os dados do banco
    return {
      id: parseInt(insertData.id), // Compatibilidade com tipo existente
      name: insertData.name,
      description: insertData.description || '',
      permissions: insertData.permissions,
    };
  } catch (dbError) {
    console.error('Erro na tentativa de inserção:', dbError);
    
    // Fallback para modo de demonstração completo
    return {
      id: Math.floor(Math.random() * 1000) + 100, // ID aleatório para simulação
      name: level.name,
      description: level.description,
      permissions: level.permissions,
    };
  }
};
