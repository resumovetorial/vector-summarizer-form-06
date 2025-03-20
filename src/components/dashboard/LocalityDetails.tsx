
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
        qt_residencias: (freshData.qt_residencias !== null ? freshData.qt_residencias : (data.qt_residencias || 0)).toString(),
        qt_comercio: (freshData.qt_comercio !== null ? freshData.qt_comercio : (data.qt_comercio || 0)).toString(),
        qt_terreno_baldio: (freshData.qt_terreno_baldio !== null ? freshData.qt_terreno_baldio : (data.qt_terreno_baldio || 0)).toString(),
        qt_pe: (freshData.qt_pe !== null ? freshData.qt_pe : (data.qt_pe || 0)).toString(),
        qt_outros: (freshData.qt_outros !== null ? freshData.qt_outros : (data.qt_outros || 0)).toString(),
        qt_total: (freshData.qt_total !== null ? freshData.qt_total : (data.qt_total || 0)).toString(),
        tratamento_focal: (freshData.tratamento_focal !== null ? freshData.tratamento_focal : (data.tratamento_focal || 0)).toString(),
        tratamento_perifocal: (freshData.tratamento_perifocal !== null ? freshData.tratamento_perifocal : (data.tratamento_perifocal || 0)).toString(),
        inspecionados: (freshData.inspections !== null ? freshData.inspections : (data.inspections || 0)).toString(),
        amostras_coletadas: (freshData.amostras_coletadas !== null ? freshData.amostras_coletadas : (data.amostras_coletadas || 0)).toString(),
        recusa: (freshData.recusa !== null ? freshData.recusa : (data.recusa || 0)).toString(),
        fechadas: (freshData.fechadas !== null ? freshData.fechadas : (data.fechadas || 0)).toString(),
        recuperadas: (freshData.recuperadas !== null ? freshData.recuperadas : (data.recuperadas || 0)).toString(),
        a1: (freshData.a1 !== null ? freshData.a1 : (data.a1 || 0)).toString(),
        a2: (freshData.a2 !== null ? freshData.a2 : (data.a2 || 0)).toString(),
        b: (freshData.b !== null ? freshData.b : (data.b || 0)).toString(),
        c: (freshData.c !== null ? freshData.c : (data.c || 0)).toString(),
        d1: (freshData.d1 !== null ? freshData.d1 : (data.d1 || 0)).toString(),
        d2: (freshData.d2 !== null ? freshData.d2 : (data.d2 || 0)).toString(),
        e: (freshData.e !== null ? freshData.e : (data.e || 0)).toString(),
        depositos_eliminados: (freshData.deposits_eliminated !== null ? freshData.deposits_eliminated : (data.depositsEliminated || 0)).toString(),
        larvicida: freshData.larvicida || data.larvicida || '',
        quantidade_larvicida: (freshData.quantidade_larvicida !== null ? freshData.quantidade_larvicida : (data.quantidade_larvicida || 0)).toString(),
        quantidade_depositos_tratados: (freshData.quantidade_depositos_tratados !== null ? freshData.quantidade_depositos_tratados : (data.quantidade_depositos_tratados || 0)).toString(),
        adulticida: freshData.adulticida || data.adulticida || '',
        quantidade_cargas: (freshData.quantidade_cargas !== null ? freshData.quantidade_cargas : (data.quantidade_cargas || 0)).toString(),
        total_tec_saude: (freshData.total_tec_saude !== null ? freshData.total_tec_saude : (data.total_tec_saude || 0)).toString(),
        total_dias_trabalhados: (freshData.total_dias_trabalhados !== null ? freshData.total_dias_trabalhados : (data.total_dias_trabalhados || 0)).toString(),
        nome_supervisor: freshData.supervisor || data.supervisor || ''
      };
      
      console.log("Dados preparados para o formulário de edição:", formData);
      
      // Armazenar o ID original para garantir que seja mantido
      localStorage.setItem('editing_record_id', data.id);
      
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
