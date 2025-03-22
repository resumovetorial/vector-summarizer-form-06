
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Creates an auth user via RPC function or falls back to a demo user ID
 * @returns The user ID (either real or demo)
 */
export const createAuthUser = async (email: string, name: string): Promise<string> => {
  let userId: string;
  
  try {
    // Create a real auth user via the RPC function
    const { data, error } = await supabase.rpc('create_demo_user', {
      user_email: email,
      user_password: 'password123', // Demo password, would be random in production
      user_data: { name: name }
    });
    
    if (error) {
      console.error("Não foi possível criar usuário via RPC:", error);
      
      // Em modo de demonstração, criar um ID simulado para permitir continuar
      userId = crypto.randomUUID();
      console.log("Modo de demonstração: usando ID temporário:", userId);
      toast.warning("No modo de demonstração, os usuários seriam convidados por email. Simulando criação de usuário com ID temporário.");
    } else {
      userId = data;
      console.log("Usuário criado com ID:", userId);
      
      if (!userId) {
        // Fallback para ID simulado
        userId = crypto.randomUUID();
        console.log("ID nulo retornado, usando ID temporário:", userId);
      }
    }
  } catch (error: any) {
    console.error("Erro na criação do usuário:", error);
    // Em modo de demonstração, criar um ID simulado para permitir continuar
    userId = crypto.randomUUID();
    console.log("Modo de demonstração devido a erro:", error.message);
    console.log("Usando ID temporário:", userId);
  }
  
  return userId;
};
