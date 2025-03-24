
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
