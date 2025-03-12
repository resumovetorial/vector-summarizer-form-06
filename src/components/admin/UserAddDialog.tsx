
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserForm from './UserForm';
import { AccessLevel, User } from '@/types/admin';
import { toast } from 'sonner';

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
  const [formName, setFormName] = React.useState('');
  const [formEmail, setFormEmail] = React.useState('');
  const [formRole, setFormRole] = React.useState('');
  const [formAccessLevel, setFormAccessLevel] = React.useState('');
  const [formActive, setFormActive] = React.useState(true);
  const [formLocalities, setFormLocalities] = React.useState<string[]>([]);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('');
    setFormAccessLevel('');
    setFormActive(true);
    setFormLocalities([]);
  };

  const handleAddUser = () => {
    const newUser: User = {
      id: users.length + 1,
      name: formName,
      email: formEmail,
      role: formRole,
      accessLevelId: parseInt(formAccessLevel),
      active: formActive,
      assignedLocalities: formLocalities
    };
    
    setUsers([...users, newUser]);
    setIsOpen(false);
    resetForm();
    toast.success("Usuário adicionado com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
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
          onSubmit={handleAddUser}
          submitLabel="Adicionar Usuário"
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserAddDialog;
