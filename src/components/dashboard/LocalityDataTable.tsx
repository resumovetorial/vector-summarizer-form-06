
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LocalityData } from '@/types/dashboard';
import { useLocalityAccess } from '@/hooks/useLocalityAccess';
import { useDataExport } from '@/hooks/useDataExport';
import LocalityDataTableHeader from './LocalityDataTableHeader';
import LocalityDataTableContent from './LocalityDataTableContent';
import AccessRestrictionCard from './AccessRestrictionCard';
import AccessLevelGuard from '../AccessLevelGuard';

interface LocalityDataTableProps {
  data: LocalityData[];
}

const LocalityDataTable: React.FC<LocalityDataTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Mock current user ID - in a real app, this would come from authentication
  const currentUserId = 2; // Assuming this is a supervisor with limited access
  
  const { hasAccess, isLoading } = useLocalityAccess({ 
    localityName: data?.[0]?.locality,
    userId: currentUserId
  });

  if (isLoading) {
    return <div className="text-center py-4">Carregando dados...</div>;
  }
  
  if (!data || data.length === 0) {
    return <div className="text-center py-4">Nenhum dado disponível para esta localidade.</div>;
  }
  
  // Check if user has access to this locality
  if (!hasAccess) {
    return <AccessRestrictionCard />;
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

  const { isExporting, exportToExcel, exportToPDF } = useDataExport({
    data,
    filteredData,
    tableRef
  });

  return (
    <AccessLevelGuard 
      requiredLevel="supervisor"
      fallbackMessage="Você precisa ter acesso de supervisor ou superior para visualizar os dados desta localidade."
    >
      <Card>
        <CardHeader>
          <LocalityDataTableHeader 
            localityName={data[0].locality}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onExportToExcel={exportToExcel}
            onExportToPDF={exportToPDF}
            isExporting={isExporting}
          />
        </CardHeader>
        <CardContent>
          <LocalityDataTableContent 
            data={data}
            filteredData={filteredData}
            tableRef={tableRef}
          />
        </CardContent>
      </Card>
    </AccessLevelGuard>
  );
};

export default LocalityDataTable;
