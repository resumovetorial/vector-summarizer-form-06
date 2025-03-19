
import { User, AccessLevel } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const fetchUsers = async (
  accessLevels: AccessLevel[]
): Promise<User[]> => {
  try {
    // Fetch real users from Supabase with their access levels
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username, role, active, access_level_id');
    
    if (error) {
      throw error;
    }

    console.log("Dados brutos dos perfis:", profiles);

    if (!profiles || profiles.length === 0) {
      console.log("Nenhum perfil encontrado, mostrando lista vazia");
      return [];
    }

    // Get auth users to combine with profiles if possible
    const emailMap: Record<string, string> = {};
    
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (!authError && authUsers?.users) {
        console.log("Dados dos usuários de autenticação:", authUsers.users);
        // Create a mapping of user IDs to emails
        authUsers.users.forEach((user: any) => {
          if (user.id && user.email) {
            emailMap[user.id] = user.email;
          }
        });
      } else {
        console.log("Não foi possível obter usuários de autenticação (esperado para acesso não-admin):", authError);
        
        // Tentar obter emails através da tabela de auth.users diretamente
        try {
          const { data: authData, error: authQueryError } = await supabase
            .from('auth.users')
            .select('id, email');
            
          if (!authQueryError && authData) {
            authData.forEach((user: any) => {
              if (user.id && user.email) {
                emailMap[user.id] = user.email;
              }
            });
          }
        } catch (e) {
          console.log("Erro ao acessar auth.users diretamente:", e);
        }
      }
    } catch (authError) {
      console.log("Erro ao buscar usuários de autenticação (esperado para acesso não-admin):", authError);
    }

    // Fetch assigned localities for each profile
    const localityMap = await fetchUserLocalities();
    
    // Convert Supabase profiles to User format
    const realUsers: User[] = profiles.map((profile, index) => {
      // Find the numeric ID for the access level
      let accessLevelUuid = profile.access_level_id;
      let accessLevelId = 1; // Default to first level
      
      if (accessLevelUuid) {
        // Find the matching access level by UUID
        const matchingLevel = accessLevels.find(level => level.id === accessLevelUuid);
        if (matchingLevel) {
          accessLevelId = matchingLevel.id;
        }
      }
      
      // Get email from auth users if available, or use username
      const email = emailMap[profile.id] || profile.username || `usuario${index + 1}@exemplo.com`;
      
      // Get assigned localities
      const assignedLocalities = localityMap.get(profile.id) || [];
      
      return {
        id: index + 1,
        supabaseId: profile.id,
        name: profile.username || email.split('@')[0] || `Usuário ${index + 1}`,
        email: email,
        role: profile.role || 'Usuário',
        accessLevelId: accessLevelId,
        active: profile.active ?? true,
        assignedLocalities: assignedLocalities
      };
    });
    
    console.log("Usuários convertidos:", realUsers);
    return realUsers;
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    toast.error("Erro ao carregar usuários. Continuando em modo de demonstração.");
    return [];
  }
};

export const fetchUserLocalities = async (): Promise<Map<string, string[]>> => {
  const localityMap = new Map<string, string[]>();
  
  try {
    const { data: localityAccess, error: localityError } = await supabase
      .from('locality_access')
      .select('user_id, localities(name)');
      
    if (!localityError && localityAccess) {
      console.log("Dados de acesso às localidades:", localityAccess);
      
      // Group localities by user ID
      localityAccess.forEach((access: any) => {
        if (access.user_id && access.localities?.name) {
          if (!localityMap.has(access.user_id)) {
            localityMap.set(access.user_id, []);
          }
          localityMap.get(access.user_id)?.push(access.localities.name);
        }
      });
    }
  } catch (localityError) {
    console.error("Erro ao buscar acessos às localidades:", localityError);
  }
  
  return localityMap;
};
