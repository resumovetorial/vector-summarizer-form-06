
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { LocalityData } from '@/types/dashboard';

interface CycleLocalityTableRowProps {
  locality: LocalityData;
}

const CycleLocalityTableRow: React.FC<CycleLocalityTableRowProps> = ({ locality }) => {
  return (
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
    </TableRow>
  );
};

export default CycleLocalityTableRow;
