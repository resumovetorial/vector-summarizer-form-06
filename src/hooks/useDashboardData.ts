
import { useState, useCallback } from 'react';
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
    setDashboardData(prevData => {
      // First check if we have an ID to match
      if (newData.id) {
        const existingIndex = prevData.findIndex(item => item.id === newData.id);
        
        if (existingIndex >= 0) {
          console.log("Updating existing record by ID:", newData.id);
          const updatedData = [...prevData];
          updatedData[existingIndex] = newData;
          return updatedData;
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
        console.log("Updating existing record by matched fields");
        const updatedData = [...prevData];
        updatedData[existingIndex] = newData;
        return updatedData;
      } else {
        console.log("Adding new record to dashboard data");
        return [...prevData, newData];
      }
    });
  }, []);

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
