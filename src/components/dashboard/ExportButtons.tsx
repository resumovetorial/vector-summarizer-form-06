
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Printer } from 'lucide-react';

interface ExportButtonsProps {
  onExportToExcel: () => void;
  onExportToPDF: () => void;
  isExporting: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  onExportToExcel, 
  onExportToPDF, 
  isExporting 
}) => {
  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onExportToExcel}
        disabled={isExporting}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Excel
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onExportToPDF}
        disabled={isExporting}
      >
        <Printer className="h-4 w-4 mr-2" />
        PDF
      </Button>
    </>
  );
};

export default ExportButtons;
