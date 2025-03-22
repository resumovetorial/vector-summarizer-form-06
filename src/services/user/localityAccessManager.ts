
import { supabase } from '@/integrations/supabase/client';

/**
 * Assigns localities to a user
 */
export const assignLocalityAccess = async (userId: string, localities: string[]): Promise<void> => {
  console.log("Atribuindo localidades:", localities);
  
  for (const localityName of localities) {
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
        
        // Tentar inserção direta
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
};
