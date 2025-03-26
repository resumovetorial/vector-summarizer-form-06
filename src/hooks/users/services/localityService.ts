
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
    
    console.log("Dados de atribuições de localidade recebidos:", data);
    
    if (data && data.length > 0) {
      // Agrupar localidades por ID de usuário
      data.forEach(access => {
        if (access.user_id) {
          // Se o user_id existe
          if (!localityMap.has(access.user_id)) {
            localityMap.set(access.user_id, []);
          }
          
          // Extrair o nome da localidade com segurança, considerando vários formatos possíveis
          if (access.localities) {
            let localityName: string | undefined;
            
            if (typeof access.localities === 'object' && access.localities !== null) {
              // Formato de objeto com propriedade name
              if ('name' in access.localities && typeof access.localities.name === 'string') {
                localityName = access.localities.name;
              }
            } else if (typeof access.localities === 'string') {
              // Se for diretamente uma string
              localityName = access.localities;
            }
            
            if (localityName) {
              localityMap.get(access.user_id)?.push(localityName);
            }
          }
        }
      });
    }
    
    console.log("Mapa de localidades por usuário:", Object.fromEntries(localityMap));
    return localityMap;
  } catch (error) {
    console.error("Erro ao buscar localidades dos usuários:", error);
    return localityMap;
  }
};
