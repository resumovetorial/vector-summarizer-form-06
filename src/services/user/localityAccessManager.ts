
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Assigns localities to a user
 */
export const assignLocalityAccess = async (userId: string, localities: string[]): Promise<boolean> => {
  console.log("Atribuindo localidades para usuário:", userId, localities);
  
  if (!localities || localities.length === 0) {
    console.log("Nenhuma localidade para atribuir");
    return true; // Consider it a success since there's nothing to do
  }
  
  try {
    // Get all localities to map names to IDs
    const { data: allLocalities, error: allLocalitiesError } = await supabase
      .from('localities')
      .select('id, name');
    
    if (allLocalitiesError) {
      console.error('Erro ao buscar todas as localidades:', allLocalitiesError);
      toast.error("Erro ao buscar localidades. Algumas localidades podem não ser atribuídas.");
      return false;
    }
    
    if (!allLocalities || allLocalities.length === 0) {
      console.error('Nenhuma localidade encontrada no banco de dados');
      toast.error("Nenhuma localidade encontrada no sistema.");
      return false;
    }
    
    // Create a map of locality names to IDs
    const localityMap = new Map();
    allLocalities.forEach(loc => {
      localityMap.set(loc.name, loc.id);
    });
    
    // Get locality IDs from the names
    const localityIds = localities
      .map(name => localityMap.get(name))
      .filter(id => id !== undefined);
    
    if (localityIds.length === 0) {
      console.error('Nenhuma localidade válida encontrada para atribuir');
      toast.error("Nenhuma das localidades selecionadas foi encontrada no sistema.");
      return false;
    }
    
    console.log("IDs das localidades a serem atribuídas:", localityIds);
    
    // Use the RPC function to assign localities
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'assign_user_localities',
      {
        p_user_id: userId,
        p_locality_ids: localityIds
      }
    );
    
    if (rpcError) {
      console.error("Erro ao atribuir localidades via RPC:", rpcError);
      
      // Try direct insert as fallback
      console.log("Tentando inserção direta como fallback...");
      
      // First, try to delete existing assignments
      await supabase
        .from('locality_access')
        .delete()
        .eq('user_id', userId);
      
      // Create batch insert data
      const localityAccessData = localityIds.map(localityId => ({
        user_id: userId,
        locality_id: localityId
      }));
      
      // Try direct insert
      const { error: insertError } = await supabase
        .from('locality_access')
        .insert(localityAccessData);
      
      if (insertError) {
        console.error("Erro ao atribuir localidades via inserção direta:", insertError);
        toast.error(`Erro ao atribuir localidades: ${insertError.message}`);
        return false;
      }
      
      console.log("Localidades atribuídas com sucesso via inserção direta:", localityAccessData);
      toast.success("Localidades atribuídas com sucesso!");
      return true;
    }
    
    console.log("Localidades atribuídas com sucesso via RPC:", rpcResult);
    toast.success("Localidades atribuídas com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro inesperado ao atribuir localidades:", error);
    toast.error("Erro inesperado ao atribuir localidades. Tente novamente mais tarde.");
    return false;
  }
};
