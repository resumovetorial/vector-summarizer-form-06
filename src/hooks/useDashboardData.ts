
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
        } 
      }
      
      // Caso não encontre pelo ID, tenta encontrar pela combinação de campos
      const existingIndex = prevData.findIndex(
        item => 
          item.locality === newData.locality && 
          item.cycle === newData.cycle && 
          item.epidemiologicalWeek === newData.epidemiologicalWeek
      );
      
      if (existingIndex >= 0) {
        console.log("Registro encontrado por campos correspondentes no índice:", existingIndex);
        const updatedData = [...prevData];
        updatedData[existingIndex] = { ...newData };
        console.log("Dados atualizados por campos correspondentes:", updatedData[existingIndex]);
        return updatedData;
      }
      
      // Se não encontrou o registro para atualizar, apenas retorna os dados atuais
      // Não vamos adicionar novos dados aqui, pois isso deve acontecer apenas com refreshData
      console.log("Registro não encontrado para atualização, mantendo dados existentes");
      return prevData;
    });

    // Forçar uma atualização completa após edição
    // Aumentamos o tempo para garantir que a operação no banco tenha sido concluída
    setTimeout(() => {
      refreshData();
    }, 2000);
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
