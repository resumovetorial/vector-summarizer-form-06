
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccessLevels } from '@/hooks/useAccessLevels';
import AccessLevelsList from './access-levels/AccessLevelsList';
import AccessLevelDialog from './access-levels/AccessLevelDialog';
import AccessDeniedCard from './access-levels/AccessDeniedCard';

const AccessLevels: React.FC = () => {
  const {
    accessLevels,
    isLoading,
    isAddDialogOpen,
    isEditDialogOpen,
    formName,
    formDescription,
    formPermissions,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setFormName,
    setFormDescription,
    setFormPermissions,
    handleAddLevel,
    handleEditLevel,
    handleDeleteLevel,
    openEditDialog,
    isAdmin
  } = useAccessLevels();
  
  if (!isAdmin) {
    return <AccessDeniedCard />;
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
