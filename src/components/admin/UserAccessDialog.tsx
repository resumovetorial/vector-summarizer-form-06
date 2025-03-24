
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserAccessForm from './UserAccessForm';
import { User } from '@/types/admin';
import { toast } from 'sonner';
import { assignLocalityAccess } from '@/services/user/localityAccessManager';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateUserLocalities = async (userId: number, localities: string[]) => {
    if (!selectedUser) {
      toast.error("Usuário inválido selecionado.");
      return;
    }
    
    if (!selectedUser.supabaseId) {
      toast.error("ID do usuário no Supabase não encontrado.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Atualizando localidades para o usuário:", selectedUser);
      
      // Call the assignLocalityAccess function to update localities in the database
      const success = await assignLocalityAccess(selectedUser.supabaseId, localities);
      
      if (success) {
        // Update the local state to reflect the changes
        const updatedUsers = users.map(user => 
          user.id === userId ? { ...user, assignedLocalities: localities } : user
        );
        
        console.log("Estado dos usuários atualizado:", updatedUsers);
        setUsers(updatedUsers);
        setIsOpen(false);
        toast.success("Acesso às localidades atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar acesso às localidades. Verifique o console para mais detalhes.");
      }
    } catch (error) {
      console.error("Erro ao atualizar localidades:", error);
      toast.error("Erro ao atualizar acesso às localidades. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserAccessDialog;
