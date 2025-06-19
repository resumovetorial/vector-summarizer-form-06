
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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
    handleSubmit,
    formErrors
  } = useUserForm({
    users,
    setUsers,
    accessLevels,
    onSuccess: () => {
      console.log("Usuário adicionado com sucesso, fechando dialog");
      setIsOpen(false);
    },
    isEditMode: false
  });

  const handleCancel = () => {
    console.log("Cancelando adição de usuário");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Adicionar Novo Usuário</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Preencha os dados do novo usuário para criar uma conta. O usuário receberá um email 
            com instruções para definir sua senha.
          </DialogDescription>
        </DialogHeader>

        {formErrors && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {formErrors}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4">
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
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            submitLabel="Adicionar Usuário"
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddDialog;
