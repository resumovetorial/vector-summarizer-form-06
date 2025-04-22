
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocalityData } from '@/types/dashboard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area";

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
  if (!locality) return null;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes da Localidade: {locality.locality}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <InfoSection title="Informações Gerais">
              <InfoItem label="Município" value={locality.municipality} />
              <InfoItem label="Ciclo" value={locality.cycle} />
              <InfoItem label="Semana Epidemiológica" value={locality.epidemiologicalWeek} />
              <InfoItem label="Modalidade" value={locality.workModality} />
              <InfoItem label="Data Início" value={formatDate(locality.startDate)} />
              <InfoItem label="Data Fim" value={formatDate(locality.endDate)} />
              <InfoItem label="Supervisor" value={locality.supervisor} />
            </InfoSection>

            <InfoSection title="Quantitativos">
              <InfoItem label="Residências" value={locality.qt_residencias} />
              <InfoItem label="Comércios" value={locality.qt_comercio} />
              <InfoItem label="Terrenos Baldios" value={locality.qt_terreno_baldio} />
              <InfoItem label="Pontos Estratégicos" value={locality.qt_pe} />
              <InfoItem label="Outros" value={locality.qt_outros} />
              <InfoItem label="Total" value={locality.qt_total} />
            </InfoSection>

            <InfoSection title="Tratamentos">
              <InfoItem label="Tratamento Focal" value={locality.tratamento_focal} />
              <InfoItem label="Tratamento Perifocal" value={locality.tratamento_perifocal} />
              <InfoItem label="Amostras Coletadas" value={locality.amostras_coletadas} />
              <InfoItem label="Fechadas" value={locality.fechadas} />
              <InfoItem label="Recuperadas" value={locality.recuperadas} />
            </InfoSection>

            <InfoSection title="Depósitos">
              <InfoItem label="A1" value={locality.a1} />
              <InfoItem label="A2" value={locality.a2} />
              <InfoItem label="B" value={locality.b} />
              <InfoItem label="C" value={locality.c} />
              <InfoItem label="D1" value={locality.d1} />
              <InfoItem label="D2" value={locality.d2} />
              <InfoItem label="E" value={locality.e} />
            </InfoSection>

            <InfoSection title="Tratamento de Depósitos">
              <InfoItem label="Larvicida" value={locality.larvicida || 'Não informado'} />
              <InfoItem label="Quantidade Larvicida" value={locality.quantidade_larvicida} />
              <InfoItem label="Depósitos Tratados" value={locality.quantidade_depositos_tratados} />
              <InfoItem label="Adulticida" value={locality.adulticida || 'Não informado'} />
              <InfoItem label="Quantidade Cargas" value={locality.quantidade_cargas} />
            </InfoSection>

            <InfoSection title="Recursos Humanos">
              <InfoItem label="Total Técnicos de Saúde" value={locality.total_tec_saude} />
              <InfoItem label="Total Dias Trabalhados" value={locality.total_dias_trabalhados} />
            </InfoSection>
          </div>
        </ScrollArea>
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
