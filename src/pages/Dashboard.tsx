
import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useLocalitySelection } from '@/hooks/useLocalitySelection';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [view, setView] = useState<'week' | 'cycle'>('week');
  const location = useLocation();
  const navigate = useNavigate();
  const shouldRefresh = location.state?.refreshData;
  
  const {
    isLoading,
    year,
    setYear,
    dashboardData,
    refreshData,
    updateDashboardData
  } = useDashboardData();
  
  const {
    selectedLocality,
    localityData,
    localityHistoricalData,
    handleLocalityChange,
    resetLocalitySelection
  } = useLocalitySelection(dashboardData);

  // Verificar se devemos atualizar os dados ao retornar de uma edição
  useEffect(() => {
    if (shouldRefresh) {
      console.log("Retornando da edição, atualizando dados...");
      toast.info("Atualizando dados após edição...");
      refreshData();
      // Limpar state para evitar múltiplas atualizações
      window.history.replaceState({}, document.title);
    }
  }, [shouldRefresh, refreshData]);

  // Configurar atualizações em tempo real
  useRealtimeUpdates((payload) => {
    console.log("Atualização em tempo real recebida no Dashboard:", payload);
    
    if (payload.new) {
      try {
        // Converter os dados recebidos para o formato LocalityData
        const localityName = payload.new.localities?.name || 'Localidade desconhecida';
        
        const updatedData = {
          id: payload.new.id,
          municipality: payload.new.municipality,
          locality: localityName,
          cycle: payload.new.cycle,
          epidemiologicalWeek: payload.new.epidemiological_week,
          workModality: payload.new.work_modality,
          startDate: payload.new.start_date,
          endDate: payload.new.end_date,
          totalProperties: payload.new.total_properties,
          inspections: payload.new.inspections,
          depositsEliminated: payload.new.deposits_eliminated,
          depositsTreated: payload.new.deposits_treated,
          supervisor: payload.new.supervisor,
          qt_residencias: payload.new.qt_residencias,
          qt_comercio: payload.new.qt_comercio,
          qt_terreno_baldio: payload.new.qt_terreno_baldio,
          qt_pe: payload.new.qt_pe,
          qt_outros: payload.new.qt_outros,
          qt_total: payload.new.qt_total,
          tratamento_focal: payload.new.tratamento_focal,
          tratamento_perifocal: payload.new.tratamento_perifocal,
          amostras_coletadas: payload.new.amostras_coletadas,
          recusa: payload.new.recusa,
          fechadas: payload.new.fechadas,
          recuperadas: payload.new.recuperadas,
          a1: payload.new.a1,
          a2: payload.new.a2,
          b: payload.new.b,
          c: payload.new.c,
          d1: payload.new.d1,
          d2: payload.new.d2,
          e: payload.new.e,
          larvicida: payload.new.larvicida,
          quantidade_larvicida: payload.new.quantidade_larvicida,
          quantidade_depositos_tratados: payload.new.quantidade_depositos_tratados,
          adulticida: payload.new.adulticida,
          quantidade_cargas: payload.new.quantidade_cargas,
          total_tec_saude: payload.new.total_tec_saude,
          total_dias_trabalhados: payload.new.total_dias_trabalhados
        };
        
        console.log("Dados convertidos para atualização:", updatedData);
        updateDashboardData(updatedData);
        
        toast.success("Dados atualizados com sucesso!");
      } catch (error) {
        console.error("Erro ao processar atualização em tempo real:", error);
        toast.error("Erro ao atualizar dados. Atualizando manualmente...");
        refreshData();
      }
    }
  }, [year, updateDashboardData]);

  // Buscar dados quando o ano mudar
  useEffect(() => {
    refreshData();
  }, [year]);

  // Resetar a seleção de localidade quando os dados mudarem
  useEffect(() => {
    resetLocalitySelection();
  }, [dashboardData]);

  return (
    <DashboardContainer
      isLoading={isLoading}
      year={year}
      setYear={setYear}
      dashboardData={dashboardData}
      selectedLocality={selectedLocality}
      localityData={localityData}
      localityHistoricalData={localityHistoricalData}
      view={view}
      setView={setView}
      refreshData={refreshData}
      handleLocalityChange={handleLocalityChange}
      updateDashboardData={updateDashboardData}
    />
  );
};

export default Dashboard;
