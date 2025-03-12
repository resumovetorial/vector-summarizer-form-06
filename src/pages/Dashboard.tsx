
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardByCycle from '@/components/dashboard/DashboardByCycle';
import DashboardByWeek from '@/components/dashboard/DashboardByWeek';
import { useToast } from '@/hooks/use-toast';
import { mockDashboardData, fetchDashboardData } from '@/services/dashboardService';
import { LocalityData } from '@/types/dashboard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardLocalitySection from '@/components/dashboard/DashboardLocalitySection';
import { useDashboardExport } from '@/hooks/useDashboardExport';
import { toast } from "sonner";

const Dashboard = () => {
  const { toast: toastHook } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'week' | 'cycle'>('week');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [dashboardData, setDashboardData] = useState<LocalityData[]>([]);
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [localityData, setLocalityData] = useState<LocalityData | null>(null);
  const [localityHistoricalData, setLocalityHistoricalData] = useState<LocalityData[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Use the hook for export functionality
  const { exportToExcel, exportToPDF } = useDashboardExport({
    dashboardRef,
    dashboardData,
    selectedLocality,
    localityHistoricalData,
    setIsExporting
  });

  const refreshData = async () => {
    setIsLoading(true);
    toast.info("Atualizando dados...");

    try {
      const data = await fetchDashboardData(year);
      console.log("Dashboard data fetched:", data);
      setDashboardData(data);
      
      // Limpar a seleção de localidade
      setSelectedLocality('');
      setLocalityData(null);
      setLocalityHistoricalData([]);
      
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Erro ao atualizar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalityChange = (value: string) => {
    setSelectedLocality(value);

    if (value) {
      const filteredData = dashboardData
        .filter(item => item.locality === value)
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
      
      if (filteredData.length > 0) {
        setLocalityData(filteredData[0]);
        setLocalityHistoricalData(filteredData);
      } else {
        setLocalityData(null);
        setLocalityHistoricalData([]);
      }
    } else {
      setLocalityData(null);
      setLocalityHistoricalData([]);
    }
  };

  useEffect(() => {
    refreshData();
  }, [year]);

  return (
    <div className="min-h-screen flex flex-col background-gradient">
      <div className="container px-4 sm:px-6 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 sm:py-12">
          <div className="w-full max-w-7xl mx-auto">
            <div className="glass-card rounded-xl p-6 sm:p-8" ref={dashboardRef}>
              <DashboardHeader 
                title="Dashboard de Resumo"
                subtitle="Visualize os dados de todas as localidades"
                year={year}
                setYear={setYear}
                isLoading={isLoading}
                isExporting={isExporting}
                refreshData={refreshData}
                exportToExcel={exportToExcel}
                exportToPDF={exportToPDF}
              />
              
              <DashboardLocalitySection 
                selectedLocality={selectedLocality}
                onLocalityChange={handleLocalityChange}
                localityData={localityData}
                localityHistoricalData={localityHistoricalData}
              />
              
              <Tabs defaultValue="week" className="w-full" onValueChange={(value) => setView(value as 'week' | 'cycle')}>
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
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
