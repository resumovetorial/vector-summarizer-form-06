
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserForm from './UserForm';
import { AccessLevel, User } from '@/types/admin';
import { toast } from 'sonner';

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
  const [formName, setFormName] = React.useState('');
  const [formEmail, setFormEmail] = React.useState('');
  const [formRole, setFormRole] = React.useState('');
  const [formAccessLevel, setFormAccessLevel] = React.useState('');
  const [formActive, setFormActive] = React.useState(true);
  const [formLocalities, setFormLocalities] = React.useState<string[]>([]);

  useEffect(() => {
    if (selectedUser) {
      setFormName(selectedUser.name);
      setFormEmail(selectedUser.email);
      setFormRole(selectedUser.role);
      setFormAccessLevel(selectedUser.accessLevelId.toString());
      setFormActive(selectedUser.active);
      setFormLocalities(selectedUser.assignedLocalities);
    }
  }, [selectedUser]);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('');
    setFormAccessLevel('');
    setFormActive(true);
    setFormLocalities([]);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? {
        ...user,
        name: formName,
        email: formEmail,
        role: formRole,
        accessLevelId: parseInt(formAccessLevel),
        active: formActive,
        assignedLocalities: formLocalities
      } : user
    );
    
    setUsers(updatedUsers);
    setIsOpen(false);
    resetForm();
    toast.success("Usuário atualizado com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
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
          onSubmit={handleEditUser}
          submitLabel="Salvar Alterações"
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
