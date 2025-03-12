import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LocalityData, WeekSummary } from '@/types/dashboard';
import { ChevronDown, ChevronUp, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import EpidemiologicalWeekSelector from '../formSteps/EpidemiologicalWeekSelector';

interface DashboardByWeekProps {
  data: LocalityData[];
  year: string;
}

const DashboardByWeek: React.FC<DashboardByWeekProps> = ({ data, year }) => {
  const [expandedLocality, setExpandedLocality] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('generalInfo');
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  
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

  // Set initial selectedWeek if not already set and weeks are available
  React.useEffect(() => {
    if (selectedWeek === "" && weekSummaries.length > 0) {
      setSelectedWeek(weekSummaries[0].week);
    }
  }, [weekSummaries, selectedWeek]);
  
  // Prepare chart data
  const chartData = weekSummaries.map(week => ({
    name: `SE ${week.week}`,
    Inspecionados: week.totalInspections,
    'Depósitos Eliminados': week.totalDepositsEliminated,
    'Depósitos Tratados': week.totalDepositsTreated
  }));

  const toggleExpand = (localityId: string) => {
    if (expandedLocality === localityId) {
      setExpandedLocality(null);
    } else {
      setExpandedLocality(localityId);
    }
  };

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
              />
            </div>
          </div>
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
      
      {selectedWeek && weekSummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Semana Epidemiológica {selectedWeek}</CardTitle>
          </CardHeader>
          <CardContent>
            {groupedByWeek[selectedWeek] && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <WeekSummaryCard title="Imóveis" value={groupedByWeek[selectedWeek].totalProperties} />
                  <WeekSummaryCard title="Inspecionados" value={groupedByWeek[selectedWeek].totalInspections} />
                  <WeekSummaryCard title="Depósitos Eliminados" value={groupedByWeek[selectedWeek].totalDepositsEliminated} />
                  <WeekSummaryCard title="Depósitos Tratados" value={groupedByWeek[selectedWeek].totalDepositsTreated} />
                </div>
                
                <div className="mb-4">
                  <Tabs defaultValue="generalInfo" onValueChange={setExpandedSection}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="generalInfo">Informações Gerais</TabsTrigger>
                      <TabsTrigger value="quantitativeData">Dados Quantitativos</TabsTrigger>
                      <TabsTrigger value="depositsData">Depósitos</TabsTrigger>
                      <TabsTrigger value="treatmentData">Tratamento</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="generalInfo">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Localidade</TableHead>
                              <TableHead>Modalidade</TableHead>
                              <TableHead>Ciclo</TableHead>
                              <TableHead>Supervisor</TableHead>
                              <TableHead>Data Início</TableHead>
                              <TableHead>Data Fim</TableHead>
                              <TableHead>Município</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {groupedByWeek[selectedWeek].localities.map((locality, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{locality.locality}</TableCell>
                                <TableCell>{locality.workModality}</TableCell>
                                <TableCell>{locality.cycle}</TableCell>
                                <TableCell>{locality.supervisor}</TableCell>
                                <TableCell>{locality.startDate}</TableCell>
                                <TableCell>{locality.endDate}</TableCell>
                                <TableCell>{locality.municipality}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="quantitativeData">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Localidade</TableHead>
                              <TableHead className="text-right">Residências</TableHead>
                              <TableHead className="text-right">Comércio</TableHead>
                              <TableHead className="text-right">Terreno Baldio</TableHead>
                              <TableHead className="text-right">PE</TableHead>
                              <TableHead className="text-right">Outros</TableHead>
                              <TableHead className="text-right">Total Imóveis</TableHead>
                              <TableHead className="text-right">Inspecionados</TableHead>
                              <TableHead className="text-right">Fechadas</TableHead>
                              <TableHead className="text-right">Recuperadas</TableHead>
                              <TableHead className="text-right">Recusa</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {groupedByWeek[selectedWeek].localities.map((locality, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{locality.locality}</TableCell>
                                <TableCell className="text-right">{locality.qt_residencias}</TableCell>
                                <TableCell className="text-right">{locality.qt_comercio}</TableCell>
                                <TableCell className="text-right">{locality.qt_terreno_baldio}</TableCell>
                                <TableCell className="text-right">{locality.qt_pe}</TableCell>
                                <TableCell className="text-right">{locality.qt_outros}</TableCell>
                                <TableCell className="text-right">{locality.qt_total}</TableCell>
                                <TableCell className="text-right">{locality.inspections}</TableCell>
                                <TableCell className="text-right">{locality.fechadas}</TableCell>
                                <TableCell className="text-right">{locality.recuperadas}</TableCell>
                                <TableCell className="text-right">{locality.recusa}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="depositsData">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Localidade</TableHead>
                              <TableHead className="text-right">A1</TableHead>
                              <TableHead className="text-right">A2</TableHead>
                              <TableHead className="text-right">B</TableHead>
                              <TableHead className="text-right">C</TableHead>
                              <TableHead className="text-right">D1</TableHead>
                              <TableHead className="text-right">D2</TableHead>
                              <TableHead className="text-right">E</TableHead>
                              <TableHead className="text-right">Dep. Eliminados</TableHead>
                              <TableHead className="text-right">Dep. Tratados</TableHead>
                              <TableHead className="text-right">Amostras</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {groupedByWeek[selectedWeek].localities.map((locality, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{locality.locality}</TableCell>
                                <TableCell className="text-right">{locality.a1}</TableCell>
                                <TableCell className="text-right">{locality.a2}</TableCell>
                                <TableCell className="text-right">{locality.b}</TableCell>
                                <TableCell className="text-right">{locality.c}</TableCell>
                                <TableCell className="text-right">{locality.d1}</TableCell>
                                <TableCell className="text-right">{locality.d2}</TableCell>
                                <TableCell className="text-right">{locality.e}</TableCell>
                                <TableCell className="text-right">{locality.depositsEliminated}</TableCell>
                                <TableCell className="text-right">{locality.depositsTreated}</TableCell>
                                <TableCell className="text-right">{locality.amostras_coletadas}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="treatmentData">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Localidade</TableHead>
                              <TableHead className="text-right">T. Focal</TableHead>
                              <TableHead className="text-right">T. Perifocal</TableHead>
                              <TableHead>Larvicida</TableHead>
                              <TableHead className="text-right">Qtd. Larvicida</TableHead>
                              <TableHead>Adulticida</TableHead>
                              <TableHead className="text-right">Qtd. Cargas</TableHead>
                              <TableHead className="text-right">Total Téc. Saúde</TableHead>
                              <TableHead className="text-right">Dias Trabalhados</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {groupedByWeek[selectedWeek].localities.map((locality, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{locality.locality}</TableCell>
                                <TableCell className="text-right">{locality.tratamento_focal}</TableCell>
                                <TableCell className="text-right">{locality.tratamento_perifocal}</TableCell>
                                <TableCell>{locality.larvicida}</TableCell>
                                <TableCell className="text-right">{locality.quantidade_larvicida}</TableCell>
                                <TableCell>{locality.adulticida}</TableCell>
                                <TableCell className="text-right">{locality.quantidade_cargas}</TableCell>
                                <TableCell className="text-right">{locality.total_tec_saude}</TableCell>
                                <TableCell className="text-right">{locality.total_dias_trabalhados}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
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
