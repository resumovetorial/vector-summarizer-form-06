
import { FormData } from "@/types/vectorForm";
import { format } from 'date-fns';
import { LocalityData } from "@/types/dashboard";
import { toast } from "sonner";

// Get saved vector data from localStorage
export const getSavedVectorData = (): LocalityData[] => {
  try {
    const savedData = localStorage.getItem('vectorData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [];
  } catch (error) {
    console.error('Error fetching saved vector data:', error);
    return [];
  }
};

// Improved save vector data function with validation and error handling
export const saveVectorData = (data: LocalityData[]): boolean => {
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
    
    // Compress data if it's very large
    const dataString = JSON.stringify(data);
    if (dataString.length > 5000000) { // ~5MB
      console.warn('Large data size detected. Consider implementing pagination or data pruning.');
    }
    
    localStorage.setItem('vectorData', dataString);
    console.log('Vector data saved successfully:', data);
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
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 1500));
  
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
  
  // Get existing data
  const existingData = getSavedVectorData();
  
  // Check for duplicates (same locality, cycle, date range)
  const isDuplicate = existingData.some(item => 
    item.locality === vectorData.locality && 
    item.cycle === vectorData.cycle &&
    item.startDate === vectorData.startDate &&
    item.endDate === vectorData.endDate
  );
  
  if (isDuplicate) {
    console.warn('Duplicate data detected');
    toast.warning('Atenção: Dados similares já existem no sistema');
  }
  
  // Add new data to existing data
  const updatedData = [...existingData, vectorData];
  
  // Save the updated data
  const saveSuccess = saveVectorData(updatedData);
  console.log('Save success:', saveSuccess, 'Updated data:', updatedData);
  
  // Generate summary from vector data
  const summary = `Resumo para ${formData.municipality}, ${formData.locality}, durante o ciclo ${formData.cycle} (semana epidemiológica ${formData.epidemiologicalWeek}). Período: ${formData.startDate ? format(formData.startDate, 'dd/MM/yyyy') : 'N/A'} a ${formData.endDate ? format(formData.endDate, 'dd/MM/yyyy') : 'N/A'}. Total de imóveis: ${formData.qt_total}. Depósitos eliminados: ${formData.depositos_eliminados || 0}. Depósitos tratados: ${formData.quantidade_depositos_tratados || 0}. Supervisor: ${formData.nome_supervisor || 'N/A'}.`;
  
  return { vectorData, summary };
};

