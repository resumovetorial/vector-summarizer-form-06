
import { supabase } from '@/lib/supabase';
import { AccessLevel } from '@/types/admin';

export const fetchAccessLevels = async (): Promise<AccessLevel[]> => {
  const { data, error } = await supabase
    .from('access_levels')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching access levels:', error);
    throw error;
  }
  
  // Convert the data to match our AccessLevel type
  return data.map(level => ({
    id: parseInt(level.id), // Mantendo compatibilidade com o tipo existente que usa number
    name: level.name,
    description: level.description || '',
    permissions: level.permissions,
  }));
};

export const createAccessLevel = async (level: Omit<AccessLevel, 'id'>): Promise<AccessLevel> => {
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
    console.error('Error creating access level:', error);
    throw error;
  }
  
  return {
    id: parseInt(data.id), // Mantendo compatibilidade com o tipo existente
    name: data.name,
    description: data.description || '',
    permissions: data.permissions,
  };
};

export const updateAccessLevel = async (level: AccessLevel): Promise<AccessLevel> => {
  // No Supabase, o ID é um UUID, então precisamos buscar o UUID correto
  const { data: existingLevels, error: fetchError } = await supabase
    .from('access_levels')
    .select('id')
    .eq('name', level.name)
    .limit(1);
  
  if (fetchError || !existingLevels || existingLevels.length === 0) {
    console.error('Error finding access level:', fetchError);
    throw fetchError || new Error('Access level not found');
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
    console.error('Error updating access level:', error);
    throw error;
  }
  
  return {
    id: level.id, // Mantemos o ID original para manter consistência na interface
    name: data.name,
    description: data.description || '',
    permissions: data.permissions,
  };
};

export const deleteAccessLevel = async (levelName: string): Promise<void> => {
  // Encontrar o UUID do nível de acesso pelo nome
  const { data: existingLevels, error: fetchError } = await supabase
    .from('access_levels')
    .select('id')
    .eq('name', levelName)
    .limit(1);
  
  if (fetchError || !existingLevels || existingLevels.length === 0) {
    console.error('Error finding access level:', fetchError);
    throw fetchError || new Error('Access level not found');
  }
  
  const supabaseId = existingLevels[0].id;
  
  const { error } = await supabase
    .from('access_levels')
    .delete()
    .eq('id', supabaseId);
  
  if (error) {
    console.error('Error deleting access level:', error);
    throw error;
  }
};
