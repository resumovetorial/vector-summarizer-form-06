
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CycleLocalityTableHeader: React.FC = () => {
  return (
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
        <TableHead className="text-center w-[120px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CycleLocalityTableHeader;
