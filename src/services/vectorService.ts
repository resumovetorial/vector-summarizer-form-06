
import { FormData } from "@/types/vectorForm";
import { format } from 'date-fns';
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Get saved vector data from localStorage ou Supabase
export const getSavedVectorData = async (): Promise<LocalityData[]> => {
  try {
    // Try to get data from Supabase first
    const { data, error } = await supabase
      .from('vector_data')
      .select('*');
    
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      // Fallback to localStorage
      const savedData = localStorage.getItem('vectorData');
      if (savedData) {
        return JSON.parse(savedData);
      }
      return [];
    }
    
    if (data && data.length > 0) {
      console.log("Data retrieved from Supabase:", data.length, "rows");
      // Convert Supabase data to LocalityData format
      return data.map((item) => ({
        municipality: item.municipality,
        locality: item.locality_id,
        cycle: item.cycle,
        epidemiologicalWeek: item.epidemiological_week,
        workModality: item.work_modality,
        startDate: item.start_date,
        endDate: item.end_date,
        totalProperties: item.total_properties,
        inspections: item.inspections,
        depositsEliminated: item.deposits_eliminated,
        depositsTreated: item.deposits_treated,
        supervisor: item.supervisor,
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
        total_dias_trabalhados: item.total_dias_trabalhados
      }));
    }
    
    // If no data in Supabase, fallback to localStorage
    const savedData = localStorage.getItem('vectorData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [];
  } catch (error) {
    console.error('Error fetching saved vector data:', error);
    // Fallback to localStorage
    const savedData = localStorage.getItem('vectorData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [];
  }
};

// Improved save vector data function with validation and error handling
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
            .insert([
              {
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
              }
            ]);
            
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

export const processVectorData = async (formData: FormData) => {
  // Simula o envio para o backend
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Convert form data to vector data format
  const vectorData: LocalityData = {
    municipality: formData.municipality,
    locality: formData.locality,
    cycle: formData.cycle,
    epidemiologicalWeek: formData.epidemiologicalWeek,
    workModality: formData.workModality,
    startDate: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : '',
    endDate: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : '',
    totalProperties: parseInt(formData.qt_total) || 0,
    inspections: parseInt(formData.inspecionados) || 0,
    depositsEliminated: parseInt(formData.depositos_eliminados) || 0,
    depositsTreated: parseInt(formData.quantidade_depositos_tratados) || 0,
    supervisor: formData.nome_supervisor,
    qt_residencias: parseInt(formData.qt_residencias) || 0,
    qt_comercio: parseInt(formData.qt_comercio) || 0,
    qt_terreno_baldio: parseInt(formData.qt_terreno_baldio) || 0,
    qt_pe: parseInt(formData.qt_pe) || 0,
    qt_outros: parseInt(formData.qt_outros) || 0,
    qt_total: parseInt(formData.qt_total) || 0,
    tratamento_focal: parseInt(formData.tratamento_focal) || 0,
    tratamento_perifocal: parseInt(formData.tratamento_perifocal) || 0,
    amostras_coletadas: parseInt(formData.amostras_coletadas) || 0,
    recusa: parseInt(formData.recusa) || 0,
    fechadas: parseInt(formData.fechadas) || 0,
    recuperadas: parseInt(formData.recuperadas) || 0,
    a1: parseInt(formData.a1) || 0,
    a2: parseInt(formData.a2) || 0,
    b: parseInt(formData.b) || 0,
    c: parseInt(formData.c) || 0,
    d1: parseInt(formData.d1) || 0,
    d2: parseInt(formData.d2) || 0,
    e: parseInt(formData.e) || 0,
    larvicida: formData.larvicida,
    quantidade_larvicida: parseInt(formData.quantidade_larvicida) || 0,
    quantidade_depositos_tratados: parseInt(formData.quantidade_depositos_tratados) || 0,
    adulticida: formData.adulticida,
    quantidade_cargas: parseInt(formData.quantidade_cargas) || 0,
    total_tec_saude: parseInt(formData.total_tec_saude) || 0,
    total_dias_trabalhados: parseInt(formData.total_dias_trabalhados) || 0
  };
  
  try {
    // Get user ID for the creator attribution
    const userData = await supabase.auth.getUser();
    const userId = userData.data.user?.id || 'anonymous';
    
    console.log("Inserindo dados no Supabase:", {
      municipality: vectorData.municipality,
      localityId: vectorData.locality,
      userId: userId,
      cycle: vectorData.cycle,
      epidemiologicalWeek: vectorData.epidemiologicalWeek
    });
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from('vector_data')
      .insert([
        {
          municipality: vectorData.municipality,
          locality_id: vectorData.locality,
          cycle: vectorData.cycle,
          epidemiological_week: vectorData.epidemiologicalWeek,
          work_modality: vectorData.workModality,
          start_date: vectorData.startDate,
          end_date: vectorData.endDate,
          total_properties: vectorData.totalProperties,
          inspections: vectorData.inspections,
          deposits_eliminated: vectorData.depositsEliminated,
          deposits_treated: vectorData.depositsTreated,
          supervisor: userId, // Use user ID as supervisor
          qt_residencias: vectorData.qt_residencias,
          qt_comercio: vectorData.qt_comercio,
          qt_terreno_baldio: vectorData.qt_terreno_baldio,
          qt_pe: vectorData.qt_pe,
          qt_outros: vectorData.qt_outros,
          qt_total: vectorData.qt_total,
          tratamento_focal: vectorData.tratamento_focal,
          tratamento_perifocal: vectorData.tratamento_perifocal,
          amostras_coletadas: vectorData.amostras_coletadas,
          recusa: vectorData.recusa,
          fechadas: vectorData.fechadas,
          recuperadas: vectorData.recuperadas,
          a1: vectorData.a1,
          a2: vectorData.a2,
          b: vectorData.b,
          c: vectorData.c,
          d1: vectorData.d1,
          d2: vectorData.d2,
          e: vectorData.e,
          larvicida: vectorData.larvicida,
          quantidade_larvicida: vectorData.quantidade_larvicida,
          quantidade_depositos_tratados: vectorData.quantidade_depositos_tratados,
          adulticida: vectorData.adulticida,
          quantidade_cargas: vectorData.quantidade_cargas,
          total_tec_saude: vectorData.total_tec_saude,
          total_dias_trabalhados: vectorData.total_dias_trabalhados,
          created_by: userId
        }
      ])
      .select();
    
    if (error) {
      console.error('Erro ao inserir dados no Supabase:', error);
      toast.error(`Erro ao salvar no banco de dados: ${error.message}`);
      
      // Fallback to localStorage
      const existingData = await getSavedVectorData();
      const updatedData = [...existingData, vectorData];
      await saveVectorData(updatedData);
      
      toast.warning('Dados salvos localmente devido a erro de conexão');
    } else {
      console.log('Dados inseridos com sucesso no Supabase:', data);
      toast.success('Dados salvos com sucesso no banco de dados');
      
      // Also save to localStorage for redundancy
      const existingData = await getSavedVectorData();
      const updatedData = [...existingData, vectorData];
      await saveVectorData(updatedData);
    }
  } catch (error) {
    console.error('Erro na operação do Supabase:', error);
    toast.error('Erro ao salvar os dados');
    
    // Fallback to localStorage
    const existingData = await getSavedVectorData();
    const updatedData = [...existingData, vectorData];
    await saveVectorData(updatedData);
    
    toast.warning('Dados salvos localmente devido a erro');
  }
  
  // Generate summary from vector data
  const summary = `Resumo para ${formData.municipality}, ${formData.locality}, durante o ciclo ${formData.cycle} (semana epidemiológica ${formData.epidemiologicalWeek}). Período: ${formData.startDate ? format(formData.startDate, 'dd/MM/yyyy') : 'N/A'} a ${formData.endDate ? format(formData.endDate, 'dd/MM/yyyy') : 'N/A'}. Total de imóveis: ${formData.qt_total}. Depósitos eliminados: ${formData.depositos_eliminados || 0}. Depósitos tratados: ${formData.quantidade_depositos_tratados || 0}. Supervisor: ${formData.nome_supervisor || 'N/A'}.`;
  
  return { vectorData, summary };
};
