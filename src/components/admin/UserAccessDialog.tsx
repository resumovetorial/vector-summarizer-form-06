
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserAccessForm from './UserAccessForm';
import { User } from '@/types/admin';
import { toast } from 'sonner';

interface UserAccessDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  selectedUser: User | null;
}

const UserAccessDialog: React.FC<UserAccessDialogProps> = ({
  isOpen,
  setIsOpen,
  users,
  setUsers,
  selectedUser,
}) => {
  const updateUserLocalities = (userId: number, localities: string[]) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, assignedLocalities: localities } : user
    );
    setUsers(updatedUsers);
    setIsOpen(false);
    toast.success("Acesso às localidades atualizado com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Configurar Acesso às Localidades - {selectedUser?.name}
          </DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <UserAccessForm 
            user={selectedUser} 
            onSave={(localities) => updateUserLocalities(selectedUser.id, localities)} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserAccessDialog;
