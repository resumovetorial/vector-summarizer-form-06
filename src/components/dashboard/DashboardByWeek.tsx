
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalityData, WeekSummary } from '@/types/dashboard';
import EpidemiologicalWeekSelector from '../formSteps/EpidemiologicalWeekSelector';
import WeekSummaryChart from './WeekSummaryChart';
import WeekDetailCard from './WeekDetailCard';
import { groupDataByWeek, getWeekSummaries } from './weekDataUtils';

interface DashboardByWeekProps {
  data: LocalityData[];
  year: string;
}

const DashboardByWeek: React.FC<DashboardByWeekProps> = ({ data, year }) => {
  const [expandedLocality, setExpandedLocality] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('generalInfo');
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  
  // Group data by epidemiological week
  const groupedByWeek = groupDataByWeek(data);
  
  // Convert grouped data to array and sort by week
  const weekSummaries = getWeekSummaries(groupedByWeek);

  // Set initial selectedWeek if not already set and weeks are available
  useEffect(() => {
    if (selectedWeek === "" && weekSummaries.length > 0) {
      setSelectedWeek(weekSummaries[0].week);
    }
  }, [weekSummaries, selectedWeek]);

  const handleWeekChange = (week: string) => {
    setSelectedWeek(week);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Resumo por Semana Epidemiológica - {year}</CardTitle>
            <div className="w-full md:w-64">
              <EpidemiologicalWeekSelector
                value={selectedWeek}
                onChange={handleWeekChange}
                withFormField={false}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <WeekSummaryChart weekSummaries={weekSummaries} year={year} />
          </div>
        </CardContent>
      </Card>
      
      {selectedWeek && weekSummaries.length > 0 && (
        <WeekDetailCard 
          selectedWeek={selectedWeek}
          groupedByWeek={groupedByWeek}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
      )}
    </div>
  );
};

export default DashboardByWeek;
