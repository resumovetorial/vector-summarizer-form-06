
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Obter dados vetoriais salvos do Supabase ou armazenamento local como fallback
export const getSavedVectorData = async (): Promise<LocalityData[]> => {
  try {
    // Tenta obter dados do Supabase primeiro com um query mais robusto
    const { data, error } = await supabase
      .from('vector_data')
      .select(`
        *,
        localities:locality_id(name)
      `);
    
    if (error) {
      console.error('Erro ao buscar dados do Supabase:', error);
      // Fallback para localStorage
      return getLocalVectorData();
    }
    
    if (data && data.length > 0) {
      console.log("Dados recuperados do Supabase:", data.length, "linhas");
      // Converter dados do Supabase para formato LocalityData
      return data.map(item => ({
        municipality: item.municipality,
        locality: item.localities?.name || 'Localidade não encontrada', // Usar nome da localidade se disponível
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
    
    console.log("Nenhum dado encontrado no Supabase, verificando localStorage");
    // Se não houver dados no Supabase, fallback para localStorage
    return getLocalVectorData();
  } catch (error) {
    console.error('Erro ao buscar dados vetoriais salvos:', error);
    // Fallback para localStorage
    return getLocalVectorData();
  }
};

// Função auxiliar para obter dados do localStorage
const getLocalVectorData = (): LocalityData[] => {
  const savedData = localStorage.getItem('vectorData');
  if (savedData) {
    try {
      console.log("Dados recuperados do localStorage");
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Erro ao analisar dados do localStorage:', error);
      return [];
    }
  }
  console.log("Nenhum dado encontrado no localStorage");
  return [];
};
