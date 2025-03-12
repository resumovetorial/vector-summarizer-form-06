
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LocalityData, CycleSummary } from '@/types/dashboard';
import { ChevronDown, ChevronUp, List, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardByCycleProps {
  data: LocalityData[];
  year: string;
}

const DashboardByCycle: React.FC<DashboardByCycleProps> = ({ data, year }) => {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [expandedLocality, setExpandedLocality] = useState<string | null>(null);
  
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

  const toggleExpand = (localityKey: string) => {
    if (expandedLocality === localityKey) {
      setExpandedLocality(null);
    } else {
      setExpandedLocality(localityKey);
    }
  };

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
        <div className="flex justify-between items-center mb-4">
          <TabsList className="flex flex-wrap">
            {modalities.map(modality => (
              <TabsTrigger key={modality} value={modality}>
                {modality}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('card')}
            >
              <List className="h-4 w-4 mr-2" />
              Cartões
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <Table2 className="h-4 w-4 mr-2" />
              Tabela
            </Button>
          </div>
        </div>
        
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
                        
                        {viewMode === 'card' ? (
                          <div className="grid grid-cols-1 gap-4">
                            {cycle.localities.map((locality, idx) => {
                              const localityKey = `${locality.locality}-${modality}-${cycle.cycle}-${idx}`;
                              const isExpanded = expandedLocality === localityKey;
                              
                              return (
                                <Card key={localityKey} className="overflow-hidden">
                                  <CardHeader className="bg-muted/50 p-4">
                                    <div className="flex justify-between items-center">
                                      <CardTitle className="text-lg">{locality.locality}</CardTitle>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => toggleExpand(localityKey)}
                                      >
                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                      </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                      <span>Semana: SE {locality.epidemiologicalWeek}</span>
                                      <span>•</span>
                                      <span>Período: {new Date(locality.startDate).toLocaleDateString()} - {new Date(locality.endDate).toLocaleDateString()}</span>
                                    </div>
                                  </CardHeader>
                                  
                                  <CardContent className="p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                      <DataItem label="Imóveis" value={locality.totalProperties} />
                                      <DataItem label="Inspecionados" value={locality.inspections} />
                                      <DataItem label="Depósitos Eliminados" value={locality.depositsEliminated} />
                                      <DataItem label="Depósitos Tratados" value={locality.depositsTreated} />
                                    </div>
                                    
                                    {isExpanded && (
                                      <div className="mt-4 border-t pt-4">
                                        <h4 className="font-medium mb-3">Detalhes Completos</h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
                                          <div>
                                            <h5 className="text-sm font-medium mb-2">Informações Gerais</h5>
                                            <ul className="space-y-1 text-sm">
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Município:</span>
                                                <span>{locality.municipality}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Supervisor:</span>
                                                <span>{locality.supervisor}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Total Técnicos:</span>
                                                <span>{locality.total_tec_saude}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Dias Trabalhados:</span>
                                                <span>{locality.total_dias_trabalhados}</span>
                                              </li>
                                            </ul>
                                          </div>
                                          
                                          <div>
                                            <h5 className="text-sm font-medium mb-2">Tipos de Imóveis</h5>
                                            <ul className="space-y-1 text-sm">
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Residências:</span>
                                                <span>{locality.qt_residencias}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Comércio:</span>
                                                <span>{locality.qt_comercio}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Terreno Baldio:</span>
                                                <span>{locality.qt_terreno_baldio}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Pontos Estratégicos:</span>
                                                <span>{locality.qt_pe}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Outros:</span>
                                                <span>{locality.qt_outros}</span>
                                              </li>
                                            </ul>
                                          </div>
                                          
                                          <div>
                                            <h5 className="text-sm font-medium mb-2">Inspeções e Tratamentos</h5>
                                            <ul className="space-y-1 text-sm">
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Trat. Focal:</span>
                                                <span>{locality.tratamento_focal}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Trat. Perifocal:</span>
                                                <span>{locality.tratamento_perifocal}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Amostras Coletadas:</span>
                                                <span>{locality.amostras_coletadas}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Recusa:</span>
                                                <span>{locality.recusa}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Fechadas:</span>
                                                <span>{locality.fechadas}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Recuperadas:</span>
                                                <span>{locality.recuperadas}</span>
                                              </li>
                                            </ul>
                                          </div>
                                          
                                          <div>
                                            <h5 className="text-sm font-medium mb-2">Tipos de Depósitos</h5>
                                            <ul className="space-y-1 text-sm">
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">A1:</span>
                                                <span>{locality.a1}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">A2:</span>
                                                <span>{locality.a2}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">B:</span>
                                                <span>{locality.b}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">C:</span>
                                                <span>{locality.c}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">D1:</span>
                                                <span>{locality.d1}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">D2:</span>
                                                <span>{locality.d2}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">E:</span>
                                                <span>{locality.e}</span>
                                              </li>
                                            </ul>
                                          </div>
                                          
                                          <div>
                                            <h5 className="text-sm font-medium mb-2">Tratamento</h5>
                                            <ul className="space-y-1 text-sm">
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Larvicida:</span>
                                                <span>{locality.larvicida}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Quant. Larvicida:</span>
                                                <span>{locality.quantidade_larvicida}</span>
                                              </li>
                                              <li className="flex justify-between">
                                                <span className="text-muted-foreground">Depósitos Tratados:</span>
                                                <span>{locality.quantidade_depositos_tratados}</span>
                                              </li>
                                              {locality.workModality === 'PE' && (
                                                <>
                                                  <li className="flex justify-between">
                                                    <span className="text-muted-foreground">Adulticida:</span>
                                                    <span>{locality.adulticida}</span>
                                                  </li>
                                                  <li className="flex justify-between">
                                                    <span className="text-muted-foreground">Quant. Cargas:</span>
                                                    <span>{locality.quantidade_cargas}</span>
                                                  </li>
                                                </>
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        ) : (
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
                        )}
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

const DataItem = ({ label, value }: { label: string; value: number | string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export default DashboardByCycle;
