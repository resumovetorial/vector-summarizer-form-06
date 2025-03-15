
import { FormData } from "@/types/vectorForm";
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { saveVectorData } from './vectorDataSaver';
import { formatFormToVectorData, generateSummary } from './vector/vectorDataFormatter';
import { saveVectorDataToSupabase, updateVectorDataInSupabase } from './vector/vectorDataSaveService';

export const processVectorData = async (formData: FormData) => {
  console.log("Starting form data processing:", formData);
  
  // Convert form data to vector data format
  const vectorData: LocalityData = formatFormToVectorData(formData);
  
  try {
    // Validate required fields
    if (!formData.municipality || !formData.locality || !formData.cycle || 
        !formData.epidemiologicalWeek || !formData.workModality || 
        !formData.startDate || !formData.endDate) {
      throw new Error("All required fields must be filled");
    }
    
    // Check if we're in edit mode (record ID exists)
    const isEditMode = !!formData.recordId;
    let saveSuccess = false;
    
    if (isEditMode) {
      // Update existing record
      console.log("Updating existing record with ID:", formData.recordId);
      saveSuccess = await updateVectorDataInSupabase(formData);
      
      if (saveSuccess) {
        // Se a atualização foi bem-sucedida, adicione o ID ao vectorData para consistência
        vectorData.id = formData.recordId;
      }
    } else {
      // Create new record
      saveSuccess = await saveVectorDataToSupabase(formData);
    }
    
    // If Supabase save fails, use local storage as fallback
    if (!saveSuccess) {
      await saveVectorData([vectorData]);
      toast.warning('Data saved locally as backup');
    }
  } catch (error: any) {
    console.error('Error processing vector data:', error);
    toast.error('Error saving data. Check your connection and try again.');
    
    // Fallback to localStorage
    await saveVectorData([vectorData]);
    toast.warning('Data saved locally as backup');
  }
  
  // Generate summary from the data
  const summary = generateSummary(formData);
  
  return { vectorData, summary };
};
