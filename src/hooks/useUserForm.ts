
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
    if (!formName || !formEmail || !formRole || !formAccessLevel) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);
    
    try {
      // Parse the access level ID to a number
      const accessLevelIdNum = parseInt(formAccessLevel);
      
      // Find the actual access level object by ID
      const selectedAccessLevel = accessLevels.find(level => level.id === accessLevelIdNum);
      
      if (!selectedAccessLevel) {
        throw new Error("Nível de acesso selecionado não é válido");
      }
      
      console.log("Selected user:", initialUser);
      console.log("Selected access level:", selectedAccessLevel);
      console.log("Form access level ID:", accessLevelIdNum);
      
      if (isEditMode && initialUser) {
        // Update existing user
        if (initialUser.supabaseId) {
          // Update the profile in Supabase
          const { error } = await supabase
            .from('profiles')
            .update({ 
              username: formName,
              role: formRole,
              active: formActive,
              access_level_id: selectedAccessLevel.id.toString() // Use the correct ID format for Supabase
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
        // Create new user in Supabase Auth (in a real app, this would typically be 
        // done through registration and invitation flows, but we'll simulate it here)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formEmail,
          password: Math.random().toString(36).slice(-8), // Generate random password
          email_confirm: true
        });

        if (authError) {
          // If user already exists, we'll just create/update the profile
          if (!authError.message.includes("already exists")) {
            console.error('Erro ao criar usuário:', authError);
            throw new Error(authError.message);
          }
        }
        
        // Get the user's ID if created, or find existing user
        let userId: string;
        if (authData?.user) {
          userId = authData.user.id;
        } else {
          // Try to find user by email
          const { data: existingUser, error: lookupError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', formEmail)
            .single();
            
          if (lookupError || !existingUser) {
            throw new Error("Não foi possível encontrar ou criar o usuário");
          }
          
          userId = existingUser.id;
        }
        
        // Update or create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: userId,
            username: formName,
            role: formRole,
            active: formActive,
            access_level_id: selectedAccessLevel.id.toString()
          });
          
        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          throw new Error(profileError.message);
        }
        
        // Add new user to local state
        const newUser: User = {
          id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
          supabaseId: userId,
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
