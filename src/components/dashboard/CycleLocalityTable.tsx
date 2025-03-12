
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LocalityData } from '@/types/dashboard';

interface CycleLocalityTableProps {
  localities: LocalityData[];
}

const CycleLocalityTable: React.FC<CycleLocalityTableProps> = ({ localities }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Localidade</TableHead>
            <TableHead>Semana</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead className="text-right">Imóveis</TableHead>
            <TableHead className="text-right">Inspecionados</TableHead>
            <TableHead className="text-right">Dep. Elim.</TableHead>
            <TableHead className="text-right">Dep. Trat.</TableHead>
            <TableHead className="text-right">T. Focal</TableHead>
            <TableHead className="text-right">T. Perifocal</TableHead>
            <TableHead className="text-right">Amostras</TableHead>
            <TableHead className="text-right">Fechadas</TableHead>
            <TableHead className="text-right">Recuperadas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localities.map((locality, idx) => (
            <TableRow key={idx}>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CycleLocalityTable;
