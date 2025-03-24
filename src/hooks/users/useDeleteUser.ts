
import { deleteUser as deleteUserService } from './userDeleteService';
import { toast } from 'sonner';

/**
 * Hook para gerenciar a exclusão de usuários
 */
export const useDeleteUser = () => {
  /**
   * Exclui um usuário do sistema
   */
  const deleteUser = async (userId: number, supabaseId?: string): Promise<boolean> => {
    if (!supabaseId) {
      toast.error("Este usuário não pode ser excluído");
      return false;
    }

    try {
      const success = await deleteUserService(userId, supabaseId);
      
      if (success) {
        toast.success("Usuário removido com sucesso!");
      } else {
        toast.error("Erro ao excluir usuário. Tente novamente mais tarde.");
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error("Erro inesperado ao excluir usuário.");
      return false;
    }
  };

  return { deleteUser };
};
