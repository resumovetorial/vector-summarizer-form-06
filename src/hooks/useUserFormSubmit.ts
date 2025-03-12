
import { User, AccessLevel } from '@/types/admin';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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
}

export const useUserFormSubmit = ({
  users,
  setUsers,
  accessLevels,
  onSuccess,
  isEditMode,
  formData,
  initialUser,
  setIsLoading
}: UseUserFormSubmitProps) => {
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.role || !formData.accessLevel) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
        await updateExistingUser(selectedAccessLevel, accessLevelIdNum);
      } else {
        await createNewUser(selectedAccessLevel, accessLevelIdNum);
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} usuário: ${error.message}`);
      console.error(`Erro na ${isEditMode ? 'atualização' : 'adição'}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateExistingUser = async (selectedAccessLevel: AccessLevel, accessLevelIdNum: number) => {
    if (!initialUser) return;

    if (initialUser.supabaseId) {
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: formData.name,
          role: formData.role,
          active: formData.active,
          access_level_id: selectedAccessLevel.id.toString() // Store as string in Supabase
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
          name: formData.name,
          email: formData.email,
          role: formData.role,
          accessLevelId: accessLevelIdNum,
          active: formData.active,
          assignedLocalities: [...formData.localities]
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    toast.success("Usuário atualizado com sucesso!");
  };

  const createNewUser = async (selectedAccessLevel: AccessLevel, accessLevelIdNum: number) => {
    // First check if user with this email already exists
    const { data: existingUsers, error: searchError } = await supabase
      .from('profiles')
      .select('id, username')
      .ilike('username', formData.email)
      .limit(1);
      
    if (searchError) {
      console.error('Erro ao verificar existência do usuário:', searchError);
      throw new Error(searchError.message);
    }

    let userId: string;
    
    if (existingUsers && existingUsers.length > 0) {
      // User already exists, use their ID
      userId = existingUsers[0].id;
      console.log("User already exists, using ID:", userId);
    } else {
      // For demo purposes only - in a real app this would be an invitation flow
      // This part will fail without admin privileges, which is expected
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: 'temporary-password', // This would be randomized in a real app
          email_confirm: true
        });
        
        if (error) throw error;
        userId = data.user.id;
        console.log("Created new user with ID:", userId);
      } catch (adminError: any) {
        console.error("Admin user creation failed (expected without admin rights):", adminError);
        
        // Since we can't create users without admin rights, we'll simulate it
        // In a real app, you would implement a proper invitation flow
        const fakeUserId = crypto.randomUUID();
        userId = fakeUserId;
        
        // Show user-friendly message
        toast.info("No modo de demonstração, os usuários seriam convidados por email. Simulando criação de usuário com ID temporário.");
      }
    }
    
    // Create or update the profile in Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        username: formData.name,
        role: formData.role,
        active: formData.active,
        access_level_id: selectedAccessLevel.id.toString()
      })
      .select()
      .single();
      
    if (profileError) {
      console.error('Erro ao criar/atualizar perfil:', profileError);
      throw new Error(profileError.message);
    }
    
    console.log("Created/updated profile:", profileData);
    
    // Add new user to local state
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      supabaseId: userId,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      accessLevelId: accessLevelIdNum,
      active: formData.active,
      assignedLocalities: formData.localities
    };
    
    setUsers([...users, newUser]);
    toast.success("Usuário adicionado com sucesso! Em um ambiente de produção, este usuário receberia um email de convite.");
  };

  return {
    handleSubmit
  };
};
