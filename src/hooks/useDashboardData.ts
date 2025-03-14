
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
      // Se tem um ID no novo dado, usamos ele para identificar o registro a ser atualizado
      if (newData.id) {
        const existingIndex = prevData.findIndex(item => item.id === newData.id);
        
        if (existingIndex >= 0) {
          console.log("Atualizando registro existente com ID:", newData.id);
          const updatedData = [...prevData];
          updatedData[existingIndex] = newData;
          return updatedData;
        }
      }
      
      // Verificação alternativa por campos combinados caso não encontremos por ID
      const existingIndex = prevData.findIndex(
        item => 
          item.locality === newData.locality && 
          item.cycle === newData.cycle && 
          item.startDate === newData.startDate &&
          item.endDate === newData.endDate
      );
      
      if (existingIndex >= 0) {
        const updatedData = [...prevData];
        updatedData[existingIndex] = newData;
        return updatedData;
      } else {
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
