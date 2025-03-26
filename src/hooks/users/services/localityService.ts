
import { supabase } from '@/lib/supabase';

/**
 * Busca as localidades atribuídas a todos os usuários
 * @returns Um mapa de ID de usuário para um array de nomes de localidades
 */
export const fetchUserLocalities = async (): Promise<Map<string, string[]>> => {
  const localityMap = new Map<string, string[]>();
  
  try {
    // Buscar todas as atribuições de localidade e seus nomes
    const { data, error } = await supabase
      .from('locality_access')
      .select(`
        user_id,
        localities:locality_id(name)
      `);
    
    if (error) {
      console.error("Erro ao buscar atribuições de localidade:", error);
      return localityMap;
    }
    
    if (data && data.length > 0) {
      // Agrupar localidades por ID de usuário
      data.forEach(access => {
        if (access.user_id && access.localities?.name) {
          if (!localityMap.has(access.user_id)) {
            localityMap.set(access.user_id, []);
          }
          localityMap.get(access.user_id)?.push(access.localities.name);
        }
      });
    }
    
    return localityMap;
  } catch (error) {
    console.error("Erro ao buscar localidades dos usuários:", error);
    return localityMap;
  }
};
