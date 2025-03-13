
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
      toast.error('Error saving data locally');
      return false;
    }
    
    // Try to sync with Supabase if we have data to save
    if (data.length > 0) {
      try {
        console.log('Attempting to sync with Supabase...');
        const syncResult = await syncDataWithSupabase(data);
        
        if (syncResult) {
          toast.success('Data synchronized successfully');
          return true;
        } else {
          toast.warning('Data saved locally, but could not be synchronized with the server');
        }
      } catch (syncError) {
        console.error('Error syncing with Supabase, but data was saved locally:', syncError);
        toast.warning('Data saved locally, but could not be synchronized with the server');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in vector data save operation:', error);
    toast.error('Error saving data');
    return false;
  }
};
