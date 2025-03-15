
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { saveToLocalStorage } from './vector/vectorLocalStorage';
import { syncDataWithSupabase } from './vector/vectorDataSync';

/**
 * Saves vector data to localStorage and attempts to sync with Supabase
 * @param data The vector data to save
 * @returns True if at least one save operation was successful
 */
export const saveVectorData = async (data: LocalityData[]): Promise<boolean> => {
  try {
    // Save to localStorage first as a fallback
    const localSaveSuccess = await saveToLocalStorage(data);
    
    if (!localSaveSuccess) {
      toast.error('Erro ao salvar dados localmente');
      return false;
    }
    
    // Try to sync with Supabase if we have data to save
    if (data.length > 0) {
      try {
        console.log('Tentando sincronizar com o Supabase...');
        const syncResult = await syncDataWithSupabase(data);
        
        if (syncResult) {
          toast.success('Dados sincronizados com o servidor com sucesso');
          return true;
        } else {
          toast.warning('Dados salvos localmente, mas não foi possível sincronizar com o servidor');
        }
      } catch (syncError) {
        console.error('Erro ao sincronizar com o Supabase, mas os dados foram salvos localmente:', syncError);
        toast.warning('Dados salvos localmente, mas não foi possível sincronizar com o servidor');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro na operação de salvamento de dados:', error);
    toast.error('Erro ao salvar dados');
    return false;
  }
};
