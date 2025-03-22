
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkUserExists } from './userValidator';
import { createAuthUser } from './authUserCreator';
import { createOrUpdateProfile } from './profileManager';
import { assignLocalityAccess } from './localityAccessManager';

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
  console.log("Iniciando criação de usuário com dados:", formData);
  
  try {
    // First check if user with this email already exists
    await checkUserExists(formData.email);
    
    // Create auth user and get ID
    const userId = await createAuthUser(formData.email, formData.name);
    
    // Get access level UUID
    const accessLevelUuid = await getAccessLevelUuid(accessLevelIdNum);
    
    // Create or update profile
    await createOrUpdateProfile(userId, formData, accessLevelUuid);
    
    // Assign localities if any
    if (formData.localities && formData.localities.length > 0) {
      await assignLocalityAccess(userId, formData.localities);
    }
    
    // Create user object for the state
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: newUserId,
      supabaseId: userId,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      accessLevelId: accessLevelIdNum,
      active: formData.active,
      assignedLocalities: formData.localities
    };
    
    console.log("Usuário criado com sucesso:", newUser);
    toast.success("Usuário adicionado com sucesso! Em um ambiente de produção, este usuário receberia um email de convite.");
    
    return { userId, newUser };
  } catch (error: any) {
    console.error('Erro completo ao criar usuário:', error);
    throw error;
  }
};

/**
 * Gets the UUID of the access level from the database based on numeric ID
 */
const getAccessLevelUuid = async (accessLevelIdNum: number): Promise<string | null> => {
  let accessLevelUuid: string | null = null;
  
  try {
    // Listar todos os níveis e procurar pelo ID numérico
    const { data: allLevels, error: allLevelsError } = await supabase
      .from('access_levels')
      .select('id, name')
      .order('created_at', { ascending: true });
    
    if (!allLevelsError && allLevels && allLevels.length > 0) {
      console.log("Níveis de acesso disponíveis:", allLevels);
      console.log("Buscando nível de acesso com ID numérico:", accessLevelIdNum);
      
      // Tentar encontrar pelo índice (já que IDs parecem ser sequenciais)
      if (accessLevelIdNum > 0 && accessLevelIdNum <= allLevels.length) {
        accessLevelUuid = allLevels[accessLevelIdNum - 1].id;
        console.log(`Usando nível de acesso na posição ${accessLevelIdNum-1}: ${accessLevelUuid}`);
      } else {
        // Se não encontrar, usar o primeiro
        accessLevelUuid = allLevels[0].id;
        console.log(`Nível de acesso não encontrado, usando o primeiro: ${accessLevelUuid}`);
      }
    } else {
      console.warn('Nenhum nível de acesso encontrado ou erro:', allLevelsError);
    }
  } catch (err) {
    console.error('Erro ao buscar nível de acesso:', err);
  }
  
  console.log('UUID do nível de acesso para o perfil:', accessLevelUuid);
  return accessLevelUuid;
};
