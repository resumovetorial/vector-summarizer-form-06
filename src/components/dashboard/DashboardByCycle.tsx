
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocalityData } from '@/types/dashboard';
import { FilePieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CycleSummaryChart from './CycleSummaryChart';
import ModalityTabContent from './ModalityTabContent';
import { prepareCycleSummaries, getUniqueModalities } from '@/utils/dashboardDataUtils';
import CycleSelectorDashboard from './CycleSelectorDashboard';

interface DashboardByCycleProps {
  data: LocalityData[];
  year: string;
}

const DashboardByCycle: React.FC<DashboardByCycleProps> = ({ data, year }) => {
  const [showChart, setShowChart] = useState(true);
  const [selectedCycle, setSelectedCycle] = useState<string>("");
  
  // Process data using utility functions
  const cycleSummaries = prepareCycleSummaries(data);
  const modalities = getUniqueModalities(cycleSummaries);
  
  // Get unique cycles from the data
  const uniqueCycles = [...new Set(cycleSummaries.map(item => item.cycle))].sort();
  
  // Set default selected cycle when data changes
  useEffect(() => {
    if (uniqueCycles.length > 0 && !selectedCycle) {
      setSelectedCycle(uniqueCycles[0]);
    }
  }, [uniqueCycles, selectedCycle]);
  
  // Filter data by selected cycle
  const filteredSummaries = selectedCycle 
    ? cycleSummaries.filter(item => item.cycle === selectedCycle)
    : cycleSummaries;
  
  // Get modalities for the filtered data
  const filteredModalities = getUniqueModalities(filteredSummaries);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <CycleSelectorDashboard 
          value={selectedCycle} 
          onChange={setSelectedCycle} 
          cycles={uniqueCycles}
        />
        
        <Button
          variant={showChart ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowChart(!showChart)}
        >
          <FilePieChart className="h-4 w-4 mr-2" />
          {showChart ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
        </Button>
      </div>
      
      {showChart && <CycleSummaryChart 
        cycleSummaries={selectedCycle ? filteredSummaries : cycleSummaries} 
        year={year} 
      />}
      
      <Tabs defaultValue={filteredModalities.length > 0 ? filteredModalities[0] : "LI"}>
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
    </div>
  );
};

export default DashboardByCycle;
