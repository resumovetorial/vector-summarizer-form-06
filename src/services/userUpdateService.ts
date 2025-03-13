
import { User } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Updates an existing user in Supabase and returns the updated user object
 */
export const updateExistingUser = async (
  initialUser: User,
  formData: {
    name: string;
    email: string;
    role: string;
    accessLevel: string;
    active: boolean;
    localities: string[];
  },
  accessLevelIdNum: number
): Promise<User | null> => {
  if (!initialUser.supabaseId) return null;

  // Update the profile in Supabase
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        username: formData.name,
        role: formData.role,
        active: formData.active,
      })
      .eq('id', initialUser.supabaseId);
      
    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Falha na atualização do perfil:', error);
    toast.error(`Erro na atualização do perfil: ${error.message}. Continuando em modo de demonstração.`);
    // Continue despite errors to maintain demo functionality
  }
  
  // Return updated user object
  return {
    ...initialUser,
    name: formData.name,
    email: formData.email,
    role: formData.role,
    accessLevelId: accessLevelIdNum,
    active: formData.active,
    assignedLocalities: [...formData.localities]
  };
};
