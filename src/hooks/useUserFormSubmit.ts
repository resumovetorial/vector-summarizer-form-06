import { User, AccessLevel } from '@/types/admin';
import { toast } from 'sonner';
import { validateUserForm } from '@/utils/userFormValidation';
import { updateExistingUser } from '@/services/userUpdateService';
import { createNewUser } from '@/services/userCreationService';

interface UseUserFormSubmitProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  accessLevels: AccessLevel[];
  onSuccess: () => void;
  isEditMode: boolean;
  formData: {
    name: string;
    email: string;
    role: string;
    accessLevel: string;
    active: boolean;
    localities: string[];
  };
  initialUser?: User | null;
  setIsLoading: (isLoading: boolean) => void;
  setFormErrors: (errors: string | null) => void;
}

export const useUserFormSubmit = ({
  users,
  setUsers,
  accessLevels,
  onSuccess,
  isEditMode,
  formData,
  initialUser,
  setIsLoading,
  setFormErrors
}: UseUserFormSubmitProps) => {
  const handleSubmit = async () => {
    if (!validateUserForm(
      formData.name, 
      formData.email, 
      formData.role, 
      formData.accessLevel,
      setFormErrors
    )) return;

    setIsLoading(true);
    
    try {
      // Parse the access level ID to a number
      const accessLevelIdNum = parseInt(formData.accessLevel);
      
      // Find the actual access level object by ID
      const selectedAccessLevel = accessLevels.find(level => level.id === accessLevelIdNum);
      
      if (!selectedAccessLevel) {
        throw new Error("Nível de acesso selecionado não é válido");
      }
      
      console.log("Selected user:", initialUser);
      console.log("Selected access level:", selectedAccessLevel);
      console.log("Form access level ID:", accessLevelIdNum);
      
      if (isEditMode && initialUser) {
        const updatedUser = await updateExistingUser(initialUser, formData, accessLevelIdNum);
        if (updatedUser) {
          // Update users in the local state
          const updatedUsers = users.map(user => {
            if (user.id === initialUser.id) {
              return updatedUser;
            }
            return user;
          });
          
          setUsers(updatedUsers);
          toast.success("Usuário atualizado com sucesso!");
        }
      } else {
        const { newUser } = await createNewUser(formData, accessLevelIdNum, users);
        setUsers([...users, newUser]);
        toast.success("Usuário adicionado com sucesso! Em um ambiente de produção, este usuário receberia um email de convite.");
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
    handleSubmit
  };
};
