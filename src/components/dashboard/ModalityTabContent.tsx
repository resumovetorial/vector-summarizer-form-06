
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CycleSummary } from '@/types/dashboard';
import CycleTabContent from './CycleTabContent';

interface ModalityTabContentProps {
  modality: string;
  cycleSummaries: CycleSummary[];
}

const ModalityTabContent: React.FC<ModalityTabContentProps> = ({ modality, cycleSummaries }) => {
  const modalityCycles = cycleSummaries.filter(cycle => cycle.workModality === modality);
  
  return (
    <TabsContent key={modality} value={modality} className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Modalidade: {modality}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={
            modalityCycles
              .sort((a, b) => parseInt(a.cycle) - parseInt(b.cycle))
              .length > 0 
                ? modalityCycles[0].cycle 
                : "01"
          }>
            <TabsList className="flex flex-wrap mb-6">
              {modalityCycles
                .map(cycle => (
                  <TabsTrigger key={cycle.cycle} value={cycle.cycle}>
                    Ciclo {cycle.cycle}
                  </TabsTrigger>
                ))
              }
            </TabsList>
            
            {modalityCycles.map(cycle => (
              <CycleTabContent key={cycle.cycle} cycle={cycle} />
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ModalityTabContent;
