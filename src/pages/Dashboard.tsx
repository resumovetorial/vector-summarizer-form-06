
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardByCycle from '@/components/dashboard/DashboardByCycle';
import DashboardByWeek from '@/components/dashboard/DashboardByWeek';
import { BarChart4, RotateCcw, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockDashboardData, fetchDashboardData } from '@/services/dashboardService';
import { LocalityData } from '@/types/dashboard';
import LocalitySelector from '@/components/formSteps/LocalitySelector';
import LocalityDetails from '@/components/dashboard/LocalityDetails';

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'week' | 'cycle'>('week');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [localityData, setLocalityData] = useState<LocalityData | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    toast({
      title: "Atualizando dados",
      description: "Os dados estão sendo atualizados...",
    });

    try {
      // In a real application, we would fetch from API
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

  // Get unique list of localities from the data
  const localities = [...new Set(dashboardData.map(item => item.locality))].sort();

  // Handle locality selection
  const handleLocalityChange = (value: string) => {
    setSelectedLocality(value);

    // Find the most recent data for the selected locality
    if (value) {
      const filteredData = dashboardData
        .filter(item => item.locality === value)
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
      
      if (filteredData.length > 0) {
        setLocalityData(filteredData[0]);
      } else {
        setLocalityData(null);
      }
    } else {
      setLocalityData(null);
    }
  };

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [year]);

  return (
    <div className="min-h-screen flex flex-col background-gradient">
      <div className="container px-4 sm:px-6 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 sm:py-12">
          <div className="w-full max-w-7xl mx-auto">
            <div className="glass-card rounded-xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Dashboard de Resumo</h1>
                  <p className="text-muted-foreground">Visualize os dados de todas as localidades</p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={refreshData} 
                    disabled={isLoading}
                  >
                    <RotateCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </div>
              </div>
              
              {/* Locality Selector */}
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
