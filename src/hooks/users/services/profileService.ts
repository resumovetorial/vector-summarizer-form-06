
import { supabase } from '@/lib/supabase';
import { User, AccessLevel } from '@/types/admin';
import { toast } from 'sonner';

/**
 * Busca os perfis de usuário do Supabase
 */
export const fetchProfiles = async () => {
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
 * Converte os perfis do Supabase para o formato User
 */
export const convertProfilesToUsers = (
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
