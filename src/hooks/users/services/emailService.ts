
import { supabase } from '@/integrations/supabase/client';

/**
 * Busca os emails dos usuários através dos perfis disponíveis
 * Como não podemos acessar auth.users diretamente, usamos apenas dados dos perfis
 */
export const fetchUserEmails = async (): Promise<Record<string, string>> => {
  const emailMap: Record<string, string> = {};
  
  try {
    console.log("Buscando emails através dos perfis disponíveis");
    
    // Buscar perfis que tenham username (que geralmente é o email)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username')
      .not('username', 'is', null);
    
    if (error) {
      console.log("Erro ao buscar perfis para emails:", error);
      return emailMap;
    }
    
    if (profiles && profiles.length > 0) {
      console.log(`Encontrados ${profiles.length} perfis com username`);
      profiles.forEach((profile: any) => {
        if (profile.id && profile.username) {
          // Assumindo que username é o email ou pode ser usado como tal
          emailMap[profile.id] = profile.username;
        }
      });
    } else {
      console.log("Nenhum perfil com username encontrado");
    }
  } catch (error) {
    console.log("Erro ao buscar emails dos usuários:", error);
  }
  
  console.log("Mapa de emails obtido:", emailMap);
  return emailMap;
};
