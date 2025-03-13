
import { LocalityData } from "@/types/dashboard";
import { getSavedVectorData } from "./vectorService";
import { mockDashboardData } from "./mockDashboardData";
import { filterDataByYear } from "./dashboardFilterService";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapSupabaseDataToLocalityData } from "./dashboardMapperService";

/**
 * Fetches dashboard data from Supabase or falls back to local storage or mock data
 * @param year The year to filter data by (defaults to current year)
 * @returns Promise resolving to filtered dashboard data
 */
export const fetchDashboardData = async (year: string = "2024"): Promise<LocalityData[]> => {
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    console.log("Tentando buscar dados do Supabase...");
    // Try to get data from Supabase
    const { data, error } = await supabase
      .from('vector_data')
      .select('*');
    
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
      // Convert Supabase data to LocalityData format
      const convertedData = mapSupabaseDataToLocalityData(data);
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
