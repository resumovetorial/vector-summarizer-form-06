
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
    console.log("Tentando atualizar dados do dashboard com:", newData);
    
    setDashboardData(prevData => {
      // Primeiro, verificar se temos um ID para combinar
      if (newData.id) {
        console.log("Procurando registro com ID:", newData.id);
        // Verificar se já temos este registro pelo ID
        const existingIndex = prevData.findIndex(item => item.id === newData.id);
        
        if (existingIndex >= 0) {
          console.log("Registro encontrado por ID no índice:", existingIndex);
          // Substituir o registro existente com os novos dados
          const updatedData = [...prevData];
          updatedData[existingIndex] = { ...newData };
          console.log("Dados atualizados no índice:", existingIndex, updatedData[existingIndex]);
          return updatedData;
        } else {
          console.log("Registro com ID não encontrado no dataset atual:", newData.id);
          console.log("Adicionando novo registro ao dataset");
          return [...prevData, newData];
        }
      }
      
      // Se não tiver ID, verificar por múltiplos campos
      const existingIndex = prevData.findIndex(
        item => 
          item.locality === newData.locality && 
          item.cycle === newData.cycle && 
          item.epidemiologicalWeek === newData.epidemiologicalWeek &&
          item.startDate === newData.startDate &&
          item.endDate === newData.endDate
      );
      
      if (existingIndex >= 0) {
        console.log("Registro encontrado por campos correspondentes no índice:", existingIndex);
        const updatedData = [...prevData];
        updatedData[existingIndex] = { ...newData };
        console.log("Dados atualizados por campos correspondentes:", updatedData[existingIndex]);
        return updatedData;
      } else {
        console.log("Adicionando novo registro aos dados do dashboard:", newData);
        return [...prevData, newData];
      }
    });

    // Forçar uma atualização completa após edição
    setTimeout(() => {
      refreshData();
    }, 1000);
  }, [year]);

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
