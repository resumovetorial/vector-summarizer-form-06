
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Save vector data to localStorage and Supabase
export const saveVectorData = async (data: LocalityData[]): Promise<boolean> => {
  try {
    // Validate data before saving
    if (!Array.isArray(data)) {
      console.error('Invalid data format: expected array');
      toast.error('Erro ao salvar os dados: formato inválido');
      return false;
    }
    
    // Check if there are any items in the array
    if (data.length === 0) {
      console.warn('Saving empty data array');
    }
    
    // Save to localStorage for compatibility
    const dataString = JSON.stringify(data);
    localStorage.setItem('vectorData', dataString);
    
    console.log('Vector data saved to localStorage:', data);
    
    // Also attempt to save to Supabase if not already saved
    await syncDataWithSupabase(data);
    
    return true;
  } catch (error) {
    console.error('Error saving vector data:', error);
    
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      toast.error('Não foi possível salvar os dados: espaço de armazenamento excedido');
    } else {
      toast.error('Erro ao salvar os dados');
    }
    
    return false;
  }
};

// Helper function to sync data with Supabase
const syncDataWithSupabase = async (data: LocalityData[]): Promise<void> => {
  for (const item of data) {
    try {
      // Check if this record already exists in Supabase
      const { data: existingData, error: checkError } = await supabase
        .from('vector_data')
        .select('id')
        .eq('locality_id', item.locality)
        .eq('cycle', item.cycle)
        .eq('epidemiological_week', item.epidemiologicalWeek);
        
      if (checkError) {
        console.error('Error checking for existing data:', checkError);
        continue;
      }
      
      // If record doesn't exist, insert it
      if (!existingData || existingData.length === 0) {
        const userData = await supabase.auth.getUser();
        const userId = userData.data.user?.id || 'anonymous';
        
        const { error } = await supabase
          .from('vector_data')
          .insert([mapLocalityDataToSupabaseFormat(item, userId)]);
          
        if (error) {
          console.error('Error inserting data to Supabase:', error);
        } else {
          console.log('Data successfully inserted to Supabase');
        }
      }
    } catch (error) {
      console.error('Error synchronizing data with Supabase:', error);
    }
  }
};

// Helper function to map LocalityData to Supabase format
const mapLocalityDataToSupabaseFormat = (item: LocalityData, userId: string) => {
  return {
    municipality: item.municipality,
    locality_id: item.locality,
    cycle: item.cycle,
    epidemiological_week: item.epidemiologicalWeek,
    work_modality: item.workModality,
    start_date: item.startDate,
    end_date: item.endDate,
    total_properties: item.totalProperties,
    inspections: item.inspections,
    deposits_eliminated: item.depositsEliminated,
    deposits_treated: item.depositsTreated,
    supervisor: userId,
    qt_residencias: item.qt_residencias,
    qt_comercio: item.qt_comercio,
    qt_terreno_baldio: item.qt_terreno_baldio,
    qt_pe: item.qt_pe,
    qt_outros: item.qt_outros,
    qt_total: item.qt_total,
    tratamento_focal: item.tratamento_focal,
    tratamento_perifocal: item.tratamento_perifocal,
    amostras_coletadas: item.amostras_coletadas,
    recusa: item.recusa,
    fechadas: item.fechadas,
    recuperadas: item.recuperadas,
    a1: item.a1,
    a2: item.a2,
    b: item.b,
    c: item.c,
    d1: item.d1,
    d2: item.d2,
    e: item.e,
    larvicida: item.larvicida,
    quantidade_larvicida: item.quantidade_larvicida,
    quantidade_depositos_tratados: item.quantidade_depositos_tratados,
    adulticida: item.adulticida,
    quantidade_cargas: item.quantidade_cargas,
    total_tec_saude: item.total_tec_saude,
    total_dias_trabalhados: item.total_dias_trabalhados,
    created_by: userId
  };
};
