
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalityData } from '@/types/dashboard';
import { format } from 'date-fns';

interface LocalityDataTableProps {
  data: LocalityData[];
}

const LocalityDataTable: React.FC<LocalityDataTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">Nenhum dado disponível para esta localidade.</div>;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Históricos de {data[0].locality}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableCaption>
              Dados históricos de {data[0].locality} por semana e ciclo
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Semana</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Propriedades</TableHead>
                <TableHead>Inspecionados</TableHead>
                <TableHead>Depósitos Eliminados</TableHead>
                <TableHead>Depósitos Tratados</TableHead>
                <TableHead>Tipo A1</TableHead>
                <TableHead>Tipo A2</TableHead>
                <TableHead>Tipo B</TableHead>
                <TableHead>Tipo C</TableHead>
                <TableHead>Tipo D1</TableHead>
                <TableHead>Tipo D2</TableHead>
                <TableHead>Tipo E</TableHead>
                <TableHead>Larvicida</TableHead>
                <TableHead>Adulticida</TableHead>
                <TableHead>Supervisor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow key={`${item.locality}-${item.cycle}-${item.epidemiologicalWeek}-${index}`}>
                  <TableCell>{item.epidemiologicalWeek}</TableCell>
                  <TableCell>{item.cycle}</TableCell>
                  <TableCell>{item.workModality}</TableCell>
                  <TableCell>
                    {format(new Date(item.startDate), 'dd/MM/yyyy')} - {format(new Date(item.endDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{item.totalProperties}</TableCell>
                  <TableCell>{item.inspections}</TableCell>
                  <TableCell>{item.depositsEliminated}</TableCell>
                  <TableCell>{item.depositsTreated}</TableCell>
                  <TableCell>{item.a1}</TableCell>
                  <TableCell>{item.a2}</TableCell>
                  <TableCell>{item.b}</TableCell>
                  <TableCell>{item.c}</TableCell>
                  <TableCell>{item.d1}</TableCell>
                  <TableCell>{item.d2}</TableCell>
                  <TableCell>{item.e}</TableCell>
                  <TableCell>{item.larvicida || '-'}</TableCell>
                  <TableCell>{item.adulticida || '-'}</TableCell>
                  <TableCell>{item.supervisor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalityDataTable;
