
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocalityData } from '@/types/dashboard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronUp, Filter, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocalityDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  locality: LocalityData | null;
}

const LocalityDetailsDialog: React.FC<LocalityDetailsDialogProps> = ({
  isOpen,
  onClose,
  locality
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [filterWeek, setFilterWeek] = useState<string>("all");
  const [filterCycle, setFilterCycle] = useState<string>("all");
  
  if (!locality) return null;

  // Filter data based on selected filters
  const filteredLocality = 
    (filterWeek === "all" && filterCycle === "all") ? locality :
    (filterWeek !== "all" && filterCycle === "all") ? { ...locality, epidemiologicalWeek: filterWeek } :
    (filterWeek === "all" && filterCycle !== "all") ? { ...locality, cycle: filterCycle } :
    { ...locality, epidemiologicalWeek: filterWeek, cycle: filterCycle };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateStr;
    }
  };

  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  };

  // Get unique weeks and cycles for filters
  const uniqueWeeks = ["all", locality.epidemiologicalWeek].filter((v, i, a) => a.indexOf(v) === i);
  const uniqueCycles = ["all", locality.cycle].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle>Detalhes da Localidade: {locality.locality}</DialogTitle>
          
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Semana:</span>
              <Select value={filterWeek} onValueChange={setFilterWeek}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione a semana" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueWeeks.map(week => (
                    <SelectItem key={week} value={week}>
                      {week === "all" ? "Todas as semanas" : `Semana ${week}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Ciclo:</span>
              <Select value={filterCycle} onValueChange={setFilterCycle}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o ciclo" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCycles.map(cycle => (
                    <SelectItem key={cycle} value={cycle}>
                      {cycle === "all" ? "Todos os ciclos" : `Ciclo ${cycle}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>
        
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto py-4 pr-2"
          style={{ maxHeight: 'calc(80vh - 80px)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <InfoSection title="Informações Gerais">
              <InfoItem label="Município" value={filteredLocality.municipality} />
              <InfoItem label="Ciclo" value={filteredLocality.cycle} />
              <InfoItem label="Semana Epidemiológica" value={filteredLocality.epidemiologicalWeek} />
              <InfoItem label="Modalidade" value={filteredLocality.workModality} />
              <InfoItem label="Data Início" value={formatDate(filteredLocality.startDate)} />
              <InfoItem label="Data Fim" value={formatDate(filteredLocality.endDate)} />
              <InfoItem label="Supervisor" value={filteredLocality.supervisor} />
            </InfoSection>

            <InfoSection title="Quantitativos">
              <InfoItem label="Total de Imóveis" value={filteredLocality.totalProperties} />
              <InfoItem label="Inspecionados" value={filteredLocality.inspections} />
              <InfoItem label="Depósitos Eliminados" value={filteredLocality.depositsEliminated} />
              <InfoItem label="Depósitos Tratados" value={filteredLocality.depositsTreated} />
            </InfoSection>

            <InfoSection title="Tipos de Imóveis">
              <InfoItem label="Residências" value={filteredLocality.qt_residencias} />
              <InfoItem label="Comércios" value={filteredLocality.qt_comercio} />
              <InfoItem label="Terrenos Baldios" value={filteredLocality.qt_terreno_baldio} />
              <InfoItem label="Pontos Estratégicos" value={filteredLocality.qt_pe} />
              <InfoItem label="Outros" value={filteredLocality.qt_outros} />
              <InfoItem label="Total" value={filteredLocality.qt_total} />
            </InfoSection>

            <InfoSection title="Tratamentos">
              <InfoItem label="Tratamento Focal" value={filteredLocality.tratamento_focal} />
              <InfoItem label="Tratamento Perifocal" value={filteredLocality.tratamento_perifocal} />
              <InfoItem label="Amostras Coletadas" value={filteredLocality.amostras_coletadas} />
              <InfoItem label="Fechadas" value={filteredLocality.fechadas} />
              <InfoItem label="Recuperadas" value={filteredLocality.recuperadas} />
            </InfoSection>

            <InfoSection title="Depósitos">
              <InfoItem label="A1" value={filteredLocality.a1} />
              <InfoItem label="A2" value={filteredLocality.a2} />
              <InfoItem label="B" value={filteredLocality.b} />
              <InfoItem label="C" value={filteredLocality.c} />
              <InfoItem label="D1" value={filteredLocality.d1} />
              <InfoItem label="D2" value={filteredLocality.d2} />
              <InfoItem label="E" value={filteredLocality.e} />
            </InfoSection>

            <InfoSection title="Tratamento de Depósitos">
              <InfoItem label="Larvicida" value={filteredLocality.larvicida || 'Não informado'} />
              <InfoItem label="Quantidade Larvicida" value={filteredLocality.quantidade_larvicida} />
              <InfoItem label="Depósitos Tratados" value={filteredLocality.quantidade_depositos_tratados} />
              <InfoItem label="Adulticida" value={filteredLocality.adulticida || 'Não informado'} />
              <InfoItem label="Quantidade Cargas" value={filteredLocality.quantidade_cargas} />
            </InfoSection>

            <InfoSection title="Recursos Humanos">
              <InfoItem label="Total Técnicos de Saúde" value={filteredLocality.total_tec_saude} />
              <InfoItem label="Total Dias Trabalhados" value={filteredLocality.total_dias_trabalhados} />
            </InfoSection>
          </div>
        </div>
        
        <div className="sticky bottom-4 right-4 flex justify-end px-4 pt-2 border-t bg-background">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="font-semibold text-lg">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
);

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-2">
    <span className="text-sm text-muted-foreground">{label}:</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default LocalityDetailsDialog;
