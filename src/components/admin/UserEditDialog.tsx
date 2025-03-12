
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
      // Create deep copy of the user to avoid reference issues
      const userCopy = JSON.parse(JSON.stringify(selectedUser));
      
      setFormName(userCopy.name);
      setFormEmail(userCopy.email);
      setFormRole(userCopy.role);
      setFormAccessLevel(userCopy.accessLevelId.toString());
      setFormActive(userCopy.active);
      setFormLocalities([...userCopy.assignedLocalities]);
      
      console.log("Form initialized with:", {
        name: userCopy.name,
        email: userCopy.email,
        role: userCopy.role,
        accessLevelId: userCopy.accessLevelId.toString(),
        active: userCopy.active,
        localities: userCopy.assignedLocalities
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
      // Parse the access level ID to a number for local state
      const accessLevelIdNum = parseInt(formAccessLevel);
      
      // Find the selected access level object based on the ID
      const selectedAccessLevel = accessLevels.find(
        level => level.id === accessLevelIdNum
      );
      
      if (!selectedAccessLevel) {
        throw new Error("Selected access level not found");
      }
      
      console.log("Selected user:", selectedUser);
      console.log("Selected access level:", selectedAccessLevel);
      console.log("Form access level ID:", formAccessLevel);
      
      // Update the user in Supabase if they have a Supabase ID
      if (selectedUser.supabaseId) {
        // Update only the profile fields that don't cause UUID conversion issues
        const { error } = await supabase
          .from('profiles')
          .update({ 
            username: formName,
            role: formRole,
            active: formActive
            // Intentionally NOT updating access_level_id here as it requires UUID
          })
          .eq('id', selectedUser.supabaseId);
          
        if (error) {
          console.error('Erro ao atualizar usuário:', error);
          throw new Error(error.message);
        }
      }
      
      // Update users in the local state to reflect changes immediately
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          // Create a new object to ensure state updates correctly
          return {
            ...user,
            name: formName,
            email: formEmail,
            role: formRole,
            accessLevelId: accessLevelIdNum,
            active: formActive,
            assignedLocalities: [...formLocalities]
          };
        }
        return user;
      });
      
      // Update the global users state
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
