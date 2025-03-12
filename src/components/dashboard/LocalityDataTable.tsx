
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalityData } from '@/types/dashboard';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle, FileSpreadsheet, Printer } from 'lucide-react';
import { getUserAccessibleLocalities } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

interface LocalityDataTableProps {
  data: LocalityData[];
}

const LocalityDataTable: React.FC<LocalityDataTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accessibleLocalities, setAccessibleLocalities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const tableRef = React.useRef<HTMLDivElement>(null);
  
  // Mock current user ID - in a real app, this would come from authentication
  const currentUserId = 2; // Assuming this is a supervisor with limited access
  
  useEffect(() => {
    const loadAccessControl = async () => {
      try {
        // In a real application, this would use the actual logged-in user ID
        const localities = await getUserAccessibleLocalities(currentUserId);
        setAccessibleLocalities(localities);
      } catch (error) {
        console.error("Failed to load user permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAccessControl();
  }, []);
  
  // Export table data to Excel
  const exportToExcel = () => {
    if (!data || data.length === 0) return;
    
    setIsExporting(true);
    toast({
      title: "Exportando dados",
      description: "Preparando arquivo Excel...",
    });

    try {
      // Prepare data for export
      const dataToExport = filteredData.map(item => ({
        Localidade: item.locality,
        Município: item.municipality,
        'Semana Epidemiológica': item.epidemiologicalWeek,
        Ciclo: item.cycle,
        Modalidade: item.workModality,
        'Início': format(new Date(item.startDate), 'dd/MM/yyyy'),
        'Fim': format(new Date(item.endDate), 'dd/MM/yyyy'),
        'Total Imóveis': item.totalProperties,
        'Inspecionados': item.inspections,
        'Depósitos Eliminados': item.depositsEliminated, 
        'Depósitos Tratados': item.depositsTreated,
        'A1': item.a1,
        'A2': item.a2,
        'B': item.b,
        'C': item.c,
        'D1': item.d1,
        'D2': item.d2,
        'E': item.e,
        'Larvicida': item.larvicida || '-',
        'Adulticida': item.adulticida || '-',
        'Supervisor': item.supervisor,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
      
      // Generate filename with date and locality
      const date = new Date().toISOString().split('T')[0];
      const filename = `${data[0].locality}_${date}.xlsx`;
      
      // Write and download the file
      XLSX.writeFile(workbook, filename);
      
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso para Excel!",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados para Excel.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Export table to PDF
  const exportToPDF = async () => {
    if (!tableRef.current) return;
    
    setIsExporting(true);
    toast({
      title: "Exportando dados",
      description: "Preparando arquivo PDF...",
    });

    try {
      const element = tableRef.current;
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Generate filename with date and locality
      const date = new Date().toISOString().split('T')[0];
      const filename = `${data[0].locality}_${date}.pdf`;
      
      pdf.save(filename);
      
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso para PDF!",
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados para PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando dados...</div>;
  }
  
  if (!data || data.length === 0) {
    return <div className="text-center py-4">Nenhum dado disponível para esta localidade.</div>;
  }
  
  // Check if user has access to this locality
  const hasAccess = accessibleLocalities.includes(data[0].locality);
  
  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Acesso Restrito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="mb-2">Você não tem permissão para visualizar os dados desta localidade.</p>
            <p className="text-sm text-muted-foreground">Entre em contato com um administrador para solicitar acesso.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Sort data by date and then by cycle
  const sortedData = [...data].sort((a, b) => {
    // Sort by date first (newest first)
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    if (dateA !== dateB) return dateB - dateA;

    // Then sort by cycle
    return a.cycle.localeCompare(b.cycle);
  });
  
  // Filter data based on search term
  const filteredData = sortedData.filter(item => {
    return (
      item.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cycle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.workModality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <CardTitle>Dados Históricos de {data[0].locality}</CardTitle>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="w-full sm:w-64">
              <Input 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportToExcel}
              disabled={isExporting}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportToPDF}
              disabled={isExporting}
            >
              <Printer className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto" ref={tableRef}>
          <Table>
            <TableCaption>
              Dados históricos de {data[0].locality} por semana e ciclo
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Semana</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Propriedades</TableHead>
                <TableHead>Inspecionados</TableHead>
                <TableHead>Depósitos Eliminados</TableHead>
                <TableHead>Depósitos Tratados</TableHead>
                <TableHead>Tipo A1</TableHead>
                <TableHead>Tipo A2</TableHead>
                <TableHead>Tipo B</TableHead>
                <TableHead>Tipo C</TableHead>
                <TableHead>Tipo D1</TableHead>
                <TableHead>Tipo D2</TableHead>
                <TableHead>Tipo E</TableHead>
                <TableHead>Larvicida</TableHead>
                <TableHead>Adulticida</TableHead>
                <TableHead>Supervisor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={`${item.locality}-${item.cycle}-${item.epidemiologicalWeek}-${index}`}>
                  <TableCell>{item.epidemiologicalWeek}</TableCell>
                  <TableCell>{item.cycle}</TableCell>
                  <TableCell>{item.workModality}</TableCell>
                  <TableCell>
                    {format(new Date(item.startDate), 'dd/MM/yyyy')} - {format(new Date(item.endDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{item.totalProperties}</TableCell>
                  <TableCell>{item.inspections}</TableCell>
                  <TableCell>{item.depositsEliminated}</TableCell>
                  <TableCell>{item.depositsTreated}</TableCell>
                  <TableCell>{item.a1}</TableCell>
                  <TableCell>{item.a2}</TableCell>
                  <TableCell>{item.b}</TableCell>
                  <TableCell>{item.c}</TableCell>
                  <TableCell>{item.d1}</TableCell>
                  <TableCell>{item.d2}</TableCell>
                  <TableCell>{item.e}</TableCell>
                  <TableCell>{item.larvicida || '-'}</TableCell>
                  <TableCell>{item.adulticida || '-'}</TableCell>
                  <TableCell>{item.supervisor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalityDataTable;
