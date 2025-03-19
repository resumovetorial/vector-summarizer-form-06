
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
  console.log("Iniciando criação de usuário com dados:", formData);
  
  // First check if user with this email already exists
  const { data: existingUsers, error: searchError } = await supabase
    .from('profiles')
    .select('id, username')
    .ilike('username', formData.email)
    .limit(1);
    
  if (searchError) {
    console.error('Erro ao verificar existência do usuário:', searchError);
    throw new Error(`Erro ao verificar usuário: ${searchError.message}`);
  }

  if (existingUsers && existingUsers.length > 0) {
    console.error(`Usuário com email ${formData.email} já existe`);
    throw new Error(`Usuário com email ${formData.email} já existe`);
  }

  let userId: string;
  
  try {
    // Create a real auth user via the RPC function
    const { data, error } = await supabase.rpc('create_demo_user', {
      user_email: formData.email,
      user_password: 'password123', // Demo password, would be random in production
      user_data: { name: formData.name }
    });
    
    if (error) {
      console.error("Não foi possível criar usuário via RPC:", error);
      throw new Error(`Erro ao criar usuário de demonstração: ${error.message}`);
    } 
    
    userId = data;
    console.log("Usuário criado com ID:", userId);
    
    if (!userId) {
      throw new Error("Não foi possível obter o ID do usuário criado");
    }
  } catch (error: any) {
    console.error("Erro na criação do usuário:", error);
    throw error;
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
      console.log('Nível de acesso encontrado pelo ID:', accessLevelUuid);
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
        console.log(`Usando nível de acesso por posição: ${targetLevel.name} (${accessLevelUuid})`);
      } else {
        console.warn('Nenhum nível de acesso encontrado, usando null');
      }
    }
  } catch (err) {
    console.error('Erro ao buscar nível de acesso:', err);
  }
  
  console.log('UUID do nível de acesso para o perfil:', accessLevelUuid);
  
  try {
    // Criar/atualizar o perfil com a função RPC
    const { data: profileData, error: profileError } = await supabase.rpc('create_or_update_profile', {
      p_id: userId,
      p_username: formData.name,
      p_role: formData.role,
      p_active: formData.active,
      p_access_level_id: accessLevelUuid
    });
    
    if (profileError) {
      console.error('Erro ao criar/atualizar perfil:', profileError);
      throw new Error(`Erro ao criar perfil: ${profileError.message}`);
    }
    
    console.log("Perfil criado/atualizado com sucesso:", profileData);
    
    // Se o usuário tem localidades, atribuí-las
    if (formData.localities && formData.localities.length > 0) {
      console.log("Atribuindo localidades:", formData.localities);
      
      for (const localityName of formData.localities) {
        try {
          // Obter ID da localidade
          const { data: locality, error: localityError } = await supabase
            .from('localities')
            .select('id')
            .eq('name', localityName)
            .single();
            
          if (localityError) {
            console.error(`Erro ao buscar localidade ${localityName}:`, localityError);
            continue;
          }
          
          if (locality) {
            // Criar acesso à localidade
            const { error: accessError } = await supabase
              .from('locality_access')
              .insert({
                user_id: userId,
                locality_id: locality.id
              });
              
            if (accessError && accessError.code !== '23505') { // Ignorar erros de violação de unicidade
              console.error(`Erro ao atribuir localidade ${localityName}:`, accessError);
            } else {
              console.log(`Localidade ${localityName} atribuída ao usuário ${userId}`);
            }
          } else {
            console.error(`Localidade ${localityName} não encontrada`);
          }
        } catch (err) {
          console.error(`Erro ao processar localidade ${localityName}:`, err);
        }
      }
    }
  } catch (error: any) {
    console.error('Erro na operação de criação do perfil:', error);
    throw error;
  }
  
  // Criar objeto de usuário para o estado do cliente
  const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser: User = {
    id: newUserId,
    supabaseId: userId,
    name: formData.name,
    email: formData.email,
    role: formData.role,
    accessLevelId: accessLevelIdNum,
    active: formData.active,
    assignedLocalities: formData.localities
  };
  
  console.log("Usuário criado com sucesso:", newUser);
  
  return { userId, newUser };
};
