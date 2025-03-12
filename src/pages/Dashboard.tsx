
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardByCycle from '@/components/dashboard/DashboardByCycle';
import DashboardByWeek from '@/components/dashboard/DashboardByWeek';
import { BarChart4, RotateCcw, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockDashboardData, fetchDashboardData } from '@/services/dashboardService';
import { LocalityData } from '@/types/dashboard';
import LocalitySelector from '@/components/formSteps/LocalitySelector';
import LocalityDetails from '@/components/dashboard/LocalityDetails';
import LocalityDataTable from '@/components/dashboard/LocalityDataTable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'week' | 'cycle'>('week');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [localityData, setLocalityData] = useState<LocalityData | null>(null);
  const [localityHistoricalData, setLocalityHistoricalData] = useState<LocalityData[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = React.useRef<HTMLDivElement>(null);

  const refreshData = async () => {
    setIsLoading(true);
    toast({
      title: "Atualizando dados",
      description: "Os dados estão sendo atualizados...",
    });

    try {
      const data = await fetchDashboardData(year);
      setDashboardData(data);
      
      toast({
        title: "Dados atualizados",
        description: "Os dados foram atualizados com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    setIsExporting(true);
    toast({
      title: "Exportando dados",
      description: "Preparando arquivo Excel...",
    });

    try {
      let dataToExport = [];
      
      if (selectedLocality && localityHistoricalData.length > 0) {
        dataToExport = localityHistoricalData.map(item => ({
          Localidade: item.locality,
          Município: item.municipality,
          Modalidade: item.workModality,
          Ciclo: item.cycle,
          'Semana Epidemiológica': item.epidemiologicalWeek,
          'Início do Período': new Date(item.startDate).toLocaleDateString(),
          'Fim do Período': new Date(item.endDate).toLocaleDateString(),
          'Total de Imóveis': item.totalProperties,
          'Imóveis Inspecionados': item.inspections,
          'Depósitos Eliminados': item.depositsEliminated,
          'Depósitos Tratados': item.depositsTreated,
          'Supervisor': item.supervisor,
          'A1': item.a1,
          'A2': item.a2,
          'B': item.b,
          'C': item.c,
          'D1': item.d1,
          'D2': item.d2,
          'E': item.e,
          'Larvicida': item.larvicida || '-',
          'Adulticida': item.adulticida || '-',
          'Tratamento Focal': item.tratamento_focal,
          'Tratamento Perifocal': item.tratamento_perifocal,
          'Amostras Coletadas': item.amostras_coletadas,
          'Recusa': item.recusa,
          'Fechadas': item.fechadas,
          'Recuperadas': item.recuperadas
        }));
      } else {
        dataToExport = dashboardData.map(item => ({
          Localidade: item.locality,
          Município: item.municipality,
          Modalidade: item.workModality,
          Ciclo: item.cycle,
          'Semana Epidemiológica': item.epidemiologicalWeek,
          'Início do Período': new Date(item.startDate).toLocaleDateString(),
          'Fim do Período': new Date(item.endDate).toLocaleDateString(),
          'Total de Imóveis': item.totalProperties,
          'Imóveis Inspecionados': item.inspections,
          'Depósitos Eliminados': item.depositsEliminated,
          'Depósitos Tratados': item.depositsTreated,
          'Supervisor': item.supervisor
        }));
      }

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard");
      
      const date = new Date().toISOString().split('T')[0];
      let filename = `ENDEMIAS_ITABUNA_${date}`;
      
      if (selectedLocality) {
        filename += `_${selectedLocality}`;
      }
      
      filename += '.xlsx';
      
      XLSX.writeFile(workbook, filename);
      
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso para Excel!",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados para Excel.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    toast({
      title: "Exportando dados",
      description: "Preparando arquivo PDF...",
    });

    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      const date = new Date().toISOString().split('T')[0];
      let filename = `ENDEMIAS_ITABUNA_${date}`;
      
      if (selectedLocality) {
        filename += `_${selectedLocality}`;
      }
      
      filename += '.pdf';
      
      pdf.save(filename);
      
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso para PDF!",
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados para PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const localities = [...new Set(dashboardData.map(item => item.locality))].sort();

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
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Dashboard de Resumo</h1>
                  <p className="text-muted-foreground">Visualize os dados de todas as localidades</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2028">2028</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={refreshData} 
                    disabled={isLoading || isExporting}
                  >
                    <RotateCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={exportToExcel}
                    disabled={isLoading || isExporting}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={exportToPDF}
                    disabled={isLoading || isExporting}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
              
              <div className="mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Detalhes por Localidade</CardTitle>
                    <CardDescription>
                      Selecione uma localidade para visualizar todos os dados inseridos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-w-md mx-auto md:mx-0">
                      <LocalitySelector
                        value={selectedLocality}
                        onChange={handleLocalityChange}
                      />
                    </div>
                    
                    {localityData && (
                      <div className="mt-6">
                        <LocalityDetails data={localityData} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {selectedLocality && localityHistoricalData.length > 0 && (
                <div className="mb-8">
                  <LocalityDataTable data={localityHistoricalData} />
                </div>
              )}
              
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
