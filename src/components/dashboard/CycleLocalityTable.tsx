
import React from 'react';
import { Table } from "@/components/ui/table";
import { LocalityData } from '@/types/dashboard';
import CycleLocalityTableHeader from './CycleLocalityTableHeader';
import CycleLocalityTableBody from './CycleLocalityTableBody';

interface CycleLocalityTableProps {
  localities: LocalityData[];
}

const CycleLocalityTable: React.FC<CycleLocalityTableProps> = ({ localities }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <CycleLocalityTableHeader />
        <CycleLocalityTableBody localities={localities} />
      </Table>
    </div>
  );
};

export default CycleLocalityTable;
