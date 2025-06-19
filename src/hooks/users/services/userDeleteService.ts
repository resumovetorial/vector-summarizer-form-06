
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const deleteUser = async (userId: number, supabaseId?: string): Promise<boolean> => {
  if (!supabaseId) {
    toast.error("Este usuário não pode ser excluído");
    return false;
  }

  try {
    // Primeiro, excluir o acesso às localidades
    const { error: localityAccessError } = await supabase
      .from('locality_access')
      .delete()
      .eq('user_id', supabaseId);
      
    if (localityAccessError) {
      console.error('Erro ao excluir acesso às localidades:', localityAccessError);
    }
    
    // Depois, excluir o perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', supabaseId);
      
    if (profileError) {
      console.error('Erro ao excluir perfil:', profileError);
      toast.error(`Erro ao excluir usuário: ${profileError.message}`);
      return false;
    }
    
    toast.success("Usuário removido com sucesso!");
    return true;
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error);
    toast.error(`Erro ao excluir usuário: ${error.message}`);
    return false;
  }
};
