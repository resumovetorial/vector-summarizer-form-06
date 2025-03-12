
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { CycleSummary } from '@/types/dashboard';
import CycleLocalityTable from './CycleLocalityTable';

interface CycleTabContentProps {
  cycle: CycleSummary;
}

const CycleTabContent: React.FC<CycleTabContentProps> = ({ cycle }) => {
  return (
    <TabsContent key={cycle.cycle} value={cycle.cycle} className="mt-6">
      <CycleLocalityTable localities={cycle.localities} />
    </TabsContent>
  );
};

export default CycleTabContent;
