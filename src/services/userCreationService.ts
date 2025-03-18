
import { User } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Creates a new user in Supabase and returns the user object
 */
export const createNewUser = async (
  formData: {
    name: string;
    email: string;
    role: string;
    accessLevel: string;
    active: boolean;
    localities: string[];
  },
  accessLevelIdNum: number,
  users: User[]
): Promise<{ userId: string; newUser: User }> => {
  // First check if user with this email already exists
  const { data: existingUsers, error: searchError } = await supabase
    .from('profiles')
    .select('id, username')
    .ilike('username', formData.email)
    .limit(1);
    
  if (searchError) {
    console.error('Erro ao verificar existência do usuário:', searchError);
    toast.error(`Erro ao verificar usuário: ${searchError.message}`);
    throw new Error(searchError.message);
  }

  let userId: string;
  let userCreated = false;
  
  // Sempre usar modo de demonstração para desenvolvimento
  if (true) {
    const fakeUserId = crypto.randomUUID();
    userId = fakeUserId;
    userCreated = true;
    console.log("Usando modo de demonstração com UUID temporário:", userId);
    toast.info("No modo de demonstração, os usuários seriam convidados por email. Simulando criação de usuário com ID temporário.");
  }
  
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
  
  console.log('Final access level UUID for profile:', accessLevelUuid);
  
  try {
    // Usar RPC (função de banco de dados) em vez de inserção direta para evitar problemas de RLS
    const { data: profileData, error: profileError } = await supabase.rpc('create_or_update_profile', {
      p_id: userId,
      p_username: formData.name,
      p_role: formData.role,
      p_active: formData.active,
      p_access_level_id: accessLevelUuid
    });
    
    if (profileError) {
      console.error('Erro ao criar/atualizar perfil:', profileError);
      throw new Error(profileError.message);
    }
    
    console.log("Perfil criado/atualizado com sucesso:", profileData);
    
    // If user has localities, assign them
    if (formData.localities && formData.localities.length > 0) {
      for (const localityName of formData.localities) {
        try {
          // Get locality ID
          const { data: locality, error: localityError } = await supabase
            .from('localities')
            .select('id')
            .eq('name', localityName)
            .maybeSingle();
            
          if (localityError) {
            console.error(`Erro ao buscar localidade ${localityName}:`, localityError);
            continue;
          }
          
          if (locality) {
            // Create locality access
            const { error: accessError } = await supabase
              .from('locality_access')
              .insert({
                user_id: userId,
                locality_id: locality.id
              });
              
            if (accessError) {
              console.error(`Erro ao atribuir localidade ${localityName}:`, accessError);
            }
          }
        } catch (err) {
          console.error(`Erro ao processar localidade ${localityName}:`, err);
        }
      }
    }
  } catch (error: any) {
    console.error('Erro na operação de criação do perfil:', error);
    toast.error(`Erro na criação do perfil: ${error.message}`);
    throw error;
  }
  
  // Create new user object for client-side state
  const newUser: User = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    supabaseId: userId,
    name: formData.name,
    email: formData.email,
    role: formData.role,
    accessLevelId: accessLevelIdNum,
    active: formData.active,
    assignedLocalities: formData.localities
  };
  
  if (userCreated) {
    toast.success("Usuário criado com sucesso! Um email de convite seria enviado em produção.");
  } else {
    toast.success("Usuário atualizado com sucesso!");
  }
  
  return { userId, newUser };
};
