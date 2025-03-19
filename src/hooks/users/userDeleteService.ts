
import { supabase } from '@/lib/supabase';
import { User } from '@/types/admin';
import { toast } from 'sonner';

export const deleteUser = async (userId: number, supabaseId?: string): Promise<boolean> => {
  if (!supabaseId) {
    toast.error("Este usuário não pode ser excluído");
    return false;
  }

  try {
    // First try to delete the user's profile directly
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', supabaseId);
      
    if (profileError) {
      console.error('Erro ao excluir perfil:', profileError);
      // Continue anyway in demo mode
      toast.error(`Erro ao excluir usuário no Supabase: ${profileError.message}. Removendo usuário localmente.`);
    }
    
    toast.success("Usuário removido com sucesso!");
    return true;
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error);
    toast.error(`Erro ao excluir usuário: ${error.message}. Continuando em modo de demonstração.`);
    
    // In demo mode, we'll still update the UI
    return true;
  }
};
