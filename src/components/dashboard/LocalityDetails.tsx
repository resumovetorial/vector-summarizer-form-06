
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PenLine, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LocalityData } from '@/types/dashboard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { fetchVectorDataById } from '@/services/vector/vectorDataSaveService';

interface LocalityDetailsProps {
  data: LocalityData;
  refreshData?: () => void;
}

const LocalityDetails: React.FC<LocalityDetailsProps> = ({ data, refreshData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleEditClick = async () => {
    // Check if we have an ID
    if (!data.id) {
      toast.error("Não é possível editar: ID do registro não encontrado");
      return;
    }
    
    // Show toast and set loading state
    toast.info("Preparando edição de dados para " + data.locality);
    setIsEditing(true);
    setIsLoading(true);
    
    try {
      // Buscar os dados mais atualizados diretamente do banco
      const freshData = await fetchVectorDataById(data.id);
      
      if (!freshData) {
        throw new Error("Não foi possível obter os dados mais recentes para edição");
      }
      
      console.log("Dados atualizados obtidos para edição:", freshData);
      
      // Convert data to form format
      const formData = {
        recordId: data.id, // Ensure ID is correctly passed
        municipality: freshData.municipality || data.municipality,
        locality: freshData.localities?.name || data.locality,
        cycle: freshData.cycle || data.cycle,
        epidemiologicalWeek: freshData.epidemiological_week || data.epidemiologicalWeek,
        workModality: freshData.work_modality || data.workModality,
        startDate: new Date(freshData.start_date || data.startDate),
        endDate: new Date(freshData.end_date || data.endDate),
        qt_residencias: (freshData.qt_residencias ?? data.qt_residencias).toString(),
        qt_comercio: (freshData.qt_comercio ?? data.qt_comercio).toString(),
        qt_terreno_baldio: (freshData.qt_terreno_baldio ?? data.qt_terreno_baldio).toString(),
        qt_pe: (freshData.qt_pe ?? data.qt_pe).toString(),
        qt_outros: (freshData.qt_outros ?? data.qt_outros).toString(),
        qt_total: (freshData.qt_total ?? data.qt_total).toString(),
        tratamento_focal: (freshData.tratamento_focal ?? data.tratamento_focal).toString(),
        tratamento_perifocal: (freshData.tratamento_perifocal ?? data.tratamento_perifocal).toString(),
        inspecionados: (freshData.inspections ?? data.inspections).toString(),
        amostras_coletadas: (freshData.amostras_coletadas ?? data.amostras_coletadas).toString(),
        recusa: (freshData.recusa ?? data.recusa).toString(),
        fechadas: (freshData.fechadas ?? data.fechadas).toString(),
        recuperadas: (freshData.recuperadas ?? data.recuperadas).toString(),
        a1: (freshData.a1 ?? data.a1).toString(),
        a2: (freshData.a2 ?? data.a2).toString(),
        b: (freshData.b ?? data.b).toString(),
        c: (freshData.c ?? data.c).toString(),
        d1: (freshData.d1 ?? data.d1).toString(),
        d2: (freshData.d2 ?? data.d2).toString(),
        e: (freshData.e ?? data.e).toString(),
        depositos_eliminados: (freshData.deposits_eliminated ?? data.depositsEliminated).toString(),
        larvicida: freshData.larvicida || data.larvicida,
        quantidade_larvicida: (freshData.quantidade_larvicida ?? data.quantidade_larvicida).toString(),
        quantidade_depositos_tratados: (freshData.quantidade_depositos_tratados ?? data.quantidade_depositos_tratados).toString(),
        adulticida: freshData.adulticida || data.adulticida,
        quantidade_cargas: (freshData.quantidade_cargas ?? data.quantidade_cargas).toString(),
        total_tec_saude: (freshData.total_tec_saude ?? data.total_tec_saude).toString(),
        total_dias_trabalhados: (freshData.total_dias_trabalhados ?? data.total_dias_trabalhados).toString(),
        nome_supervisor: freshData.supervisor || data.supervisor
      };
      
      console.log("Dados preparados para o formulário de edição:", formData);
      
      // Navigate to form with edit data
      navigate('/', { state: { editMode: true, vectorDataToEdit: formData } });
    } catch (error) {
      console.error("Erro ao preparar dados para edição:", error);
      toast.error("Falha ao preparar edição. Tente novamente.");
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
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
            disabled={isEditing || isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PenLine className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Carregando..." : "Editar"}
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
            <p className="text-lg">{data.supervisor || 'Não informado'}</p>
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
          {data.id && (
            <span className="text-xs block opacity-50">ID: {data.id}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LocalityDetails;
