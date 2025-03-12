
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LocalityData, CycleSummary } from '@/types/dashboard';

interface DashboardByCycleProps {
  data: LocalityData[];
  year: string;
}

const DashboardByCycle: React.FC<DashboardByCycleProps> = ({ data, year }) => {
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
      
      <Tabs defaultValue={modalities.length > 0 ? modalities[0] : "LI"}>
        <TabsList className="flex flex-wrap">
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
                  <TabsList className="flex flex-wrap">
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                          <CycleSummaryCard title="Imóveis" value={cycle.totalProperties} />
                          <CycleSummaryCard title="Inspecionados" value={cycle.totalInspections} />
                          <CycleSummaryCard title="Depósitos Eliminados" value={cycle.totalDepositsEliminated} />
                          <CycleSummaryCard title="Depósitos Tratados" value={cycle.totalDepositsTreated} />
                        </div>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Localidade</TableHead>
                              <TableHead>Semana</TableHead>
                              <TableHead className="text-right">Imóveis</TableHead>
                              <TableHead className="text-right">Inspecionados</TableHead>
                              <TableHead className="text-right">Depósitos Eliminados</TableHead>
                              <TableHead className="text-right">Depósitos Tratados</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cycle.localities.map((locality, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{locality.locality}</TableCell>
                                <TableCell>SE {locality.epidemiologicalWeek}</TableCell>
                                <TableCell className="text-right">{locality.totalProperties}</TableCell>
                                <TableCell className="text-right">{locality.inspections}</TableCell>
                                <TableCell className="text-right">{locality.depositsEliminated}</TableCell>
                                <TableCell className="text-right">{locality.depositsTreated}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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

const CycleSummaryCard = ({ title, value }: { title: string; value: number }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default DashboardByCycle;
