
import { useState, useEffect } from 'react';
import { User, AccessLevel } from '@/types/admin';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface UseUserFormProps {
  initialUser?: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  accessLevels: AccessLevel[];
  onSuccess: () => void;
  isEditMode: boolean;
}

export const useUserForm = ({
  initialUser,
  users,
  setUsers,
  accessLevels,
  onSuccess,
  isEditMode
}: UseUserFormProps) => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formAccessLevel, setFormAccessLevel] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formLocalities, setFormLocalities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form when initialUser changes
  useEffect(() => {
    if (initialUser && isEditMode) {
      setFormName(initialUser.name);
      setFormEmail(initialUser.email);
      setFormRole(initialUser.role);
      setFormAccessLevel(initialUser.accessLevelId.toString());
      setFormActive(initialUser.active);
      setFormLocalities([...initialUser.assignedLocalities]);
      
      console.log("Form initialized with:", {
        name: initialUser.name,
        email: initialUser.email,
        role: initialUser.role,
        accessLevelId: initialUser.accessLevelId.toString(),
        active: initialUser.active,
        localities: initialUser.assignedLocalities
      });
    } else {
      // Reset form for add mode or when dialog closes
      resetForm();
    }
  }, [initialUser, isEditMode]);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('');
    setFormAccessLevel('');
    setFormActive(true);
    setFormLocalities([]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Parse the access level ID to a number
      const accessLevelIdNum = parseInt(formAccessLevel);
      
      if (isEditMode && initialUser) {
        // Update existing user
        if (initialUser.supabaseId) {
          // Update only the profile fields that don't cause UUID conversion issues
          const { error } = await supabase
            .from('profiles')
            .update({ 
              username: formName,
              role: formRole,
              active: formActive
              // Intentionally NOT updating access_level_id here as it requires UUID
            })
            .eq('id', initialUser.supabaseId);
            
          if (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw new Error(error.message);
          }
        }
        
        // Update users in the local state
        const updatedUsers = users.map(user => {
          if (user.id === initialUser.id) {
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
        
        setUsers(updatedUsers);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Add new user
        const newUser: User = {
          id: users.length + 1,
          name: formName,
          email: formEmail,
          role: formRole,
          accessLevelId: accessLevelIdNum,
          active: formActive,
          assignedLocalities: formLocalities
        };
        
        setUsers([...users, newUser]);
        toast.success("Usuário adicionado com sucesso!");
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} usuário: ${error.message}`);
      console.error(`Erro na ${isEditMode ? 'atualização' : 'adição'}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    resetForm,
    handleSubmit
  };
};
