
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LocalityData } from '@/types/dashboard';
import { ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CycleSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  localities: LocalityData[];
}

const CycleSummaryDialog: React.FC<CycleSummaryDialogProps> = ({
  isOpen,
  onClose,
  localities
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Calcular somas totais do ciclo
  const cycleTotal = localities.reduce((acc, locality) => ({
    totalProperties: acc.totalProperties + locality.totalProperties,
    inspections: acc.inspections + locality.inspections,
    depositsEliminated: acc.depositsEliminated + locality.depositsEliminated,
    depositsTreated: acc.depositsTreated + locality.depositsTreated,
    tratamento_focal: acc.tratamento_focal + locality.tratamento_focal,
    tratamento_perifocal: acc.tratamento_perifocal + locality.tratamento_perifocal,
    amostras_coletadas: acc.amostras_coletadas + locality.amostras_coletadas,
    fechadas: acc.fechadas + locality.fechadas,
    recuperadas: acc.recuperadas + locality.recuperadas,
    qt_residencias: acc.qt_residencias + locality.qt_residencias,
    qt_comercio: acc.qt_comercio + locality.qt_comercio,
    qt_terreno_baldio: acc.qt_terreno_baldio + locality.qt_terreno_baldio,
    qt_pe: acc.qt_pe + locality.qt_pe,
    qt_outros: acc.qt_outros + locality.qt_outros,
    a1: acc.a1 + locality.a1,
    a2: acc.a2 + locality.a2,
    b: acc.b + locality.b,
    c: acc.c + locality.c,
    d1: acc.d1 + locality.d1,
    d2: acc.d2 + locality.d2,
    e: acc.e + locality.e,
  }), {
    totalProperties: 0,
    inspections: 0,
    depositsEliminated: 0,
    depositsTreated: 0,
    tratamento_focal: 0,
    tratamento_perifocal: 0,
    amostras_coletadas: 0,
    fechadas: 0,
    recuperadas: 0,
    qt_residencias: 0,
    qt_comercio: 0,
    qt_terreno_baldio: 0,
    qt_pe: 0,
    qt_outros: 0,
    a1: 0,
    a2: 0,
    b: 0,
    c: 0,
    d1: 0,
    d2: 0,
    e: 0,
  });

  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle>Resumo do Ciclo</DialogTitle>
          <DialogDescription>
            Dados consolidados de {localities.length} localidades
          </DialogDescription>
        </DialogHeader>
        
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto py-4 pr-2"
          style={{ maxHeight: 'calc(80vh - 80px)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <InfoSection title="Informações Quantitativas">
              <InfoItem label="Total de Imóveis" value={cycleTotal.totalProperties} />
              <InfoItem label="Inspecionados" value={cycleTotal.inspections} />
              <InfoItem label="Depósitos Eliminados" value={cycleTotal.depositsEliminated} />
              <InfoItem label="Depósitos Tratados" value={cycleTotal.depositsTreated} />
            </InfoSection>

            <InfoSection title="Tipos de Imóveis">
              <InfoItem label="Residências" value={cycleTotal.qt_residencias} />
              <InfoItem label="Comércios" value={cycleTotal.qt_comercio} />
              <InfoItem label="Terrenos Baldios" value={cycleTotal.qt_terreno_baldio} />
              <InfoItem label="Pontos Estratégicos" value={cycleTotal.qt_pe} />
              <InfoItem label="Outros" value={cycleTotal.qt_outros} />
            </InfoSection>

            <InfoSection title="Tratamentos">
              <InfoItem label="Tratamento Focal" value={cycleTotal.tratamento_focal} />
              <InfoItem label="Tratamento Perifocal" value={cycleTotal.tratamento_perifocal} />
              <InfoItem label="Amostras Coletadas" value={cycleTotal.amostras_coletadas} />
              <InfoItem label="Fechadas" value={cycleTotal.fechadas} />
              <InfoItem label="Recuperadas" value={cycleTotal.recuperadas} />
            </InfoSection>

            <InfoSection title="Depósitos">
              <InfoItem label="A1" value={cycleTotal.a1} />
              <InfoItem label="A2" value={cycleTotal.a2} />
              <InfoItem label="B" value={cycleTotal.b} />
              <InfoItem label="C" value={cycleTotal.c} />
              <InfoItem label="D1" value={cycleTotal.d1} />
              <InfoItem label="D2" value={cycleTotal.d2} />
              <InfoItem label="E" value={cycleTotal.e} />
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

export default CycleSummaryDialog;
