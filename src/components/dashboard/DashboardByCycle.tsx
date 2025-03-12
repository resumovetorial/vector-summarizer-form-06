
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LocalityData, CycleSummary } from '@/types/dashboard';
import { Table2, FilePieChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardByCycleProps {
  data: LocalityData[];
  year: string;
}

const DashboardByCycle: React.FC<DashboardByCycleProps> = ({ data, year }) => {
  const [showChart, setShowChart] = useState(true);
  
  // Group data by cycle and modality
  const groupedByCycleAndModality: Record<string, CycleSummary> = {};
  
  data.forEach(entry => {
    const key = `${entry.workModality}-${entry.cycle}`;
    if (!groupedByCycleAndModality[key]) {
      groupedByCycleAndModality[key] = {
        workModality: entry.workModality,
        cycle: entry.cycle,
        totalProperties: 0,
        totalInspections: 0,
        totalDepositsEliminated: 0,
        totalDepositsTreated: 0,
        localities: []
      };
    }
    
    groupedByCycleAndModality[key].totalProperties += Number(entry.totalProperties);
    groupedByCycleAndModality[key].totalInspections += Number(entry.inspections);
    groupedByCycleAndModality[key].totalDepositsEliminated += Number(entry.depositsEliminated);
    groupedByCycleAndModality[key].totalDepositsTreated += Number(entry.depositsTreated);
    groupedByCycleAndModality[key].localities.push(entry);
  });
  
  // Convert grouped data to array and sort
  const cycleSummaries = Object.values(groupedByCycleAndModality).sort((a, b) => {
    if (a.workModality !== b.workModality) {
      return a.workModality.localeCompare(b.workModality);
    }
    return parseInt(a.cycle) - parseInt(b.cycle);
  });
  
  // Get unique modalities
  const modalities = [...new Set(cycleSummaries.map(item => item.workModality))];
  
  // Prepare chart data
  const chartData = cycleSummaries.map(cycle => ({
    name: `${cycle.workModality} - Ciclo ${cycle.cycle}`,
    Inspecionados: cycle.totalInspections,
    'Depósitos Eliminados': cycle.totalDepositsEliminated,
    'Depósitos Tratados': cycle.totalDepositsTreated
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button
          variant={showChart ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowChart(!showChart)}
          className="mr-2"
        >
          <FilePieChart2 className="h-4 w-4 mr-2" />
          {showChart ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
        </Button>
      </div>
      
      {showChart && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo por Ciclo - {year}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Inspecionados" fill="#4f46e5" />
                  <Bar dataKey="Depósitos Eliminados" fill="#ef4444" />
                  <Bar dataKey="Depósitos Tratados" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue={modalities.length > 0 ? modalities[0] : "LI"}>
        <TabsList className="flex flex-wrap mb-4">
          {modalities.map(modality => (
            <TabsTrigger key={modality} value={modality}>
              {modality}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {modalities.map(modality => (
          <TabsContent key={modality} value={modality} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Modalidade: {modality}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={
                  cycleSummaries
                    .filter(c => c.workModality === modality)
                    .sort((a, b) => parseInt(a.cycle) - parseInt(b.cycle))
                    .length > 0 
                      ? cycleSummaries.filter(c => c.workModality === modality)[0].cycle 
                      : "01"
                }>
                  <TabsList className="flex flex-wrap mb-6">
                    {cycleSummaries
                      .filter(cycle => cycle.workModality === modality)
                      .map(cycle => (
                        <TabsTrigger key={cycle.cycle} value={cycle.cycle}>
                          Ciclo {cycle.cycle}
                        </TabsTrigger>
                      ))
                    }
                  </TabsList>
                  
                  {cycleSummaries
                    .filter(cycle => cycle.workModality === modality)
                    .map(cycle => (
                      <TabsContent key={cycle.cycle} value={cycle.cycle} className="mt-6">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Localidade</TableHead>
                                <TableHead>Semana</TableHead>
                                <TableHead>Supervisor</TableHead>
                                <TableHead className="text-right">Imóveis</TableHead>
                                <TableHead className="text-right">Inspecionados</TableHead>
                                <TableHead className="text-right">Dep. Elim.</TableHead>
                                <TableHead className="text-right">Dep. Trat.</TableHead>
                                <TableHead className="text-right">T. Focal</TableHead>
                                <TableHead className="text-right">T. Perifocal</TableHead>
                                <TableHead className="text-right">Amostras</TableHead>
                                <TableHead className="text-right">Fechadas</TableHead>
                                <TableHead className="text-right">Recuperadas</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {cycle.localities.map((locality, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-medium">{locality.locality}</TableCell>
                                  <TableCell>SE {locality.epidemiologicalWeek}</TableCell>
                                  <TableCell>{locality.supervisor}</TableCell>
                                  <TableCell className="text-right">{locality.totalProperties}</TableCell>
                                  <TableCell className="text-right">{locality.inspections}</TableCell>
                                  <TableCell className="text-right">{locality.depositsEliminated}</TableCell>
                                  <TableCell className="text-right">{locality.depositsTreated}</TableCell>
                                  <TableCell className="text-right">{locality.tratamento_focal}</TableCell>
                                  <TableCell className="text-right">{locality.tratamento_perifocal}</TableCell>
                                  <TableCell className="text-right">{locality.amostras_coletadas}</TableCell>
                                  <TableCell className="text-right">{locality.fechadas}</TableCell>
                                  <TableCell className="text-right">{locality.recuperadas}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    ))
                  }
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DashboardByCycle;
