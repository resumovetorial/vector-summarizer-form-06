
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import UserForm from './UserForm';
import { AccessLevel, User } from '@/types/admin';
import { useUserForm } from '@/hooks/useUserForm';

interface UserEditDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  accessLevels: AccessLevel[];
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({
  isOpen,
  setIsOpen,
  users,
  setUsers,
  accessLevels,
  selectedUser,
  setSelectedUser,
}) => {
  const handleCloseDialog = () => {
    setSelectedUser(null);
    setIsOpen(false);
  };

  const {
    formName,
    setFormName,
    formEmail,
    setFormEmail,
    formRole,
    setFormRole,
    formAccessLevel,
    setFormAccessLevel,
    formActive,
    setFormActive,
    formLocalities,
    setFormLocalities,
    isLoading,
    handleSubmit
  } = useUserForm({
    initialUser: selectedUser,
    users,
    setUsers,
    accessLevels,
    onSuccess: handleCloseDialog,
    isEditMode: true
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Altere as informações do usuário conforme necessário.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          name={formName}
          setName={setFormName}
          email={formEmail}
          setEmail={setFormEmail}
          role={formRole}
          setRole={setFormRole}
          accessLevel={formAccessLevel}
          setAccessLevel={setFormAccessLevel}
          active={formActive}
          setActive={setFormActive}
          selectedLocalities={formLocalities}
          setSelectedLocalities={setFormLocalities}
          accessLevels={accessLevels}
          onCancel={handleCloseDialog}
          onSubmit={handleSubmit}
          submitLabel="Salvar Alterações"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
