
import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useLocalitySelection } from '@/hooks/useLocalitySelection';
import DashboardContainer from '@/components/dashboard/DashboardContainer';

const Dashboard = () => {
  const [view, setView] = useState<'week' | 'cycle'>('week');
  
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
