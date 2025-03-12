
import { User } from '@/types/admin';
import { supabase } from '@/lib/supabase';

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
  const { error } = await supabase
    .from('profiles')
    .update({ 
      username: formData.name,
      role: formData.role,
      active: formData.active,
      access_level_id: accessLevelIdNum.toString() // Store as string in Supabase
    })
    .eq('id', initialUser.supabaseId);
    
  if (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error(error.message);
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
