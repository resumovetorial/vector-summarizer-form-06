
import { supabase } from '@/lib/supabase';
import { AccessLevel } from '@/types/admin';

export const fetchAccessLevels = async (): Promise<AccessLevel[]> => {
  // Attempt to fetch from Supabase
  try {
    console.log('Iniciando busca de níveis de acesso do Supabase');
    
    const { data, error } = await supabase
      .from('access_levels')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar níveis de acesso:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('Nenhum nível de acesso encontrado no Supabase, usando fallback');
      return getDefaultAccessLevels();
    }
    
    // Log the access levels we've fetched
    console.log('Níveis de acesso encontrados no Supabase:', data);
    
    // Convert the data to match our AccessLevel type
    return data.map(level => ({
      id: typeof level.id === 'string' ? parseInt(level.id) : level.id, // Keeping compatibility with existing type
      name: level.name,
      description: level.description || '',
      permissions: level.permissions || [],
    }));
  } catch (error) {
    console.error('Erro ao buscar níveis de acesso do Supabase, usando fallback:', error);
    
    // Return default levels if Supabase query fails
    return getDefaultAccessLevels();
  }
};

// Função para obter os níveis de acesso padrão
function getDefaultAccessLevels(): AccessLevel[] {
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
