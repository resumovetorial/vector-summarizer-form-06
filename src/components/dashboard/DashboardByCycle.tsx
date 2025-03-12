
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocalityData } from '@/types/dashboard';
import { FilePieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CycleSummaryChart from './CycleSummaryChart';
import ModalityTabContent from './ModalityTabContent';
import { prepareCycleSummaries, getUniqueModalities } from '@/utils/dashboardDataUtils';

interface DashboardByCycleProps {
  data: LocalityData[];
  year: string;
}

const DashboardByCycle: React.FC<DashboardByCycleProps> = ({ data, year }) => {
  const [showChart, setShowChart] = useState(true);
  
  // Process data using utility functions
  const cycleSummaries = prepareCycleSummaries(data);
  const modalities = getUniqueModalities(cycleSummaries);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button
          variant={showChart ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowChart(!showChart)}
          className="mr-2"
        >
          <FilePieChart className="h-4 w-4 mr-2" />
          {showChart ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
        </Button>
      </div>
      
      {showChart && <CycleSummaryChart cycleSummaries={cycleSummaries} year={year} />}
      
      <Tabs defaultValue={modalities.length > 0 ? modalities[0] : "LI"}>
        <TabsList className="flex flex-wrap mb-4">
          {modalities.map(modality => (
            <TabsTrigger key={modality} value={modality}>
              {modality}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {modalities.map(modality => (
          <ModalityTabContent 
            key={modality} 
            modality={modality} 
            cycleSummaries={cycleSummaries} 
          />
        ))}
      </Tabs>
    </div>
  );
};

export default DashboardByCycle;
