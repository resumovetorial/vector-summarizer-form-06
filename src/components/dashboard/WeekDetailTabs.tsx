import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { LocalityData } from '@/types/dashboard';
import LocalityDetailsDialog from './LocalityDetailsDialog';
import CycleSummaryDialog from './CycleSummaryDialog';

interface WeekDetailTabsProps {
  groupedByWeek: Record<string, any>;
  selectedWeek: string;
  expandedSection: string;
  setExpandedSection: (section: string) => void;
}

const WeekDetailTabs: React.FC<WeekDetailTabsProps> = ({ 
  groupedByWeek, 
  selectedWeek, 
  expandedSection, 
  setExpandedSection 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showCycleSummary, setShowCycleSummary] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<LocalityData | null>(null);

  if (!selectedWeek || !groupedByWeek[selectedWeek]) {
    return null;
  }

  const handleShowDetails = (locality: LocalityData) => {
    setSelectedLocality(locality);
    setShowDetails(true);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          variant="default"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setShowCycleSummary(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Detalhes do Ciclo
        </Button>
      </div>

      <Tabs defaultValue="generalInfo" onValueChange={setExpandedSection} value={expandedSection}>
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
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedByWeek[selectedWeek].localities.map((locality: LocalityData, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{locality.locality}</TableCell>
                    <TableCell>{locality.workModality}</TableCell>
                    <TableCell>{locality.cycle}</TableCell>
                    <TableCell>{locality.supervisor}</TableCell>
                    <TableCell>{locality.startDate}</TableCell>
                    <TableCell>{locality.endDate}</TableCell>
                    <TableCell>{locality.municipality}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleShowDetails(locality)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
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
                {groupedByWeek[selectedWeek].localities.map((locality: LocalityData, idx: number) => (
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
                {groupedByWeek[selectedWeek].localities.map((locality: LocalityData, idx: number) => (
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
                {groupedByWeek[selectedWeek].localities.map((locality: LocalityData, idx: number) => (
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

      {selectedLocality && (
        <LocalityDetailsDialog
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedLocality(null);
          }}
          locality={selectedLocality}
        />
      )}

      <CycleSummaryDialog
        isOpen={showCycleSummary}
        onClose={() => setShowCycleSummary(false)}
        localities={groupedByWeek[selectedWeek].localities}
      />
    </>
  );
};

export default WeekDetailTabs;
