
import { useCallback } from 'react';
import { toast } from 'sonner';
import { AccessLevel } from '@/types/admin';
import { 
  fetchAccessLevels,
  createAccessLevel,
  updateAccessLevel,
  deleteAccessLevel
} from '@/services/accessLevelService';

/**
 * Hook for access level CRUD operations
 */
export const useAccessLevelOperations = (
  accessLevels: AccessLevel[],
  setAccessLevels: (levels: AccessLevel[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  resetForm: () => void,
  setIsAddDialogOpen: (isOpen: boolean) => void,
  setIsEditDialogOpen: (isOpen: boolean) => void,
  selectedLevel: AccessLevel | null
) => {
  /**
   * Load access levels from the database
   */
  const loadAccessLevels = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Carregando níveis de acesso...');
      const levels = await fetchAccessLevels();
      console.log('Níveis de acesso carregados:', levels);
      setAccessLevels(levels);
    } catch (error: any) {
      console.error('Erro ao carregar níveis de acesso:', error);
      toast.error(`Erro ao carregar níveis de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [setAccessLevels, setIsLoading]);

  /**
   * Add a new access level
   */
  const handleAddLevel = async (
    formName: string,
    formDescription: string,
    formPermissions: string
  ) => {
    try {
      // Validar dados do formulário
      if (!formName.trim()) {
        toast.error("O nome do nível de acesso é obrigatório.");
        return;
      }
      
      setIsLoading(true);
      console.log('Adicionando nível de acesso...');
      
      // Dividir as permissões por vírgula e remover espaços em branco
      const permissionsArray = formPermissions 
        ? formPermissions.split(',').map(p => p.trim()).filter(p => p !== '')
        : [];
      
      // Se não houver permissões, adicionar 'form' como padrão
      if (permissionsArray.length === 0) {
        permissionsArray.push('form');
      }
      
      console.log('Dados do nível a ser criado:', {
        name: formName,
        description: formDescription,
        permissions: permissionsArray
      });
      
      const newLevel = await createAccessLevel({
        name: formName,
        description: formDescription,
        permissions: permissionsArray,
      });
      
      console.log('Nível de acesso criado com sucesso:', newLevel);
      
      // Atualizar a lista de níveis de acesso
      setAccessLevels(prev => [...prev, newLevel]);
      
      // Fechar o diálogo e resetar o formulário
      setIsAddDialogOpen(false);
      resetForm();
      
      toast.success("Nível de acesso adicionado com sucesso!");
      
      // Recarregar a lista para garantir sincronização com o servidor
      await loadAccessLevels();
    } catch (error: any) {
      console.error("Erro ao adicionar nível de acesso:", error);
      toast.error(`Erro ao adicionar nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Edit an existing access level
   */
  const handleEditLevel = async (
    formName: string,
    formDescription: string,
    formPermissions: string
  ) => {
    if (!selectedLevel) return;
    
    try {
      // Validar dados do formulário
      if (!formName.trim()) {
        toast.error("O nome do nível de acesso é obrigatório.");
        return;
      }
      
      setIsLoading(true);
      console.log('Editando nível de acesso...');
      
      // Dividir as permissões por vírgula e remover espaços em branco
      const permissionsArray = formPermissions 
        ? formPermissions.split(',').map(p => p.trim()).filter(p => p !== '')
        : [];
      
      // Se não houver permissões, adicionar 'form' como padrão
      if (permissionsArray.length === 0) {
        permissionsArray.push('form');
      }
      
      const updatedLevel = await updateAccessLevel({
        ...selectedLevel,
        name: formName,
        description: formDescription,
        permissions: permissionsArray,
      });
      
      console.log('Nível de acesso atualizado:', updatedLevel);
      
      // Atualizar a lista de níveis de acesso
      const updatedLevels = accessLevels.map(level => 
        level.id === selectedLevel.id ? updatedLevel : level
      );
      
      setAccessLevels(updatedLevels);
      
      // Fechar o diálogo e resetar o formulário
      setIsEditDialogOpen(false);
      resetForm();
      
      toast.success("Nível de acesso atualizado com sucesso!");
      
      // Recarregar a lista para garantir sincronização com o servidor
      await loadAccessLevels();
    } catch (error: any) {
      console.error('Erro ao atualizar nível de acesso:', error);
      toast.error(`Erro ao atualizar nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete an access level
   */
  const handleDeleteLevel = async (level: AccessLevel) => {
    try {
      setIsLoading(true);
      console.log('Excluindo nível de acesso:', level);
      
      await deleteAccessLevel(level.name);
      
      // Atualizar a lista de níveis de acesso
      setAccessLevels(accessLevels.filter(l => l.id !== level.id));
      
      toast.success("Nível de acesso removido com sucesso!");
      
      // Recarregar a lista para garantir sincronização com o servidor
      await loadAccessLevels();
    } catch (error: any) {
      console.error('Erro ao remover nível de acesso:', error);
      toast.error(`Erro ao remover nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loadAccessLevels,
    handleAddLevel,
    handleEditLevel,
    handleDeleteLevel
  };
};
