
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
      throw new Error("Todos os campos obrigatórios precisam ser preenchidos");
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
      
      // Verificar explicitamente se o ID existe antes de tentar atualizar
      if (!formData.recordId) {
        throw new Error("ID do registro não fornecido para edição");
      }
      
      // Garantir que todos os valores numéricos sejam válidos
      const preparedFormData = { ...formData };
      
      // Converter campos vazios para zero
      const numericFields = ['qt_residencias', 'qt_comercio', 'qt_terreno_baldio', 'qt_pe', 
                           'qt_outros', 'qt_total', 'tratamento_focal', 'tratamento_perifocal',
                           'inspecionados', 'amostras_coletadas', 'recusa', 'fechadas', 
                           'recuperadas', 'a1', 'a2', 'b', 'c', 'd1', 'd2', 'e',
                           'depositos_eliminados', 'quantidade_larvicida', 
                           'quantidade_depositos_tratados', 'quantidade_cargas',
                           'total_tec_saude', 'total_dias_trabalhados'];
      
      numericFields.forEach(field => {
        if (preparedFormData[field] === '' || preparedFormData[field] === undefined) {
          preparedFormData[field] = '0';
        }
      });
      
      saveSuccess = await updateVectorDataInSupabase(preparedFormData);
      
      if (saveSuccess) {
        // Se a atualização foi bem-sucedida, adicione o ID ao vectorData para consistência
        vectorData.id = formData.recordId;
      } else {
        console.error("Falha ao atualizar registro no Supabase");
      }
    } else {
      // Create new record
      console.log("Criando novo registro");
      saveSuccess = await saveVectorDataToSupabase(formData);
    }
    
    // If Supabase save fails, use local storage as fallback
    if (!saveSuccess) {
      console.log("Salvando em armazenamento local como backup");
      await saveVectorData([vectorData]);
      toast.warning('Dados salvos localmente como backup');
    }
  } catch (error: any) {
    console.error('Erro ao processar dados do vetor:', error);
    toast.error(`Erro ao salvar dados. Verifique os campos e tente novamente. ${error.message}`);
    
    // Fallback to localStorage
    await saveVectorData([vectorData]);
    toast.warning('Dados salvos localmente como backup');
  }
  
  // Generate summary from the data
  const summary = generateSummary(formData);
  
  return { vectorData, summary };
};
