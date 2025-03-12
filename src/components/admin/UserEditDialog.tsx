
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import UserForm from './UserForm';
import { AccessLevel, User } from '@/types/admin';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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
  const [isLoading, setIsLoading] = React.useState(false);

  // Reset form data when dialog opens with a selected user
  useEffect(() => {
    if (selectedUser && isOpen) {
      setFormName(selectedUser.name);
      setFormEmail(selectedUser.email);
      setFormRole(selectedUser.role);
      setFormAccessLevel(selectedUser.accessLevelId.toString());
      setFormActive(selectedUser.active);
      setFormLocalities(selectedUser.assignedLocalities);
      
      console.log("Form initialized with:", {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        accessLevelId: selectedUser.accessLevelId.toString(),
        active: selectedUser.active,
        localities: selectedUser.assignedLocalities
      });
    }
  }, [selectedUser, isOpen]);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('');
    setFormAccessLevel('');
    setFormActive(true);
    setFormLocalities([]);
  };

  const handleCloseDialog = () => {
    resetForm();
    setSelectedUser(null);
    setIsOpen(false);
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    
    try {
      // Find the selected access level object based on the ID
      const selectedAccessLevel = accessLevels.find(
        level => level.id.toString() === formAccessLevel
      );
      
      if (!selectedAccessLevel) {
        throw new Error("Selected access level not found");
      }
      
      // For debugging purposes
      console.log("Selected user:", selectedUser);
      console.log("Selected access level:", selectedAccessLevel);
      console.log("Form access level ID:", formAccessLevel);
      
      // Se o usuário tem um ID do Supabase, atualizar no banco de dados
      if (selectedUser.supabaseId) {
        // Atualizar o perfil no Supabase - omitindo o access_level_id por enquanto
        // pois ele requer um UUID e não um ID numérico
        const { error } = await supabase
          .from('profiles')
          .update({ 
            username: formName,
            role: formRole,
            active: formActive
          })
          .eq('id', selectedUser.supabaseId);
          
        if (error) {
          console.error('Erro ao atualizar usuário:', error);
          throw new Error(error.message);
        }
      }
      
      // Atualizar usuários na interface localmente
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          const updatedUser = {
            ...user,
            name: formName,
            email: formEmail,
            role: formRole,
            accessLevelId: parseInt(formAccessLevel),
            active: formActive,
            assignedLocalities: formLocalities
          };
          console.log("Updated user in local state:", updatedUser);
          return updatedUser;
        }
        return user;
      });
      
      // Atualizar o estado global dos usuários
      setUsers(updatedUsers);
      
      handleCloseDialog();
      toast.success("Usuário atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
      console.error("Erro na atualização:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          onSubmit={handleEditUser}
          submitLabel="Salvar Alterações"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
