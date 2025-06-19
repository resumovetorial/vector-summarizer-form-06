
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
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
  accessLevelId: string // Mudança: agora recebe string UUID em vez de number
): Promise<User | null> => {
  if (!initialUser.supabaseId) {
    toast.error("ID de usuário inválido para atualização");
    return null;
  }
  
  try {
    // Obter o UUID do nível de acesso do banco de dados
    let accessLevelUuid: string | null = null;
    
    try {
      // Buscar o nível de acesso pelo nome ou ID
      const { data: accessLevel, error: accessLevelError } = await supabase
        .from('access_levels')
        .select('id')
        .or(`id.eq.${accessLevelId},name.eq.${formData.accessLevel}`)
        .single();
      
      if (!accessLevelError && accessLevel) {
        accessLevelUuid = accessLevel.id;
        console.log('Access level found:', accessLevelUuid);
      } else {
        // Fallback: buscar todos os níveis e pegar o primeiro
        const { data: allLevels, error: allLevelsError } = await supabase
          .from('access_levels')
          .select('id, name')
          .order('created_at', { ascending: true });
        
        if (!allLevelsError && allLevels && allLevels.length > 0) {
          accessLevelUuid = allLevels[0].id;
          console.log(`Using first available access level: ${accessLevelUuid}`);
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
    
    // Usar RPC (função de banco de dados) em vez de atualização direta para evitar problemas de RLS
    const { data: profileData, error: profileError } = await supabase.rpc('create_or_update_profile', {
      p_id: initialUser.supabaseId,
      p_username: formData.name,
      p_role: formData.role,
      p_active: formData.active,
      p_access_level_id: accessLevelUuid
    });
    
    if (profileError) {
      console.error('Erro ao atualizar perfil:', profileError);
      throw profileError;
    }
    
    console.log("Perfil atualizado com sucesso:", profileData);
    
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
    
    // Return updated user - convertendo accessLevel de volta para number para compatibilidade
    const accessLevelIdNumber = parseInt(accessLevelId) || 1;
    
    return {
      ...initialUser,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      accessLevelId: accessLevelIdNumber,
      active: formData.active,
      assignedLocalities: formData.localities
    };
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    toast.error(`Erro ao atualizar usuário: ${error.message}`);
    return null;
  }
};
