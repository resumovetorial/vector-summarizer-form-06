
import { User } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Creates a new user in Supabase and returns the user object
 */
export const createNewUser = async (
  formData: {
    name: string;
    email: string;
    role: string;
    accessLevel: string;
    active: boolean;
    localities: string[];
  },
  accessLevelIdNum: number,
  users: User[]
): Promise<{ userId: string; newUser: User }> => {
  // First check if user with this email already exists
  const { data: existingUsers, error: searchError } = await supabase
    .from('profiles')
    .select('id, username')
    .ilike('username', formData.email)
    .limit(1);
    
  if (searchError) {
    console.error('Erro ao verificar existência do usuário:', searchError);
    // Continue without throwing to maintain demo functionality
    console.warn("Continuing in demo mode despite search error");
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
  // Note: This will likely fail in demo mode due to RLS, which is expected
  // We'll catch the error and continue with client-side only changes
  let profileCreated = false;
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        username: formData.name,
        role: formData.role,
        active: formData.active,
      }, {
        onConflict: 'id'
      });
      
    if (profileError) {
      console.error('Erro ao criar/atualizar perfil:', profileError);
      throw new Error(profileError.message);
    }
    
    profileCreated = true;
    console.log("Created/updated profile successfully");
  } catch (error: any) {
    console.error('Erro na operação de upsert do perfil:', error);
    // Continue with the flow despite the error to maintain demo functionality
    toast.error(`Erro na criação do perfil no Supabase: ${error.message}. Continuando em modo de demonstração.`);
  }
  
  // Create new user object for client-side state
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
  
  if (profileCreated) {
    toast.success("Usuário criado com sucesso!");
  } else {
    toast.info("Usuário criado em modo de demonstração apenas.");
  }
  
  return { userId, newUser };
};
