
import React from 'react';
import { TableBody } from "@/components/ui/table";
import { LocalityData } from '@/types/dashboard';
import CycleLocalityTableRow from './CycleLocalityTableRow';

interface CycleLocalityTableBodyProps {
  localities: LocalityData[];
}

const CycleLocalityTableBody: React.FC<CycleLocalityTableBodyProps> = ({ localities }) => {
  return (
    <TableBody>
      {localities.map((locality, idx) => (
        <CycleLocalityTableRow key={idx} locality={locality} />
      ))}
    </TableBody>
  );
};

export default CycleLocalityTableBody;
