
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
    // Obter o UUID do nível de acesso do banco de dados
    let accessLevelUuid: string | null = null;
    
    try {
      // Primeira tentativa: buscar o nível de acesso pelo ID numérico
      const { data: accessLevel, error: accessLevelError } = await supabase
        .from('access_levels')
        .select('id')
        .eq('id', accessLevelIdNum)
        .single();
      
      if (!accessLevelError && accessLevel) {
        accessLevelUuid = accessLevel.id;
        console.log('Access level found by ID:', accessLevelUuid);
      } else {
        // Segunda tentativa: listar todos os níveis e procurar pelo ID numérico
        const { data: allLevels, error: allLevelsError } = await supabase
          .from('access_levels')
          .select('id, name')
          .order('created_at', { ascending: true });
        
        if (!allLevelsError && allLevels && allLevels.length > 0) {
          // Pegar o nível correspondente à posição do array (assumindo que os IDs são sequenciais)
          // ou o primeiro nível se não for possível encontrar
          const targetIndex = accessLevelIdNum - 1;
          const targetLevel = targetIndex >= 0 && targetIndex < allLevels.length 
            ? allLevels[targetIndex] 
            : allLevels[0];
          
          accessLevelUuid = targetLevel.id;
          console.log(`Using access level by position: ${targetLevel.name} (${accessLevelUuid})`);
        } else {
          console.warn('No access levels found, using null');
        }
      }
    } catch (err) {
      console.error('Error fetching access level:', err);
    }
    
    console.log('Using access level UUID for update:', accessLevelUuid);
    console.log('Initial user data:', initialUser);
    console.log('Form data:', formData);
    
    // Update the user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username: formData.name,
        role: formData.role,
        active: formData.active,
        access_level_id: accessLevelUuid  // Use o UUID, não o ID numérico
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
