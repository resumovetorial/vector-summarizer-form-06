
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Attempts to find a locality by name or create it if it doesn't exist
 * @param localityName The name of the locality to find or create
 * @returns The locality ID if found or created, null otherwise
 */
export const findOrCreateLocality = async (localityName: string): Promise<string | null> => {
  if (!localityName) {
    console.error("Locality name cannot be empty");
    return null;
  }

  console.log("Searching for locality:", localityName);
  let localityId = null;
  let maxRetries = 3;
  let retryCount = 0;
  
  while (localityId === null && retryCount < maxRetries) {
    try {
      // First, try to find the locality by name
      const { data: existingLocalities, error: searchError } = await supabase
        .from('localities')
        .select('id')
        .eq('name', localityName);
      
      console.log("Locality search result:", existingLocalities, searchError);
      
      if (searchError) {
        console.error("Error searching for locality:", searchError);
        throw searchError;
      }
      
      // If we found the locality, use its ID
      if (existingLocalities && existingLocalities.length > 0) {
        localityId = existingLocalities[0].id;
        console.log("Found existing locality with ID:", localityId);
      } else {
        // If not found, create a new locality
        console.log("Locality not found, creating new one:", localityName);
        
        const { data: newLocality, error: insertError } = await supabase
          .from('localities')
          .insert([{ name: localityName }])
          .select('id');
        
        if (insertError) {
          console.error("Error creating locality:", insertError);
          throw insertError;
        }
        
        if (newLocality && newLocality.length > 0) {
          localityId = newLocality[0].id;
          console.log("New locality created with ID:", localityId);
        } else {
          throw new Error("Failed to create locality: no return data");
        }
      }
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed:`, error);
      retryCount++;
      
      // Small delay between retry attempts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  if (localityId === null) {
    console.error("Could not obtain or create locality ID after multiple attempts");
    toast.error("Erro ao processar localidade");
  }
  
  return localityId;
};
