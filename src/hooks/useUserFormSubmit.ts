
import { User, AccessLevel } from '@/types/admin';
import { toast } from 'sonner';
import { validateUserForm } from '@/utils/userFormValidation';
import { updateExistingUser, createNewUser } from '@/services/userService';

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
    console.log("Iniciando submissão do formulário com dados:", formData);
    
    if (!validateUserForm(
      formData.name, 
      formData.email, 
      formData.role, 
      formData.accessLevel,
      setFormErrors
    )) {
      console.log("Validação falhou");
      return;
    }

    setIsLoading(true);
    
    try {
      // Parse the access level ID to a number
      const accessLevelIdNum = parseInt(formData.accessLevel);
      
      // Find the actual access level object by ID
      const selectedAccessLevel = accessLevels.find(level => level.id === accessLevelIdNum);
      
      if (!selectedAccessLevel) {
        throw new Error("Nível de acesso selecionado não é válido");
      }
      
      console.log("Usuário selecionado:", initialUser);
      console.log("Nível de acesso selecionado:", selectedAccessLevel);
      console.log("ID do nível de acesso no formulário:", accessLevelIdNum);
      console.log("Dados do formulário:", formData);
      
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
          onSuccess();
        }
      } else {
        try {
          console.log("Criando novo usuário...");
          const { newUser } = await createNewUser(formData, accessLevelIdNum, users);
          
          console.log("Usuário criado, atualizando estado:", newUser);
          
          // Certifique-se de que a UI seja atualizada com o novo usuário
          setUsers(prevUsers => [...prevUsers, newUser]);
          
          toast.success("Usuário adicionado com sucesso! Em um ambiente de produção, este usuário receberia um email de convite.");
          
          // Chama o callback de sucesso para fechar o modal ou realizar outras ações
          onSuccess();
        } catch (error) {
          console.error("Erro ao criar usuário:", error);
          toast.error(`Erro ao adicionar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
          throw error;
        }
      }
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
