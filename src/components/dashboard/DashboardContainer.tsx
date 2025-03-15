
import React, { useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardLocalitySection from '@/components/dashboard/DashboardLocalitySection';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { useDashboardExport } from '@/hooks/useDashboardExport';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { supabase } from '@/lib/supabase';
import { LocalityData } from '@/types/dashboard';

interface DashboardContainerProps {
  isLoading: boolean;
  year: string;
  setYear: (year: string) => void;
  dashboardData: LocalityData[];
  selectedLocality: string;
  localityData: LocalityData | null;
  localityHistoricalData: LocalityData[];
  view: 'week' | 'cycle';
  setView: (view: 'week' | 'cycle') => void;
  refreshData: () => void;
  handleLocalityChange: (value: string) => void;
  updateDashboardData: (newData: LocalityData) => void;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  isLoading,
  year,
  setYear,
  dashboardData,
  selectedLocality,
  localityData,
  localityHistoricalData,
  view,
  setView,
  refreshData,
  handleLocalityChange,
  updateDashboardData
}) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const { exportToExcel, exportToPDF } = useDashboardExport({
    dashboardRef,
    dashboardData,
    selectedLocality,
    localityHistoricalData,
    setIsExporting
  });

  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (!payload || !payload.new) {
      console.log('Received empty realtime update');
      return;
    }
    
    const item = payload.new;
    console.log('Received realtime update:', item);
    
    const newData: LocalityData = {
      municipality: item.municipality,
      locality: item.locality_id,
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
        
        updateDashboardData(newData);
      } catch (err) {
        console.error('Error fetching locality name:', err);
        updateDashboardData(newData);
      }
    };
    
    fetchLocalityName();
  }, [selectedLocality, updateDashboardData]);

  const { isSubscribed } = useRealtimeUpdates(handleRealtimeUpdate, []);

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
              
              <DashboardTabs 
                view={view}
                setView={setView}
                dashboardData={dashboardData}
                year={year}
              />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default DashboardContainer;
