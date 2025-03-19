
import { useState, useEffect } from 'react';
import { User, AccessLevel } from '@/types/admin';
import { fetchUsers } from './userFetchService';
import { deleteUser } from './userDeleteService';
import { fetchAccessLevels } from '@/services/accessLevelService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar usuários do Supabase
  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch access levels from Supabase first
      let fetchedAccessLevels: AccessLevel[] = [];
      try {
        fetchedAccessLevels = await fetchAccessLevels();
        console.log("Níveis de acesso obtidos:", fetchedAccessLevels);
        
        // Set access levels (including all defined levels)
        setAccessLevels(fetchedAccessLevels);
      } catch (error) {
        console.error('Erro ao buscar níveis de acesso:', error);
        toast.error("Não foi possível carregar os níveis de acesso.");
        setIsLoading(false);
        return;
      }
      
      if (fetchedAccessLevels.length === 0) {
        toast.error("Nenhum nível de acesso encontrado. Cadastre níveis de acesso primeiro.");
        setIsLoading(false);
        return;
      }
      
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

  // Carregar usuários ao inicializar o componente
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDeleteUser = async (userId: number, supabaseId?: string) => {
    setIsLoading(true);
    
    const success = await deleteUser(userId, supabaseId);
    if (success) {
      // Update UI state regardless of backend success
      setUsers(users.filter(user => user.id !== userId));
    }
    
    setIsLoading(false);
    return success;
  };

  // Função para recarregar manualmente a lista de usuários
  const refreshUsers = () => {
    fetchAllUsers();
  };

  return {
    users,
    setUsers,
    accessLevels,
    isLoading,
    handleDeleteUser,
    refreshUsers
  };
};

// Add missing import for toast
import { toast } from 'sonner';
