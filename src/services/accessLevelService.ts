
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
    id: parseInt(level.id), // Keeping compatibility with existing type that uses number
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
    id: parseInt(data.id), // Keeping compatibility with existing type
    name: data.name,
    description: data.description || '',
    permissions: data.permissions,
  };
};

export const updateAccessLevel = async (level: AccessLevel): Promise<AccessLevel> => {
  // In Supabase, ID is a UUID, so we need to find the correct UUID
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
    id: level.id, // Keep original ID for interface consistency
    name: data.name,
    description: data.description || '',
    permissions: data.permissions,
  };
};

export const deleteAccessLevel = async (levelName: string): Promise<void> => {
  // First, check if it's the "Agente" level, which should be removed
  if (levelName.toLowerCase() === 'agente') {
    // We'll allow this to be deleted as specified in the requirements
    console.log('Removing "Agente" access level as requested');
  }
  
  // Find the UUID of the access level by name
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
