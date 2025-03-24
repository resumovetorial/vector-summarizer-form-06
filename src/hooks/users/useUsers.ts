
import { useEffect } from 'react';
import { User } from '@/types/admin';
import { useFetchUsers } from './useFetchUsers';
import { useDeleteUser } from './useDeleteUser';

/**
 * Hook principal para gerenciamento de usuários
 */
export const useUsers = () => {
  const {
    users,
    setUsers,
    accessLevels,
    isLoading,
    setIsLoading,
    loadAllUsers
  } = useFetchUsers();

  const { deleteUser } = useDeleteUser();

  // Carregar usuários ao inicializar o componente
  useEffect(() => {
    loadAllUsers();
  }, []);

  /**
   * Manipula a exclusão de um usuário
   */
  const handleDeleteUser = async (userId: number, supabaseId?: string) => {
    setIsLoading(true);
    
    const success = await deleteUser(userId, supabaseId);
    if (success) {
      // Atualiza o estado da UI após a exclusão
      setUsers(users.filter(user => user.id !== userId));
    }
    
    setIsLoading(false);
    return success;
  };

  /**
   * Recarrega manualmente a lista de usuários
   */
  const refreshUsers = () => {
    loadAllUsers();
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
