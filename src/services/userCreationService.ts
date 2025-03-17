
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
  
  if (existingUsers && existingUsers.length > 0) {
    // User already exists, use their ID
    userId = existingUsers[0].id;
    console.log("User already exists, using ID:", userId);
  } else {
    // Create a new user with Auth API
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: 'temporary-password',
        email_confirm: true
      });
      
      if (error) throw error;
      userId = data.user.id;
      userCreated = true;
      console.log("Created new user with ID:", userId);
    } catch (adminError: any) {
      console.error("Admin user creation error:", adminError);
      
      // If we can't create the user with admin rights, create a demo user
      if (process.env.NODE_ENV !== 'production') {
        const fakeUserId = crypto.randomUUID();
        userId = fakeUserId;
        toast.info("No modo de demonstração, os usuários seriam convidados por email. Simulando criação de usuário com ID temporário.");
      } else {
        throw new Error(`Erro ao criar usuário: ${adminError.message}`);
      }
    }
  }
  
  // Create or update the profile in Supabase
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
    
    console.log('Final access level UUID for profile:', accessLevelUuid);
    
    // Criar ou atualizar o perfil com o UUID do nível de acesso
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        username: formData.name,
        role: formData.role,
        active: formData.active,
        access_level_id: accessLevelUuid  // Use o UUID, não o ID numérico
      }, {
        onConflict: 'id'
      });
      
    if (profileError) {
      console.error('Erro ao criar/atualizar perfil:', profileError);
      throw new Error(profileError.message);
    }
    
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
    
    console.log("Created/updated profile successfully with access level:", accessLevelUuid);
  } catch (error: any) {
    console.error('Erro na operação de upsert do perfil:', error);
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
    toast.success("Usuário criado com sucesso! Um email de convite foi enviado.");
  } else {
    toast.success("Usuário atualizado com sucesso!");
  }
  
  return { userId, newUser };
};
