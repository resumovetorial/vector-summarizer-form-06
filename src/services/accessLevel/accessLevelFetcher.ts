
import { supabase } from '@/lib/supabase';
import { AccessLevel } from '@/types/admin';

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
