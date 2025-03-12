
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LocalityData } from '@/types/dashboard';

interface UseDataExportProps {
  data: LocalityData[];
  filteredData: LocalityData[];
  tableRef: React.RefObject<HTMLDivElement>;
}

export const useDataExport = ({ data, filteredData, tableRef }: UseDataExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

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

  return {
    isExporting,
    exportToExcel,
    exportToPDF
  };
};
