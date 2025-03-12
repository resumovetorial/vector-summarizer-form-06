
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

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    
    try {
      // Obtenha o UUID do nível de acesso selecionado
      const accessLevelId = parseInt(formAccessLevel);
      
      // Se o usuário tem um ID do Supabase, atualizar no banco de dados
      if (selectedUser.supabaseId) {
        // Atualizar o perfil no Supabase
        const { error } = await supabase
          .from('profiles')
          .update({ 
            username: formName,
            role: formRole,
            access_level_id: accessLevelId,
            active: formActive
          })
          .eq('id', selectedUser.supabaseId);
          
        if (error) {
          console.error('Erro ao atualizar usuário:', error);
          throw new Error(error.message);
        }
      }
      
      // Atualizar usuários na interface
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? {
          ...user,
          name: formName,
          email: formEmail,
          role: formRole,
          accessLevelId: accessLevelId,
          active: formActive,
          assignedLocalities: formLocalities
        } : user
      );
      
      setUsers(updatedUsers);
      setIsOpen(false);
      resetForm();
      toast.success("Usuário atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
      console.error("Erro na atualização:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          onCancel={() => setIsOpen(false)}
          onSubmit={handleEditUser}
          submitLabel="Salvar Alterações"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
