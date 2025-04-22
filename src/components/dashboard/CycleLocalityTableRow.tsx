
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { LocalityData } from '@/types/dashboard';
import LocalityDetailsDialog from './LocalityDetailsDialog';

interface CycleLocalityTableRowProps {
  locality: LocalityData;
}

const CycleLocalityTableRow: React.FC<CycleLocalityTableRowProps> = ({ locality }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{locality.locality}</TableCell>
        <TableCell>SE {locality.epidemiologicalWeek}</TableCell>
        <TableCell>{locality.supervisor}</TableCell>
        <TableCell className="text-right">{locality.totalProperties}</TableCell>
        <TableCell className="text-right">{locality.inspections}</TableCell>
        <TableCell className="text-right">{locality.depositsEliminated}</TableCell>
        <TableCell className="text-right">{locality.depositsTreated}</TableCell>
        <TableCell className="text-right">{locality.tratamento_focal}</TableCell>
        <TableCell className="text-right">{locality.tratamento_perifocal}</TableCell>
        <TableCell className="text-right">{locality.amostras_coletadas}</TableCell>
        <TableCell className="text-right">{locality.fechadas}</TableCell>
        <TableCell className="text-right">{locality.recuperadas}</TableCell>
        <TableCell className="text-center">
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowDetails(true)}
            className="flex items-center justify-center gap-1 w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-3.5 w-3.5" />
            Detalhes
          </Button>
        </TableCell>
      </TableRow>
      
      <LocalityDetailsDialog
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        locality={locality}
      />
    </>
  );
};

export default CycleLocalityTableRow;
