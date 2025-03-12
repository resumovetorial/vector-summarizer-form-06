
import React from 'react';
import { RotateCcw, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  year: string;
  setYear: (year: string) => void;
  isLoading: boolean;
  isExporting: boolean;
  refreshData: () => void;
  exportToExcel: () => void;
  exportToPDF: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  year,
  setYear,
  isLoading,
  isExporting,
  refreshData,
  exportToExcel,
  exportToPDF
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2028">2028</SelectItem>
            <SelectItem value="2027">2027</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          onClick={refreshData} 
          disabled={isLoading || isExporting}
        >
          <RotateCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
        
        <Button 
          variant="outline" 
          onClick={exportToExcel}
          disabled={isLoading || isExporting}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Excel
        </Button>
        
        <Button 
          variant="outline" 
          onClick={exportToPDF}
          disabled={isLoading || isExporting}
        >
          <Printer className="h-4 w-4 mr-2" />
          PDF
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
