
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
    
    // Log estado de edição
    console.log("Modo de edição:", isEditMode, "ID do registro:", formData.recordId);
    
    if (isEditMode) {
      // Update existing record
      console.log("Atualizando registro existente com ID:", formData.recordId);
      console.log("Dados para atualização:", formData);
      
      saveSuccess = await updateVectorDataInSupabase(formData);
      
      if (saveSuccess) {
        // Se a atualização foi bem-sucedida, adicione o ID ao vectorData para consistência
        vectorData.id = formData.recordId;
        toast.success("Registro atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar o registro no banco de dados");
      }
    } else {
      // Create new record
      console.log("Criando novo registro");
      saveSuccess = await saveVectorDataToSupabase(formData);
      
      if (saveSuccess) {
        toast.success("Novo registro criado com sucesso!");
      } else {
        toast.error("Erro ao criar o registro no banco de dados");
      }
    }
    
    // If Supabase save fails, use local storage as fallback
    if (!saveSuccess) {
      console.log("Salvando em armazenamento local como backup");
      await saveVectorData([vectorData]);
      toast.warning('Dados salvos localmente como backup');
    }
  } catch (error: any) {
    console.error('Error processing vector data:', error);
    toast.error(`Erro ao salvar dados. Verifique sua conexão e tente novamente. ${error.message}`);
    
    // Fallback to localStorage
    await saveVectorData([vectorData]);
    toast.warning('Dados salvos localmente como backup');
  }
  
  // Generate summary from the data
  const summary = generateSummary(formData);
  
  return { vectorData, summary };
};
