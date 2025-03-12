
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import LocalitySearchBar from './LocalitySearchBar';
import ExportButtons from './ExportButtons';

interface LocalityDataTableHeaderProps {
  localityName: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onExportToExcel: () => void;
  onExportToPDF: () => void;
  isExporting: boolean;
}

const LocalityDataTableHeader: React.FC<LocalityDataTableHeaderProps> = ({
  localityName,
  searchTerm,
  setSearchTerm,
  onExportToExcel,
  onExportToPDF,
  isExporting
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <CardTitle>Dados Históricos de {localityName}</CardTitle>
      <div className="flex flex-wrap gap-2 items-center">
        <LocalitySearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ExportButtons
          onExportToExcel={onExportToExcel}
          onExportToPDF={onExportToPDF}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
};

export default LocalityDataTableHeader;
