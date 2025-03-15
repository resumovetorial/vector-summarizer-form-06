
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AccessLevel } from '@/types/admin';
import { 
  fetchAccessLevels, 
  createAccessLevel, 
  updateAccessLevel, 
  deleteAccessLevel 
} from '@/services/accessLevelService';
import { useAuth } from '@/hooks/useAuth';

export const useAccessLevels = () => {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPermissions, setFormPermissions] = useState('');

  useEffect(() => {
    loadAccessLevels();
  }, []);

  const loadAccessLevels = async () => {
    try {
      setIsLoading(true);
      const levels = await fetchAccessLevels();
      setAccessLevels(levels);
    } catch (error: any) {
      toast.error(`Erro ao carregar níveis de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar se o usuário tem permissão para gerenciar níveis de acesso (admin ou supervisor)
  const hasPermissionToManage = (): boolean => {
    if (!user) return false;
    
    // Administrador sempre tem acesso
    if (user.role === 'admin') return true;
    
    // Verificar o nível de acesso do usuário
    const accessLevel = user.accessLevel?.toLowerCase();
    return accessLevel === 'supervisor' || accessLevel === 'administrador';
  };

  const handleAddLevel = async () => {
    try {
      setIsLoading(true);
      
      if (!hasPermissionToManage()) {
        toast.error("Apenas administradores e supervisores podem adicionar níveis de acesso.");
        return;
      }
      
      const newLevel = await createAccessLevel({
        name: formName,
        description: formDescription,
        permissions: formPermissions.split(',').map(p => p.trim()),
      });
      
      setAccessLevels([...accessLevels, newLevel]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Nível de acesso adicionado com sucesso!");
    } catch (error: any) {
      console.error("Erro completo:", error);
      toast.error(`Erro ao adicionar nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditLevel = async () => {
    if (!selectedLevel) return;
    
    try {
      setIsLoading(true);
      
      if (!hasPermissionToManage()) {
        toast.error("Apenas administradores e supervisores podem editar níveis de acesso.");
        return;
      }
      
      const updatedLevel = await updateAccessLevel({
        ...selectedLevel,
        name: formName,
        description: formDescription,
        permissions: formPermissions.split(',').map(p => p.trim()),
      });
      
      const updatedLevels = accessLevels.map(level => 
        level.id === selectedLevel.id ? updatedLevel : level
      );
      
      setAccessLevels(updatedLevels);
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Nível de acesso atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteLevel = async (level: AccessLevel) => {
    try {
      setIsLoading(true);
      
      if (!hasPermissionToManage()) {
        toast.error("Apenas administradores e supervisores podem remover níveis de acesso.");
        return;
      }
      
      await deleteAccessLevel(level.name);
      
      setAccessLevels(accessLevels.filter(l => l.id !== level.id));
      toast.success("Nível de acesso removido com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPermissions('');
    setSelectedLevel(null);
  };
  
  const openEditDialog = (level: AccessLevel) => {
    setSelectedLevel(level);
    setFormName(level.name);
    setFormDescription(level.description);
    setFormPermissions(level.permissions.join(', '));
    setIsEditDialogOpen(true);
  };

  return {
    accessLevels,
    isLoading,
    isAddDialogOpen,
    isEditDialogOpen,
    formName,
    formDescription,
    formPermissions,
    selectedLevel,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setFormName,
    setFormDescription,
    setFormPermissions,
    handleAddLevel,
    handleEditLevel,
    handleDeleteLevel,
    openEditDialog,
    isAdmin: hasPermissionToManage()
  };
};
