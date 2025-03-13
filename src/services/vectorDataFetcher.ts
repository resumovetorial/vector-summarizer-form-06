
import { LocalityData } from "@/types/dashboard";
import { getLocalVectorData } from './vector/vectorLocalStorageFetcher';
import { fetchVectorDataFromSupabase } from './vector/vectorSupabaseFetcher';

/**
 * Gets saved vector data from Supabase or local storage as fallback
 * @returns Promise resolving to array of locality data
 */
export const getSavedVectorData = async (): Promise<LocalityData[]> => {
  try {
    // Try to get data from Supabase first
    const supabaseData = await fetchVectorDataFromSupabase();
    
    // If Supabase data exists, return it
    if (supabaseData && supabaseData.length > 0) {
      return supabaseData;
    }
    
    // If no Supabase data or error occurred, fall back to local storage
    return getLocalVectorData();
  } catch (error) {
    console.error('Erro ao buscar dados vetoriais salvos:', error);
    // Fall back to local storage in case of any error
    return getLocalVectorData();
  }
};
