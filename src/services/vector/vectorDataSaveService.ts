
import { FormData } from "@/types/vectorForm";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { findOrCreateLocality } from '../localities/localityManager';
import { formatDataForSupabase } from './vectorDataFormatter';

/**
 * Saves vector data to Supabase
 * @param formData The form data to save
 * @returns True if save was successful, false otherwise
 */
export const saveVectorDataToSupabase = async (formData: FormData): Promise<boolean> => {
  try {
    // Get or create locality
    const localityId = await findOrCreateLocality(formData.locality);
    
    if (!localityId) {
      throw new Error("Failed to process locality after multiple attempts");
    }
    
    // Ensure that dates are available
    if (!formData.startDate || !formData.endDate) {
      throw new Error('Start and end dates are required');
    }
    
    // Format data for insertion
    const insertData = formatDataForSupabase(formData, localityId);
    
    console.log("Data for insertion:", insertData);
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from('vector_data')
      .insert([insertData]);
    
    if (error) {
      console.error('Error inserting data into Supabase:', error);
      throw error;
    }
    
    console.log('Data successfully inserted into Supabase:', data);
    toast.success('Data saved successfully to the database');
    return true;
    
  } catch (error: any) {
    console.error('Error in Supabase operation:', error);
    toast.error(`Error saving the data. Check your connection and try again.`);
    return false;
  }
};
