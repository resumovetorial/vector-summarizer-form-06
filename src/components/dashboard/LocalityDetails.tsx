
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
    // For now, we'll just show a notification
    toast.info("Preparando edição de dados para " + data.locality);
    setIsEditing(true);
    
    // In the future, we could navigate to a form with pre-filled data
    setTimeout(() => {
      setIsEditing(false);
      navigate(`/edit-vector-data/${data.locality}`, { state: { vectorData: data } });
    }, 1500);
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
