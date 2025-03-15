
import { LocalityData } from "@/types/dashboard";
import { getSavedVectorData } from "./vectorService";
import { mockDashboardData } from "./mockDashboardData";
import { filterDataByYear } from "./dashboardFilterService";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Fetches dashboard data from Supabase or falls back to local storage or mock data
 * @param year The year to filter data by (defaults to current year)
 * @returns Promise resolving to filtered dashboard data
 */
export const fetchDashboardData = async (year: string = "2024"): Promise<LocalityData[]> => {
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    console.log("Tentando buscar dados do Supabase...");
    // Try to get data from Supabase with locality names
    const { data, error } = await supabase
      .from('vector_data')
      .select(`
        *,
        localities(name)
      `);
    
    if (error) {
      console.error('Erro ao buscar dados do Supabase:', error);
      // Fallback to localStorage
      const savedData = await getSavedVectorData();
      if (savedData && savedData.length > 0) {
        console.log("Usando dados salvos do localStorage:", savedData);
        // Filter by year
        return filterDataByYear(savedData, year);
      }
      
      // Last fallback to mocked data
      console.log("Usando dados simulados");
      return filterDataByYear(mockDashboardData, year);
    }
    
    if (data && data.length > 0) {
      console.log("Dados obtidos do Supabase:", data);
      // Convert Supabase data to LocalityData format with locality names
      const convertedData = data.map(item => ({
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
      
      toast.success(`${convertedData.length} registros carregados do servidor`);
      return filterDataByYear(convertedData, year);
    }
    
    // Fallback to localStorage
    const savedData = await getSavedVectorData();
    if (savedData && savedData.length > 0) {
      console.log("Usando dados salvos do localStorage:", savedData);
      // Filter by year
      return filterDataByYear(savedData, year);
    }
  } catch (error) {
    console.error('Erro na operação do Supabase:', error);
    // Fallback to localStorage
    toast.error('Erro ao conectar com o banco de dados');
  }
  
  // If no data was obtained, use mocked data
  console.log("Usando dados simulados");
  return filterDataByYear(mockDashboardData, year);
};
