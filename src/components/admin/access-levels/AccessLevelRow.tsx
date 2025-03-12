
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { AccessLevel } from '@/types/admin';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AccessLevelRowProps {
  level: AccessLevel;
  onEdit: (level: AccessLevel) => void;
  onDelete: (level: AccessLevel) => void;
}

const AccessLevelRow: React.FC<AccessLevelRowProps> = ({ level, onEdit, onDelete }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{level.name}</TableCell>
      <TableCell>{level.description}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {level.permissions.map((permission, index) => (
            <span 
              key={index}
              className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
            >
              {permission}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(level)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Excluir</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o nível de acesso <strong>{level.name}</strong>? 
                  Esta ação não pode ser desfeita e pode afetar usuários com este nível.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={() => onDelete(level)}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AccessLevelRow;
