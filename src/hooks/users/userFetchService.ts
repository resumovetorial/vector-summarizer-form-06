
import { User, AccessLevel } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Busca todos os usuários com seus níveis de acesso
 */
export const fetchUsers = async (
  accessLevels: AccessLevel[]
): Promise<User[]> => {
  try {
    // Buscar perfis do Supabase
    const profiles = await fetchProfiles();
    
    if (!profiles || profiles.length === 0) {
      console.log("Nenhum perfil encontrado, mostrando lista vazia");
      return [];
    }

    // Obter mapa de emails dos usuários
    const emailMap = await fetchUserEmails();
    
    // Buscar localidades atribuídas a cada perfil
    const localityMap = await fetchUserLocalities();
    
    // Converter perfis do Supabase para o formato User
    const users = convertProfilesToUsers(profiles, accessLevels, emailMap, localityMap);
    
    return users;
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    toast.error("Erro ao carregar usuários. Continuando em modo de demonstração.");
    return [];
  }
};

/**
 * Busca os perfis de usuário do Supabase
 */
const fetchProfiles = async () => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, username, role, active, access_level_id');
  
  if (error) {
    throw error;
  }

  console.log("Dados brutos dos perfis:", profiles);
  return profiles;
};

/**
 * Busca os emails dos usuários através da API de autenticação do Supabase
 */
const fetchUserEmails = async (): Promise<Record<string, string>> => {
  const emailMap: Record<string, string> = {};
  
  try {
    // Tentar obter usuários via API de admin
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (!authError && authUsers?.users) {
      console.log("Dados dos usuários de autenticação:", authUsers.users);
      authUsers.users.forEach((user: any) => {
        if (user.id && user.email) {
          emailMap[user.id] = user.email;
        }
      });
    } else {
      console.log("Não foi possível obter usuários de autenticação (esperado para acesso não-admin):", authError);
      
      // Tentar obter emails através da tabela auth.users como fallback
      await fetchUserEmailsFromTable(emailMap);
    }
  } catch (authError) {
    console.log("Erro ao buscar usuários de autenticação (esperado para acesso não-admin):", authError);
    await fetchUserEmailsFromTable(emailMap);
  }
  
  return emailMap;
};

/**
 * Tenta buscar emails diretamente da tabela auth.users (fallback)
 */
const fetchUserEmailsFromTable = async (emailMap: Record<string, string>) => {
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
};

/**
 * Converte os perfis do Supabase para o formato User
 */
const convertProfilesToUsers = (
  profiles: any[],
  accessLevels: AccessLevel[],
  emailMap: Record<string, string>,
  localityMap: Map<string, string[]>
): User[] => {
  const users: User[] = profiles.map((profile, index) => {
    // Encontrar o nível de acesso correspondente
    let accessLevelUuid = profile.access_level_id;
    let accessLevelId = 1; // Default para o primeiro nível
    
    if (accessLevelUuid) {
      const matchingLevel = accessLevels.find(level => level.id === accessLevelUuid);
      if (matchingLevel) {
        accessLevelId = matchingLevel.id;
      }
    }
    
    // Obter email do mapa ou usar nome de usuário
    const email = emailMap[profile.id] || profile.username || `usuario${index + 1}@exemplo.com`;
    
    // Obter localidades atribuídas
    const assignedLocalities = localityMap.get(profile.id) || [];
    console.log(`Localidades para usuário ${profile.id}:`, assignedLocalities);
    
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
  
  console.log("Usuários convertidos:", users);
  return users;
};

/**
 * Busca todas as localidades atribuídas a todos os usuários
 */
export const fetchUserLocalities = async (): Promise<Map<string, string[]>> => {
  const localityMap = new Map<string, string[]>();
  
  try {
    // Primeiro obter todas as localidades para construir um mapa de IDs para nomes
    const localityIdToName = await buildLocalityNameMap();
    
    if (localityIdToName.size === 0) {
      return localityMap;
    }
    
    // Agora obter as entradas de acesso às localidades
    const localityAccess = await fetchLocalityAccessEntries();
    
    if (!localityAccess || localityAccess.length === 0) {
      console.log("Nenhum acesso a localidades encontrado");
      return localityMap;
    }
    
    // Agrupar localidades por ID de usuário
    groupLocalitiesByUser(localityAccess, localityMap, localityIdToName);
  } catch (localityError) {
    console.error("Erro ao buscar acessos às localidades:", localityError);
  }
  
  return localityMap;
};

/**
 * Constrói um mapa de IDs de localidades para seus nomes
 */
const buildLocalityNameMap = async (): Promise<Map<string, string>> => {
  const localityIdToName = new Map<string, string>();
  
  const { data: allLocalities, error: allLocalitiesError } = await supabase
    .from('localities')
    .select('id, name');
    
  if (allLocalitiesError) {
    console.error('Erro ao buscar todas as localidades:', allLocalitiesError);
    toast.error("Erro ao buscar localidades. Algumas localidades podem não ser atribuídas.");
    return localityIdToName;
  }
  
  if (!allLocalities || allLocalities.length === 0) {
    console.error('Nenhuma localidade encontrada no banco de dados');
    toast.error("Nenhuma localidade encontrada no sistema.");
    return localityIdToName;
  }
  
  allLocalities.forEach(loc => {
    localityIdToName.set(loc.id, loc.name);
  });
  
  console.log("Mapa de IDs para nomes de localidades:", Object.fromEntries(localityIdToName));
  return localityIdToName;
};

/**
 * Busca as entradas de acesso às localidades
 */
const fetchLocalityAccessEntries = async () => {
  const { data: localityAccess, error: localityError } = await supabase
    .from('locality_access')
    .select('user_id, locality_id');
    
  if (localityError) {
    console.error("Erro ao buscar acessos às localidades:", localityError);
    return [];
  }
  
  console.log("Dados brutos de acesso às localidades:", localityAccess);
  return localityAccess || [];
};

/**
 * Agrupa localidades por ID de usuário
 */
const groupLocalitiesByUser = (
  localityAccess: any[],
  localityMap: Map<string, string[]>,
  localityIdToName: Map<string, string>
) => {
  localityAccess.forEach((access: any) => {
    if (access.user_id && access.locality_id) {
      if (!localityMap.has(access.user_id)) {
        localityMap.set(access.user_id, []);
      }
      
      const localityName = localityIdToName.get(access.locality_id);
      if (localityName) {
        localityMap.get(access.user_id)?.push(localityName);
      }
    }
  });
  
  console.log("Mapa de localidades por usuário:", Object.fromEntries(
    Array.from(localityMap.entries()).map(([key, value]) => [key, value])
  ));
};
