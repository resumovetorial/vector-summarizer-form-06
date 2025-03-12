import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { AccessLevel } from '@/types/admin';
import AccessLevelRow from './AccessLevelRow';

interface AccessLevelsListProps {
  accessLevels: AccessLevel[];
  isLoading: boolean;
  onEdit: (level: AccessLevel) => void;
  onDelete: (level: AccessLevel) => void;
}

const AccessLevelsList: React.FC<AccessLevelsListProps> = ({
  accessLevels,
  isLoading,
  onEdit,
  onDelete
}) => {
  if (isLoading && accessLevels.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Permissões</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accessLevels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10">
                Nenhum nível de acesso encontrado.
              </TableCell>
            </TableRow>
          ) : (
            accessLevels.map(level => (
              <AccessLevelRow 
                key={level.id} 
                level={level} 
                onEdit={onEdit} 
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccessLevelsList;
