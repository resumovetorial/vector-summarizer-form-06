
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardByCycle from '@/components/dashboard/DashboardByCycle';
import DashboardByWeek from '@/components/dashboard/DashboardByWeek';
import { LocalityData } from '@/types/dashboard';

interface DashboardTabsProps {
  view: 'week' | 'cycle';
  setView: (view: 'week' | 'cycle') => void;
  dashboardData: LocalityData[];
  year: string;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  view, 
  setView, 
  dashboardData, 
  year 
}) => {
  return (
    <Tabs 
      defaultValue="week" 
      className="w-full" 
      onValueChange={(value) => setView(value as 'week' | 'cycle')}
      value={view}
    >
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="week">Por Semana Epidemiológica</TabsTrigger>
        <TabsTrigger value="cycle">Por Ciclo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="week" className="mt-0">
        <DashboardByWeek data={dashboardData} year={year} />
      </TabsContent>
      
      <TabsContent value="cycle" className="mt-0">
        <DashboardByCycle data={dashboardData} year={year} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
