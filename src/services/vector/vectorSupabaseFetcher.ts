
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches vector data from Supabase
 * @returns Array of locality data from Supabase or null if error occurs
 */
export const fetchVectorDataFromSupabase = async (): Promise<LocalityData[] | null> => {
  try {
    console.log('Tentando buscar dados vetoriais do Supabase...');
    
    // Robust query to get data from Supabase with locality information
    const { data, error } = await supabase
      .from('vector_data')
      .select(`
        *,
        localities:locality_id(name)
      `);
    
    if (error) {
      console.error('Erro ao buscar dados do Supabase:', error);
      toast.error('Erro ao buscar dados do servidor, usando dados locais');
      return null;
    }
    
    if (data && data.length > 0) {
      console.log("Dados recuperados do Supabase:", data.length, "linhas");
      toast.success(`${data.length} registros carregados do servidor`);
      
      // Convert Supabase data to LocalityData format
      return mapSupabaseDataToLocalityData(data);
    }
    
    console.log("Nenhum dado encontrado no Supabase, verificando localStorage");
    toast.info('Nenhum dado encontrado no servidor, verificando armazenamento local');
    return null;
  } catch (error) {
    console.error('Erro ao buscar dados vetoriais do Supabase:', error);
    toast.error('Erro ao conectar com o servidor, usando dados locais');
    return null;
  }
};

/**
 * Maps data from Supabase format to LocalityData format
 * @param data Raw data from Supabase
 * @returns Formatted LocalityData array
 */
const mapSupabaseDataToLocalityData = (data: any[]): LocalityData[] => {
  return data.map(item => ({
    municipality: item.municipality,
    locality: item.localities?.name || 'Localidade não encontrada',
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
};
