
import { useState } from 'react';
import { User, AccessLevel } from '@/types/admin';
import { fetchUsers } from './userFetchService';
import { fetchAccessLevels } from '@/services/accessLevelService';
import { toast } from 'sonner';

/**
 * Hook para buscar usuários e níveis de acesso
 */
export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Busca níveis de acesso do Supabase
   */
  const loadAccessLevels = async (): Promise<AccessLevel[]> => {
    try {
      const fetchedAccessLevels = await fetchAccessLevels();
      console.log("Níveis de acesso obtidos:", fetchedAccessLevels);
      
      // Set access levels
      setAccessLevels(fetchedAccessLevels);
      
      if (fetchedAccessLevels.length === 0) {
        toast.error("Nenhum nível de acesso encontrado. Cadastre níveis de acesso primeiro.");
      }
      
      return fetchedAccessLevels;
    } catch (error) {
      console.error('Erro ao buscar níveis de acesso:', error);
      toast.error("Não foi possível carregar os níveis de acesso.");
      return [];
    }
  };

  /**
   * Busca todos os usuários e seus níveis de acesso do Supabase
   */
  const loadAllUsers = async () => {
    setIsLoading(true);
    
    try {
      // Primeiro buscar os níveis de acesso
      const fetchedAccessLevels = await loadAccessLevels();
      
      if (fetchedAccessLevels.length === 0) {
        setIsLoading(false);
        return;
      }
      
      // Depois buscar os usuários com seus níveis de acesso
      const usersData = await fetchUsers(fetchedAccessLevels);
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error("Erro inesperado ao carregar dados de usuários.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    setUsers,
    accessLevels,
    isLoading,
    setIsLoading,
    loadAccessLevels,
    loadAllUsers
  };
};
