
import { User } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Updates an existing user in Supabase and returns the updated user object
 */
export const updateExistingUser = async (
  initialUser: User,
  formData: {
    name: string;
    email: string;
    role: string;
    accessLevel: string;
    active: boolean;
    localities: string[];
  },
  accessLevelIdNum: number
): Promise<User | null> => {
  if (!initialUser.supabaseId) {
    toast.error("ID de usuário inválido para atualização");
    return null;
  }
  
  try {
    // Parse the access level to make sure it's a valid UUID
    let accessLevelId: string | null = null;
    
    try {
      // Try to get the access level as UUID from the DB
      const { data: accessLevel, error: accessLevelError } = await supabase
        .from('access_levels')
        .select('id')
        .eq('id', accessLevelIdNum)
        .single();
      
      if (!accessLevelError && accessLevel) {
        accessLevelId = accessLevel.id;
      } else {
        console.warn('Access level not found by ID, using default:', accessLevelIdNum);
      }
    } catch (err) {
      console.error('Error fetching access level:', err);
    }
    
    // If we couldn't get a valid UUID, use the numerical ID
    if (!accessLevelId) {
      accessLevelId = accessLevelIdNum.toString();
    }
    
    console.log('Using access level ID for update:', accessLevelId);
    console.log('Initial user data:', initialUser);
    console.log('Form data:', formData);
    
    // Update the user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username: formData.name,
        role: formData.role,
        active: formData.active,
        access_level_id: accessLevelId
      })
      .eq('id', initialUser.supabaseId);
    
    if (profileError) {
      console.error('Erro ao atualizar perfil:', profileError);
      throw profileError;
    }
    
    // Update localities
    // First, get current localities
    const { data: currentAccess, error: accessError } = await supabase
      .from('locality_access')
      .select('locality_id')
      .eq('user_id', initialUser.supabaseId);
    
    if (accessError) {
      console.error('Erro ao buscar localidades atuais:', accessError);
    }
    
    const currentLocalityIds = currentAccess ? currentAccess.map(a => a.locality_id) : [];
    
    // Get all localities to map names to IDs
    const { data: allLocalities, error: allLocalitiesError } = await supabase
      .from('localities')
      .select('id, name');
    
    if (allLocalitiesError) {
      console.error('Erro ao buscar todas as localidades:', allLocalitiesError);
      throw allLocalitiesError;
    }
    
    // Create a map of locality names to IDs
    const localityMap = new Map();
    allLocalities?.forEach(loc => {
      localityMap.set(loc.name, loc.id);
    });
    
    // Get IDs of new localities
    const newLocalityIds = formData.localities
      .map(name => localityMap.get(name))
      .filter(id => id !== undefined);
    
    // Add new localities
    for (const localityId of newLocalityIds) {
      if (!currentLocalityIds.includes(localityId)) {
        const { error } = await supabase
          .from('locality_access')
          .insert({
            user_id: initialUser.supabaseId,
            locality_id: localityId
          });
        
        if (error && error.code !== '23505') { // Ignore unique violation errors
          console.error(`Erro ao adicionar localidade ${localityId}:`, error);
        }
      }
    }
    
    // Remove old localities
    for (const localityId of currentLocalityIds) {
      if (!newLocalityIds.includes(localityId)) {
        const { error } = await supabase
          .from('locality_access')
          .delete()
          .eq('user_id', initialUser.supabaseId)
          .eq('locality_id', localityId);
        
        if (error) {
          console.error(`Erro ao remover localidade ${localityId}:`, error);
        }
      }
    }
    
    // Return updated user
    return {
      ...initialUser,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      accessLevelId: accessLevelIdNum,
      active: formData.active,
      assignedLocalities: formData.localities
    };
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    toast.error(`Erro ao atualizar usuário: ${error.message}`);
    return null;
  }
};
