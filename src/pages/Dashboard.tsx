
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';

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

  // Callback para atualizar dados em tempo real
  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (!payload || !payload.new) {
      console.log('Received empty realtime update');
      return;
    }
    
    const item = payload.new;
    console.log('Received realtime update:', item);
    
    // Convert Supabase payload to LocalityData format
    const newData: LocalityData = {
      municipality: item.municipality,
      locality: item.locality_id, // We'll need to fetch the locality name separately
      cycle: item.cycle,
      epidemiologicalWeek: item.epidemiological_week,
      workModality: item.work_modality,
      startDate: item.start_date,
      endDate: item.end_date,
      totalProperties: item.total_properties,
      inspections: item.inspections,
      depositsEliminated: item.deposits_eliminated,
      depositsTreated: item.deposits_treated,
      supervisor: item.supervisor,
      qt_residencias: item.qt_residencias,
      qt_comercio: item.qt_comercio,
      qt_terreno_baldio: item.qt_terreno_baldio,
      qt_pe: item.qt_pe,
      qt_outros: item.qt_outros,
      qt_total: item.qt_total,
      tratamento_focal: item.tratamento_focal,
      tratamento_perifocal: item.tratamento_perifocal,
      amostras_coletadas: item.amostras_coletadas,
      recusa: item.recusa,
      fechadas: item.fechadas,
      recuperadas: item.recuperadas,
      a1: item.a1,
      a2: item.a2,
      b: item.b,
      c: item.c,
      d1: item.d1,
      d2: item.d2,
      e: item.e,
      larvicida: item.larvicida,
      quantidade_larvicida: item.quantidade_larvicida,
      quantidade_depositos_tratados: item.quantidade_depositos_tratados,
      adulticida: item.adulticida,
      quantidade_cargas: item.quantidade_cargas,
      total_tec_saude: item.total_tec_saude,
      total_dias_trabalhados: item.total_dias_trabalhados
    };
    
    // Fetch the locality name
    const fetchLocalityName = async () => {
      try {
        const { data, error } = await supabase
          .from('localities')
          .select('name')
          .eq('id', item.locality_id)
          .single();
        
        if (data && !error) {
          newData.locality = data.name;
        }
        
        // Now update the dashboard data
        updateDashboardData(newData);
      } catch (err) {
        console.error('Error fetching locality name:', err);
        // Still update with just the ID
        updateDashboardData(newData);
      }
    };
    
    fetchLocalityName();
  }, []);
  
  // Helper function to update dashboard data
  const updateDashboardData = useCallback((newData: LocalityData) => {
    // Atualizar dashboardData com os novos dados
    setDashboardData(prevData => {
      // Verificar se os dados já existem
      const existingIndex = prevData.findIndex(
        item => 
          item.locality === newData.locality && 
          item.cycle === newData.cycle && 
          item.startDate === newData.startDate &&
          item.endDate === newData.endDate
      );
      
      if (existingIndex >= 0) {
        // Atualizar os dados existentes
        const updatedData = [...prevData];
        updatedData[existingIndex] = newData;
        return updatedData;
      } else {
        // Adicionar os novos dados
        return [...prevData, newData];
      }
    });
    
    // Se a localidade selecionada for a mesma dos novos dados, atualizar localityData
    if (selectedLocality === newData.locality) {
      setLocalityHistoricalData(prevData => {
        const existingIndex = prevData.findIndex(
          item => 
            item.cycle === newData.cycle && 
            item.startDate === newData.startDate &&
            item.endDate === newData.endDate
        );
        
        if (existingIndex >= 0) {
          // Atualizar os dados existentes
          const updatedData = [...prevData];
          updatedData[existingIndex] = newData;
          return updatedData;
        } else {
          // Adicionar os novos dados
          return [...prevData, newData].sort((a, b) => 
            new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
          );
        }
      });
      
      // Atualizar localityData se for o dado mais recente
      setLocalityData(prevData => {
        if (!prevData) return newData;
        
        // Verificar se os novos dados são mais recentes
        if (new Date(newData.endDate).getTime() > new Date(prevData.endDate).getTime()) {
          return newData;
        }
        
        return prevData;
      });
    }
  }, [selectedLocality]);

  // Usar o hook de atualizações em tempo real
  const { isSubscribed } = useRealtimeUpdates(handleRealtimeUpdate, []);

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
              
              {isSubscribed && (
                <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <span>Conectado para atualizações em tempo real</span>
                </div>
              )}
              
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
