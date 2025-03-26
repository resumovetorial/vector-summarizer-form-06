
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
        if (access.user_id && access.localities) {
          // access.localities pode ser um objeto ou um array dependendo do retorno do Supabase
          let localityName: string | undefined;
          
          // Verificar o tipo de dados retornado e extrair o nome da localidade
          if (typeof access.localities === 'object' && access.localities !== null) {
            if ('name' in access.localities && typeof access.localities.name === 'string') {
              // Se for um único objeto com propriedade 'name'
              localityName = access.localities.name;
            }
          }
          
          if (localityName) {
            if (!localityMap.has(access.user_id)) {
              localityMap.set(access.user_id, []);
            }
            localityMap.get(access.user_id)?.push(localityName);
          }
        }
      });
    }
    
    return localityMap;
  } catch (error) {
    console.error("Erro ao buscar localidades dos usuários:", error);
    return localityMap;
  }
};
