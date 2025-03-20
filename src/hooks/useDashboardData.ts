
import { useState, useCallback, useEffect } from 'react';
import { LocalityData } from '@/types/dashboard';
import { fetchDashboardData } from '@/services/dashboardService';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [dashboardData, setDashboardData] = useState<LocalityData[]>([]);

  const refreshData = async () => {
    setIsLoading(true);
    toast.info("Atualizando dados...");

    try {
      const data = await fetchDashboardData(year);
      console.log("Dashboard data fetched:", data);
      setDashboardData(data);
      
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Erro ao atualizar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateDashboardData = useCallback((newData: LocalityData) => {
    console.log("Attempting to update dashboard data with:", newData);
    
    setDashboardData(prevData => {
      // First check if we have an ID to match
      if (newData.id) {
        console.log("Searching for record with ID:", newData.id);
        const existingIndex = prevData.findIndex(item => item.id === newData.id);
        
        if (existingIndex >= 0) {
          console.log("Found record by ID at index:", existingIndex);
          const updatedData = [...prevData];
          updatedData[existingIndex] = { ...newData };
          console.log("Updated data at index:", updatedData[existingIndex]);
          return updatedData;
        } else {
          console.log("Record with ID not found in current dataset:", newData.id);
        }
      }
      
      // Fallback to checking by multiple fields
      const existingIndex = prevData.findIndex(
        item => 
          item.locality === newData.locality && 
          item.cycle === newData.cycle && 
          item.epidemiologicalWeek === newData.epidemiologicalWeek &&
          item.startDate === newData.startDate &&
          item.endDate === newData.endDate
      );
      
      if (existingIndex >= 0) {
        console.log("Found record by matched fields at index:", existingIndex);
        const updatedData = [...prevData];
        updatedData[existingIndex] = { ...newData };
        console.log("Updated data by matched fields:", updatedData[existingIndex]);
        return updatedData;
      } else {
        console.log("Adding new record to dashboard data:", newData);
        return [...prevData, newData];
      }
    });
  }, []);

  // Inicializar dados quando o componente for montado ou o ano mudar
  useEffect(() => {
    refreshData();
  }, [year]);

  return {
    isLoading,
    year,
    setYear,
    dashboardData,
    setDashboardData,
    refreshData,
    updateDashboardData
  };
};
