
import { FormData } from "@/types/vectorForm";
import { supabase } from '@/integrations/supabase/client';
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
      throw new Error("Falha ao processar localidade após múltiplas tentativas");
    }
    
    // Ensure that dates are available
    if (!formData.startDate || !formData.endDate) {
      throw new Error('Datas de início e fim são obrigatórias');
    }
    
    // Format data for insertion
    const insertData = formatDataForSupabase(formData, localityId);
    
    console.log("Dados preparados para inserção:", insertData);
    
    // Get current user for supervisor and created_by field
    const { data: { user } } = await supabase.auth.getUser();

    // Create a new object with all insertData properties plus supervisor and created_by
    const dataToInsert = {
      ...insertData,
      supervisor: user?.id || null,
      created_by: user?.id || null
    };
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from('vector_data')
      .insert([dataToInsert])
      .select();
    
    if (error) {
      console.error('Erro ao inserir dados no Supabase:', error);
      throw error;
    }
    
    console.log('Dados inseridos com sucesso no Supabase:', data);
    toast.success('Dados salvos com sucesso no banco de dados');
    return true;
    
  } catch (error: any) {
    console.error('Erro na operação do Supabase:', error);
    toast.error(`Erro ao salvar os dados: ${error.message}`);
    return false;
  }
};

/**
 * Updates existing vector data in Supabase
 * @param formData The form data to update
 * @returns True if update was successful, false otherwise
 */
export const updateVectorDataInSupabase = async (formData: FormData): Promise<boolean> => {
  try {
    if (!formData.recordId) {
      throw new Error("ID do registro não fornecido para atualização");
    }
    
    console.log("Atualizando registro com ID:", formData.recordId);
    
    // Get or create locality
    const localityId = await findOrCreateLocality(formData.locality);
    
    if (!localityId) {
      throw new Error("Falha ao processar localidade após múltiplas tentativas");
    }
    
    // Ensure that dates are available
    if (!formData.startDate || !formData.endDate) {
      throw new Error('Datas de início e fim são obrigatórias');
    }
    
    // Format data for update
    const updateData = formatDataForSupabase(formData, localityId);
    
    console.log("Dados preparados para atualização:", updateData);
    
    // Get current user for updating supervisor field if not provided
    const { data: { user } } = await supabase.auth.getUser();

    // Create a new object with all updateData properties plus supervisor
    const dataToUpdate = {
      ...updateData,
      supervisor: formData.nome_supervisor || user?.id || null,
      updated_at: new Date().toISOString()
    };
    
    // Remove empty, undefined or null fields to avoid unwanted replacements
    Object.keys(dataToUpdate).forEach(key => {
      if (dataToUpdate[key] === undefined || dataToUpdate[key] === '' || dataToUpdate[key] === null) {
        delete dataToUpdate[key];
      }
    });

    console.log("Dados finais para atualização:", dataToUpdate);
    
    // Update data in Supabase
    const { data, error } = await supabase
      .from('vector_data')
      .update(dataToUpdate)
      .eq('id', formData.recordId)
      .select();
    
    if (error) {
      console.error('Erro ao atualizar dados no Supabase:', error);
      throw error;
    }
    
    console.log('Dados atualizados com sucesso no Supabase:', data);
    
    // Force a small pause to ensure operations are completed
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('Dados atualizados com sucesso!');
    return true;
    
  } catch (error: any) {
    console.error('Erro na operação de atualização do Supabase:', error);
    toast.error(`Erro ao atualizar os dados: ${error.message}`);
    return false;
  }
};

// Function to fetch data for a specific record by ID
export const fetchVectorDataById = async (recordId: string) => {
  try {
    console.log("Buscando registro com ID:", recordId);
    
    const { data, error } = await supabase
      .from('vector_data')
      .select(`
        *,
        localities(name)
      `)
      .eq('id', recordId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar dados do registro:', error);
      throw error;
    }
    
    console.log('Dados do registro obtidos com sucesso:', data);
    return data;
    
  } catch (error) {
    console.error('Erro ao buscar dados do registro:', error);
    return null;
  }
};
