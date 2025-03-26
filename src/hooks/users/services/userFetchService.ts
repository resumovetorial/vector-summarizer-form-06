
import { User, AccessLevel } from '@/types/admin';
import { toast } from 'sonner';
import { fetchUserEmails } from './emailService';
import { fetchUserLocalities } from './localityService';
import { fetchProfiles, convertProfilesToUsers } from './profileService';

/**
 * Busca todos os usuários com seus níveis de acesso
 */
export const fetchUsers = async (
  accessLevels: AccessLevel[]
): Promise<User[]> => {
  try {
    console.log("Iniciando busca de usuários com níveis de acesso:", accessLevels);
    
    // Buscar perfis do Supabase
    const profiles = await fetchProfiles();
    
    if (!profiles || profiles.length === 0) {
      console.log("Nenhum perfil encontrado, mostrando lista vazia");
      return [];
    }
    
    console.log(`Encontrados ${profiles.length} perfis de usuário`);

    // Obter mapa de emails dos usuários
    const emailMap = await fetchUserEmails();
    console.log("Mapa de emails de usuários:", emailMap);
    
    // Buscar localidades atribuídas a cada perfil
    const localityMap = await fetchUserLocalities();
    console.log("Mapa de localidades por usuário:", Object.fromEntries(localityMap));
    
    // Converter perfis do Supabase para o formato User
    const users = convertProfilesToUsers(profiles, accessLevels, emailMap, localityMap);
    console.log(`Convertidos ${users.length} usuários com sucesso`);
    
    return users;
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    toast.error("Erro ao carregar usuários. Continuando em modo de demonstração.");
    return [];
  }
};
