
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PenLine } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LocalityData } from '@/types/dashboard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface LocalityDetailsProps {
  data: LocalityData;
}

const LocalityDetails: React.FC<LocalityDetailsProps> = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  const handleEditClick = () => {
    // Mostrar notificação
    toast.info("Preparando edição de dados para " + data.locality);
    setIsEditing(true);
    
    // Converter os dados para o formato do formulário
    const formData = {
      recordId: data.id, // Add the record ID for updating
      municipality: data.municipality,
      locality: data.locality,
      cycle: data.cycle,
      epidemiologicalWeek: data.epidemiologicalWeek,
      workModality: data.workModality,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      qt_residencias: data.qt_residencias.toString(),
      qt_comercio: data.qt_comercio.toString(),
      qt_terreno_baldio: data.qt_terreno_baldio.toString(),
      qt_pe: data.qt_pe.toString(),
      qt_outros: data.qt_outros.toString(),
      qt_total: data.qt_total.toString(),
      tratamento_focal: data.tratamento_focal.toString(),
      tratamento_perifocal: data.tratamento_perifocal.toString(),
      inspecionados: data.inspections.toString(),
      amostras_coletadas: data.amostras_coletadas.toString(),
      recusa: data.recusa.toString(),
      fechadas: data.fechadas.toString(),
      recuperadas: data.recuperadas.toString(),
      a1: data.a1.toString(),
      a2: data.a2.toString(),
      b: data.b.toString(),
      c: data.c.toString(),
      d1: data.d1.toString(),
      d2: data.d2.toString(),
      e: data.e.toString(),
      depositos_eliminados: data.depositsEliminated.toString(),
      larvicida: data.larvicida,
      quantidade_larvicida: data.quantidade_larvicida.toString(),
      quantidade_depositos_tratados: data.quantidade_depositos_tratados.toString(),
      adulticida: data.adulticida,
      quantidade_cargas: data.quantidade_cargas.toString(),
      total_tec_saude: data.total_tec_saude.toString(),
      total_dias_trabalhados: data.total_dias_trabalhados.toString(),
      nome_supervisor: data.supervisor
    };
    
    // Navegar para a página inicial com os dados para edição
    setTimeout(() => {
      navigate('/', { state: { editMode: true, vectorDataToEdit: formData } });
      setIsEditing(false);
    }, 1000);
  };
  
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateStr;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{data.locality}</CardTitle>
            <CardDescription>
              Período: {formatDate(data.startDate)} a {formatDate(data.endDate)}
            </CardDescription>
          </div>
          <Button 
            onClick={handleEditClick}
            variant="outline" 
            size="sm"
            disabled={isEditing}
          >
            <PenLine className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Ciclo</p>
            <p className="text-lg">{data.cycle}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Semana Epidemiológica</p>
            <p className="text-lg">SE {data.epidemiologicalWeek}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Modalidade</p>
            <p className="text-lg">{data.workModality}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Supervisor</p>
            <p className="text-lg">{data.supervisor}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Imóveis Inspecionados</p>
            <p className="text-lg">{data.inspections} de {data.totalProperties}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Depósitos</p>
            <p className="text-lg">{data.depositsEliminated} eliminados, {data.depositsTreated} tratados</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-sm text-muted-foreground">
          {isEditing ? 
            "Preparando modo de edição..." : 
            `Última atualização: ${formatDate(data.endDate)}`
          }
        </div>
      </CardFooter>
    </Card>
  );
};

export default LocalityDetails;
