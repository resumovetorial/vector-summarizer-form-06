
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
      .insert([dataToInsert]);
    
    if (error) {
      console.error('Erro ao inserir dados no Supabase:', error);
      throw error;
    }
    
    console.log('Dados inseridos com sucesso no Supabase:', data);
    toast.success('Dados salvos com sucesso no banco de dados');
    return true;
    
  } catch (error: any) {
    console.error('Erro na operação do Supabase:', error);
    toast.error(`Erro ao salvar os dados. Verifique sua conexão e tente novamente.`);
    return false;
  }
};
