
import React from 'react';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LocalityData } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

interface DashboardExportProps {
  dashboardRef: React.RefObject<HTMLDivElement>;
  dashboardData: LocalityData[];
  selectedLocality: string;
  localityHistoricalData: LocalityData[];
  setIsExporting: (isExporting: boolean) => void;
}

const DashboardExport: React.FC<DashboardExportProps> = ({
  dashboardRef,
  dashboardData,
  selectedLocality,
  localityHistoricalData,
  setIsExporting
}) => {
  const { toast } = useToast();

  const exportToExcel = () => {
    setIsExporting(true);
    toast({
      title: "Exportando dados",
      description: "Preparando arquivo Excel...",
    });

    try {
      let dataToExport = [];
      
      if (selectedLocality && localityHistoricalData.length > 0) {
        dataToExport = localityHistoricalData.map(item => ({
          Localidade: item.locality,
          Município: item.municipality,
          Modalidade: item.workModality,
          Ciclo: item.cycle,
          'Semana Epidemiológica': item.epidemiologicalWeek,
          'Início do Período': new Date(item.startDate).toLocaleDateString(),
          'Fim do Período': new Date(item.endDate).toLocaleDateString(),
          'Total de Imóveis': item.totalProperties,
          'Imóveis Inspecionados': item.inspections,
          'Depósitos Eliminados': item.depositsEliminated,
          'Depósitos Tratados': item.depositsTreated,
          'Supervisor': item.supervisor,
          'A1': item.a1,
          'A2': item.a2,
          'B': item.b,
          'C': item.c,
          'D1': item.d1,
          'D2': item.d2,
          'E': item.e,
          'Larvicida': item.larvicida || '-',
          'Adulticida': item.adulticida || '-',
          'Tratamento Focal': item.tratamento_focal,
          'Tratamento Perifocal': item.tratamento_perifocal,
          'Amostras Coletadas': item.amostras_coletadas,
          'Recusa': item.recusa,
          'Fechadas': item.fechadas,
          'Recuperadas': item.recuperadas
        }));
      } else {
        dataToExport = dashboardData.map(item => ({
          Localidade: item.locality,
          Município: item.municipality,
          Modalidade: item.workModality,
          Ciclo: item.cycle,
          'Semana Epidemiológica': item.epidemiologicalWeek,
          'Início do Período': new Date(item.startDate).toLocaleDateString(),
          'Fim do Período': new Date(item.endDate).toLocaleDateString(),
          'Total de Imóveis': item.totalProperties,
          'Imóveis Inspecionados': item.inspections,
          'Depósitos Eliminados': item.depositsEliminated,
          'Depósitos Tratados': item.depositsTreated,
          'Supervisor': item.supervisor
        }));
      }

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard");
      
      const date = new Date().toISOString().split('T')[0];
      let filename = `ENDEMIAS_ITABUNA_${date}`;
      
      if (selectedLocality) {
        filename += `_${selectedLocality}`;
      }
      
      filename += '.xlsx';
      
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

  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    toast({
      title: "Exportando dados",
      description: "Preparando arquivo PDF...",
    });

    try {
      const element = dashboardRef.current;
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
      
      const date = new Date().toISOString().split('T')[0];
      let filename = `ENDEMIAS_ITABUNA_${date}`;
      
      if (selectedLocality) {
        filename += `_${selectedLocality}`;
      }
      
      filename += '.pdf';
      
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

  return { exportToExcel, exportToPDF };
};

export default DashboardExport;
