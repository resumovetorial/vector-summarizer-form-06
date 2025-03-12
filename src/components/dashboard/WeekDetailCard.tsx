
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeekSummaryCard from './WeekSummaryCard';
import WeekDetailTabs from './WeekDetailTabs';

interface WeekDetailCardProps {
  selectedWeek: string;
  groupedByWeek: Record<string, any>;
  expandedSection: string;
  setExpandedSection: (section: string) => void;
}

const WeekDetailCard: React.FC<WeekDetailCardProps> = ({ 
  selectedWeek, 
  groupedByWeek,
  expandedSection,
  setExpandedSection
}) => {
  if (!selectedWeek || !groupedByWeek[selectedWeek]) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semana Epidemiológica {selectedWeek}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <WeekSummaryCard 
            title="Imóveis" 
            value={groupedByWeek[selectedWeek].totalProperties} 
          />
          <WeekSummaryCard 
            title="Inspecionados" 
            value={groupedByWeek[selectedWeek].totalInspections} 
          />
          <WeekSummaryCard 
            title="Depósitos Eliminados" 
            value={groupedByWeek[selectedWeek].totalDepositsEliminated} 
          />
          <WeekSummaryCard 
            title="Depósitos Tratados" 
            value={groupedByWeek[selectedWeek].totalDepositsTreated} 
          />
        </div>
        
        <div className="mb-4">
          <WeekDetailTabs 
            groupedByWeek={groupedByWeek} 
            selectedWeek={selectedWeek}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekDetailCard;
