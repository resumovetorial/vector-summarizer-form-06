
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AccessLevel } from '@/types/admin';
import { fetchAccessLevels, createAccessLevel, updateAccessLevel, deleteAccessLevel } from '@/services/accessLevelService';
import { useAuth } from '@/hooks/useAuth';
import AccessLevelsList from './access-levels/AccessLevelsList';
import AccessLevelDialog from './access-levels/AccessLevelDialog';

const AccessLevels: React.FC = () => {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Form fields
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

  const handleAddLevel = async () => {
    try {
      setIsLoading(true);
      
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
      toast.error(`Erro ao adicionar nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditLevel = async () => {
    if (!selectedLevel) return;
    
    try {
      setIsLoading(true);
      
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

  // Verificar se o usuário é admin
  const isAdmin = user?.role === 'admin';
  
  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40 flex-col gap-4">
            <p className="text-muted-foreground text-center">
              Você não tem permissão para acessar esta seção.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Níveis de Acesso</CardTitle>
        <Button className="ml-auto" onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Nível de Acesso
        </Button>
      </CardHeader>
      <CardContent>
        <AccessLevelsList 
          accessLevels={accessLevels}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onDelete={handleDeleteLevel}
        />
      </CardContent>

      <AccessLevelDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Adicionar Nível de Acesso"
        formName={formName}
        formDescription={formDescription}
        formPermissions={formPermissions}
        onSubmit={handleAddLevel}
        setFormName={setFormName}
        setFormDescription={setFormDescription}
        setFormPermissions={setFormPermissions}
        isLoading={isLoading}
      />

      <AccessLevelDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Editar Nível de Acesso"
        formName={formName}
        formDescription={formDescription}
        formPermissions={formPermissions}
        onSubmit={handleEditLevel}
        setFormName={setFormName}
        setFormDescription={setFormDescription}
        setFormPermissions={setFormPermissions}
        isLoading={isLoading}
      />
    </Card>
  );
};

export default AccessLevels;
