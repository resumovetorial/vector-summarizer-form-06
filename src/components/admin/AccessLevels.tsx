
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAccessLevels } from '@/hooks/accessLevels';
import AccessLevelsList from './access-levels/AccessLevelsList';
import AccessLevelDialog from './access-levels/AccessLevelDialog';
import AccessDeniedCard from './access-levels/AccessDeniedCard';

const AccessLevels: React.FC = () => {
  const {
    accessLevels,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    formPermissions,
    setFormPermissions,
    handleAddLevel,
    handleEditLevel,
    handleDeleteLevel,
    loadAccessLevels,
    openEditDialog,
    isAdmin
  } = useAccessLevels();

  // Use useEffect with an empty dependency array for one-time initialization
  useEffect(() => {
    loadAccessLevels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAdmin) {
    return <AccessDeniedCard />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Níveis de Acesso</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Nível
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

      {/* Add Level Dialog */}
      <AccessLevelDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Adicionar Nível de Acesso"
        formName={formName}
        formDescription={formDescription}
        formPermissions={formPermissions}
        setFormName={setFormName}
        setFormDescription={setFormDescription}
        setFormPermissions={setFormPermissions}
        onSubmit={() => handleAddLevel(formName, formDescription, formPermissions)}
        isLoading={isLoading}
      />

      {/* Edit Level Dialog */}
      <AccessLevelDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Editar Nível de Acesso"
        formName={formName}
        formDescription={formDescription}
        formPermissions={formPermissions}
        setFormName={setFormName}
        setFormDescription={setFormDescription}
        setFormPermissions={setFormPermissions}
        onSubmit={() => handleEditLevel(formName, formDescription, formPermissions)}
        isLoading={isLoading}
      />
    </Card>
  );
};

export default AccessLevels;
