
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import UserForm from './UserForm';
import { AccessLevel, User } from '@/types/admin';
import { useUserForm } from '@/hooks/useUserForm';

interface UserAddDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  accessLevels: AccessLevel[];
}

const UserAddDialog: React.FC<UserAddDialogProps> = ({
  isOpen,
  setIsOpen,
  users,
  setUsers,
  accessLevels,
}) => {
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
    users,
    setUsers,
    accessLevels,
    onSuccess: () => setIsOpen(false),
    isEditMode: false
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário. Todos os campos marcados com * são obrigatórios.
            Em um ambiente de produção, o usuário receberá um email de convite para definir sua senha.
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
          onCancel={() => setIsOpen(false)}
          onSubmit={handleSubmit}
          submitLabel="Adicionar Usuário"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserAddDialog;
