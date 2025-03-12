
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LocalityData, WeekSummary } from '@/types/dashboard';

interface DashboardByWeekProps {
  data: LocalityData[];
  year: string;
}

const DashboardByWeek: React.FC<DashboardByWeekProps> = ({ data, year }) => {
  // Group data by epidemiological week
  const groupedByWeek: Record<string, WeekSummary> = {};
  
  data.forEach(entry => {
    if (!groupedByWeek[entry.epidemiologicalWeek]) {
      groupedByWeek[entry.epidemiologicalWeek] = {
        week: entry.epidemiologicalWeek,
        totalProperties: 0,
        totalInspections: 0,
        totalDepositsEliminated: 0,
        totalDepositsTreated: 0,
        localities: []
      };
    }
    
    groupedByWeek[entry.epidemiologicalWeek].totalProperties += Number(entry.totalProperties);
    groupedByWeek[entry.epidemiologicalWeek].totalInspections += Number(entry.inspections);
    groupedByWeek[entry.epidemiologicalWeek].totalDepositsEliminated += Number(entry.depositsEliminated);
    groupedByWeek[entry.epidemiologicalWeek].totalDepositsTreated += Number(entry.depositsTreated);
    groupedByWeek[entry.epidemiologicalWeek].localities.push(entry);
  });
  
  // Convert grouped data to array and sort by week
  const weekSummaries = Object.values(groupedByWeek).sort((a, b) => 
    parseInt(a.week) - parseInt(b.week)
  );
  
  // Prepare chart data
  const chartData = weekSummaries.map(week => ({
    name: `SE ${week.week}`,
    Inspecionados: week.totalInspections,
    'Depósitos Eliminados': week.totalDepositsEliminated,
    'Depósitos Tratados': week.totalDepositsTreated
  }));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Semana Epidemiológica - {year}</CardTitle>
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
      
      <Tabs defaultValue={weekSummaries.length > 0 ? weekSummaries[0].week : "01"}>
        <TabsList className="flex flex-wrap">
          {weekSummaries.map(week => (
            <TabsTrigger key={week.week} value={week.week}>
              SE {week.week}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {weekSummaries.map(week => (
          <TabsContent key={week.week} value={week.week} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Semana Epidemiológica {week.week}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <WeekSummaryCard title="Imóveis" value={week.totalProperties} />
                  <WeekSummaryCard title="Inspecionados" value={week.totalInspections} />
                  <WeekSummaryCard title="Depósitos Eliminados" value={week.totalDepositsEliminated} />
                  <WeekSummaryCard title="Depósitos Tratados" value={week.totalDepositsTreated} />
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Localidade</TableHead>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Ciclo</TableHead>
                      <TableHead className="text-right">Imóveis</TableHead>
                      <TableHead className="text-right">Inspecionados</TableHead>
                      <TableHead className="text-right">Depósitos Eliminados</TableHead>
                      <TableHead className="text-right">Depósitos Tratados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {week.localities.map((locality, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{locality.locality}</TableCell>
                        <TableCell>{locality.workModality}</TableCell>
                        <TableCell>{locality.cycle}</TableCell>
                        <TableCell className="text-right">{locality.totalProperties}</TableCell>
                        <TableCell className="text-right">{locality.inspections}</TableCell>
                        <TableCell className="text-right">{locality.depositsEliminated}</TableCell>
                        <TableCell className="text-right">{locality.depositsTreated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const WeekSummaryCard = ({ title, value }: { title: string; value: number }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default DashboardByWeek;
