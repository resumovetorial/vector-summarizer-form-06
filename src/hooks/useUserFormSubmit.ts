
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
      if (isEditMode && initialUser) {
        // Pass the string version of accessLevel instead of the parsed number
        const updatedUser = await updateExistingUser(initialUser, formData, formData.accessLevel);
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
          // Parse the access level ID to a number for the createNewUser function
          const accessLevelIdNum = parseInt(formData.accessLevel);
          
          if (isNaN(accessLevelIdNum)) {
            throw new Error("Nível de acesso inválido");
          }
          
          const { userId, newUser } = await createNewUser(formData, accessLevelIdNum, users);
          
          console.log("Usuário criado, atualizando estado:", newUser);
          console.log("ID do usuário no Supabase:", userId);
          
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
