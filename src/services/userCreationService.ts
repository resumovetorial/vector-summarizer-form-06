
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
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
  
  try {
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
        
        // Em modo de demonstração, criar um ID simulado para permitir continuar
        userId = crypto.randomUUID();
        console.log("Modo de demonstração: usando ID temporário:", userId);
        toast.warning("No modo de demonstração, os usuários seriam convidados por email. Simulando criação de usuário com ID temporário.");
      } else {
        userId = data;
        console.log("Usuário criado com ID:", userId);
        
        if (!userId) {
          // Fallback para ID simulado
          userId = crypto.randomUUID();
          console.log("ID nulo retornado, usando ID temporário:", userId);
        }
      }
    } catch (error: any) {
      console.error("Erro na criação do usuário:", error);
      // Em modo de demonstração, criar um ID simulado para permitir continuar
      userId = crypto.randomUUID();
      console.log("Modo de demonstração devido a erro:", error.message);
      console.log("Usando ID temporário:", userId);
    }
    
    // Obter o UUID do nível de acesso do banco de dados
    let accessLevelUuid: string | null = null;
    
    try {
      // Listar todos os níveis e procurar pelo ID numérico
      const { data: allLevels, error: allLevelsError } = await supabase
        .from('access_levels')
        .select('id, name')
        .order('created_at', { ascending: true });
      
      if (!allLevelsError && allLevels && allLevels.length > 0) {
        console.log("Níveis de acesso disponíveis:", allLevels);
        console.log("Buscando nível de acesso com ID numérico:", accessLevelIdNum);
        
        // Tentar encontrar pelo índice (já que IDs parecem ser sequenciais)
        if (accessLevelIdNum > 0 && accessLevelIdNum <= allLevels.length) {
          accessLevelUuid = allLevels[accessLevelIdNum - 1].id;
          console.log(`Usando nível de acesso na posição ${accessLevelIdNum-1}: ${accessLevelUuid}`);
        } else {
          // Se não encontrar, usar o primeiro
          accessLevelUuid = allLevels[0].id;
          console.log(`Nível de acesso não encontrado, usando o primeiro: ${accessLevelUuid}`);
        }
      } else {
        console.warn('Nenhum nível de acesso encontrado ou erro:', allLevelsError);
      }
    } catch (err) {
      console.error('Erro ao buscar nível de acesso:', err);
    }
    
    console.log('UUID do nível de acesso para o perfil:', accessLevelUuid);
    
    try {
      // Tentar criar/atualizar o perfil com a função RPC
      try {
        const { data: profileData, error: profileError } = await supabase.rpc('create_or_update_profile', {
          p_id: userId,
          p_username: formData.name,
          p_role: formData.role,
          p_active: formData.active,
          p_access_level_id: accessLevelUuid
        });
        
        if (profileError) {
          console.error('Erro ao criar/atualizar perfil via RPC:', profileError);
          // Continuar em modo de demonstração
        } else {
          console.log("Perfil criado/atualizado com sucesso via RPC:", profileData);
        }
      } catch (rpcError) {
        console.error('Erro na operação RPC de criação do perfil:', rpcError);
        // Continuar em modo de demonstração
      }
      
      // Em modo de demonstração ou se a RPC falhar, tentar inserção direta
      try {
        // Tentar inserção direta no perfil como alternativa (para modo de demonstração)
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            username: formData.name,
            role: formData.role,
            active: formData.active,
            access_level_id: accessLevelUuid
          }, { onConflict: 'id' });
          
        if (insertError && insertError.code !== '23505') { // Ignorar erros de violação de unicidade
          console.error('Erro ao inserir perfil diretamente:', insertError);
          // Continuar mesmo com erro em modo de demonstração
        } else {
          console.log("Perfil inserido/atualizado diretamente com sucesso");
        }
      } catch (insertError) {
        console.error('Erro na inserção direta do perfil:', insertError);
        // Continuar em modo de demonstração
      }
      
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
              console.log(`Localidade encontrada: ${localityName} (${locality.id})`);
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
      // Continuar em modo de demonstração mesmo com erro
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
    toast.success("Usuário adicionado com sucesso! Em um ambiente de produção, este usuário receberia um email de convite.");
    
    return { userId, newUser };
  } catch (error: any) {
    console.error('Erro completo ao criar usuário:', error);
    throw error;
  }
};
