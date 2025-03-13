
import { LocalityData } from "@/types/dashboard";
import { getSavedVectorData } from "./vectorService";
import { mockDashboardData } from "./mockDashboardData";
import { filterDataByYear } from "./dashboardFilterService";
import { supabase } from '@/integrations/supabase/client';

/**
 * Configure Supabase to support Realtime for vector_data
 */
export const setupRealtimeSupport = async () => {
  try {
    // Configure vector_data table to support Realtime
    const { error } = await supabase.rpc('enable_realtime_for_table', {
      table_name: 'vector_data'
    });
    
    if (error) {
      console.error('Error enabling realtime for vector_data:', error);
    } else {
      console.log('Realtime enabled for vector_data table');
    }
  } catch (error) {
    console.error('Failed to setup realtime support:', error);
  }
};

/**
 * Fetches dashboard data from Supabase or falls back to local storage or mock data
 * @param year The year to filter data by (defaults to current year)
 * @returns Promise resolving to filtered dashboard data
 */
export const fetchDashboardData = async (year: string = "2024"): Promise<LocalityData[]> => {
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Try to get data from Supabase
    const { data, error } = await supabase
      .from('vector_data')
      .select('*');
    
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      // Fallback to localStorage
      const savedData = await getSavedVectorData();
      if (savedData && savedData.length > 0) {
        console.log("Using saved data from localStorage:", savedData);
        // Filter by year
        return filterDataByYear(savedData, year);
      }
      
      // Last fallback to mocked data
      console.log("Using mock data");
      return filterDataByYear(mockDashboardData, year);
    }
    
    if (data && data.length > 0) {
      console.log("Using data from Supabase:", data);
      // Convert Supabase data to LocalityData format
      const convertedData = data.map((item) => ({
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
      
      return filterDataByYear(convertedData, year);
    }
    
    // Fallback to localStorage
    const savedData = await getSavedVectorData();
    if (savedData && savedData.length > 0) {
      console.log("Using saved data from localStorage:", savedData);
      // Filter by year
      return filterDataByYear(savedData, year);
    }
  } catch (error) {
    console.error('Error in Supabase operation:', error);
    // Fallback to localStorage
  }
  
  // If no data was obtained, use mocked data
  console.log("Using mock data");
  return filterDataByYear(mockDashboardData, year);
};

// Try to configure Realtime support
setupRealtimeSupport().catch(console.error);
