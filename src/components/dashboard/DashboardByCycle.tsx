
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocalityData } from '@/types/dashboard';
import { prepareCycleSummaries, getUniqueModalities } from '@/utils/dashboardDataUtils';
import CycleSelectorDashboard from './CycleSelectorDashboard';
import ModalityTabContent from './ModalityTabContent';
import CycleSummaryCard from './CycleSummaryCard';

interface DashboardByCycleProps {
  data: LocalityData[];
  year: string;
}

const DashboardByCycle: React.FC<DashboardByCycleProps> = ({ data, year }) => {
  const [selectedCycle, setSelectedCycle] = useState<string>("all");
  const [selectedModality, setSelectedModality] = useState<string>("");
  
  // Process data using utility functions
  const cycleSummaries = prepareCycleSummaries(data);
  const modalities = getUniqueModalities(cycleSummaries);
  
  // Get unique cycles from the data and sort them
  const uniqueCycles = [...new Set(cycleSummaries.map(item => item.cycle))].sort((a, b) => {
    // Ensure proper numerical sorting even with string format
    return parseInt(a) - parseInt(b);
  });
  
  // Set default selected cycle and modality when data changes
  useEffect(() => {
    if (uniqueCycles.length > 0 && selectedCycle === "") {
      setSelectedCycle(uniqueCycles[0]);
    }
    if (modalities.length > 0 && !selectedModality) {
      setSelectedModality(modalities[0]);
    }
  }, [uniqueCycles, selectedCycle, modalities, selectedModality]);
  
  // Handle modality tab change
  const handleModalityChange = (value: string) => {
    setSelectedModality(value);
  };
  
  // Filter data by selected cycle
  const filteredSummaries = selectedCycle && selectedCycle !== "all"
    ? cycleSummaries.filter(item => item.cycle === selectedCycle)
    : cycleSummaries;
  
  // Get modalities for the filtered data
  const filteredModalities = getUniqueModalities(filteredSummaries);
  
  // Set first available modality if current one is not available after filtering
  useEffect(() => {
    if (filteredModalities.length > 0 && !filteredModalities.includes(selectedModality)) {
      setSelectedModality(filteredModalities[0]);
    }
  }, [filteredModalities, selectedModality]);
  
  // Calculate cycle summary totals
  const getTotalForCycle = () => {
    if (!selectedCycle || selectedCycle === "all") {
      return {
        totalProperties: cycleSummaries.reduce((sum, item) => sum + item.totalProperties, 0),
        totalInspections: cycleSummaries.reduce((sum, item) => sum + item.totalInspections, 0),
        totalDepositsEliminated: cycleSummaries.reduce((sum, item) => sum + item.totalDepositsEliminated, 0),
        totalDepositsTreated: cycleSummaries.reduce((sum, item) => sum + item.totalDepositsTreated, 0)
      };
    }
    
    const cycleData = cycleSummaries.filter(item => item.cycle === selectedCycle);
    return {
      totalProperties: cycleData.reduce((sum, item) => sum + item.totalProperties, 0),
      totalInspections: cycleData.reduce((sum, item) => sum + item.totalInspections, 0),
      totalDepositsEliminated: cycleData.reduce((sum, item) => sum + item.totalDepositsEliminated, 0),
      totalDepositsTreated: cycleData.reduce((sum, item) => sum + item.totalDepositsTreated, 0)
    };
  };
  
  const cycleTotals = getTotalForCycle();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Resumo por Ciclo - {year}</CardTitle>
            <div className="w-full md:w-64">
              <CycleSelectorDashboard 
                value={selectedCycle} 
                onChange={setSelectedCycle} 
                cycles={uniqueCycles}
                workModality={selectedModality}
              />
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCycle === "all" ? "Todos os Ciclos" : `Ciclo ${selectedCycle}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <CycleSummaryCard 
              title="Imóveis" 
              value={cycleTotals.totalProperties} 
            />
            <CycleSummaryCard 
              title="Inspecionados" 
              value={cycleTotals.totalInspections} 
            />
            <CycleSummaryCard 
              title="Depósitos Eliminados" 
              value={cycleTotals.totalDepositsEliminated} 
            />
            <CycleSummaryCard 
              title="Depósitos Tratados" 
              value={cycleTotals.totalDepositsTreated} 
            />
          </div>
          
          <Tabs 
            defaultValue={filteredModalities.length > 0 ? filteredModalities[0] : "LI"}
            value={selectedModality}
            onValueChange={handleModalityChange}
          >
            <TabsList className="flex flex-wrap mb-4">
              {filteredModalities.map(modality => (
                <TabsTrigger key={modality} value={modality}>
                  {modality}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {filteredModalities.map(modality => (
              <ModalityTabContent 
                key={modality} 
                modality={modality} 
                cycleSummaries={filteredSummaries} 
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardByCycle;
