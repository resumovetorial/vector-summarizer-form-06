
import React from 'react';
import { LocalityData } from '@/types/dashboard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Home, 
  Building2, 
  TreePine, 
  Droplets, 
  Warehouse, 
  Users, 
  Calendar,
  MapPin, 
  Workflow,
  ClipboardList,
  User
} from 'lucide-react';

interface LocalityDetailsProps {
  data: LocalityData;
}

const LocalityDetails: React.FC<LocalityDetailsProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/10 pb-3">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {data.locality} ({data.municipality})
          </CardTitle>
          <CardDescription>
            Semana Epidemiológica: {data.epidemiologicalWeek} | 
            Ciclo: {data.cycle} | 
            Modalidade: {data.workModality}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="properties">Imóveis</TabsTrigger>
              <TabsTrigger value="deposits">Depósitos</TabsTrigger>
              <TabsTrigger value="treatment">Tratamento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Período:</span> 
                  </div>
                  <p className="text-sm ml-6">
                    De {formatDate(data.startDate)} até {formatDate(data.endDate)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Modalidade de Trabalho:</span> 
                  </div>
                  <p className="text-sm ml-6">{data.workModality}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Ciclo:</span> 
                  </div>
                  <p className="text-sm ml-6">{data.cycle}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Supervisor:</span> 
                  </div>
                  <p className="text-sm ml-6">{data.supervisor}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="properties">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-background border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <Home className="h-5 w-5" />
                    <h3 className="font-medium">Residências</h3>
                  </div>
                  <p className="text-2xl font-bold">{data.qt_residencias}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <Building2 className="h-5 w-5" />
                    <h3 className="font-medium">Comércios</h3>
                  </div>
                  <p className="text-2xl font-bold">{data.qt_comercio}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <TreePine className="h-5 w-5" />
                    <h3 className="font-medium">Terrenos Baldios</h3>
                  </div>
                  <p className="text-2xl font-bold">{data.qt_terreno_baldio}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <Droplets className="h-5 w-5" />
                    <h3 className="font-medium">Pontos Estratégicos</h3>
                  </div>
                  <p className="text-2xl font-bold">{data.qt_pe}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <Warehouse className="h-5 w-5" />
                    <h3 className="font-medium">Outros</h3>
                  </div>
                  <p className="text-2xl font-bold">{data.qt_outros}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <Users className="h-5 w-5" />
                    <h3 className="font-medium">Total</h3>
                  </div>
                  <p className="text-2xl font-bold">{data.qt_total}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Inspeções</h3>
                  <p className="text-2xl font-bold">{data.inspections}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Recusas</h3>
                  <p className="text-2xl font-bold">{data.recusa}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Fechadas</h3>
                  <p className="text-2xl font-bold">{data.fechadas}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Recuperadas</h3>
                  <p className="text-2xl font-bold">{data.recuperadas}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Amostras Coletadas</h3>
                  <p className="text-2xl font-bold">{data.amostras_coletadas}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="deposits">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">A1</h3>
                  <p className="text-2xl font-bold">{data.a1}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">A2</h3>
                  <p className="text-2xl font-bold">{data.a2}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">B</h3>
                  <p className="text-2xl font-bold">{data.b}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">C</h3>
                  <p className="text-2xl font-bold">{data.c}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">D1</h3>
                  <p className="text-2xl font-bold">{data.d1}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">D2</h3>
                  <p className="text-2xl font-bold">{data.d2}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">E</h3>
                  <p className="text-2xl font-bold">{data.e}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Total Eliminados</h3>
                  <p className="text-2xl font-bold">{data.depositsEliminated}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="treatment">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Tratamento Focal</h3>
                  <p className="text-2xl font-bold">{data.tratamento_focal}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Tratamento Perifocal</h3>
                  <p className="text-2xl font-bold">{data.tratamento_perifocal}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Larvicida</h3>
                  <p className="text-2xl font-bold">{data.larvicida || '-'}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Quantidade de Larvicida</h3>
                  <p className="text-2xl font-bold">{data.quantidade_larvicida}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Depósitos Tratados</h3>
                  <p className="text-2xl font-bold">{data.depositsTreated}</p>
                </div>
                
                {data.workModality === 'PE' && (
                  <>
                    <div className="bg-background border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Adulticida</h3>
                      <p className="text-2xl font-bold">{data.adulticida || '-'}</p>
                    </div>
                    
                    <div className="bg-background border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Quantidade de Cargas</h3>
                      <p className="text-2xl font-bold">{data.quantidade_cargas}</p>
                    </div>
                  </>
                )}
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Total de Técnicos de Saúde</h3>
                  <p className="text-2xl font-bold">{data.total_tec_saude}</p>
                </div>
                
                <div className="bg-background border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Total de Dias Trabalhados</h3>
                  <p className="text-2xl font-bold">{data.total_dias_trabalhados}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalityDetails;
