
import React from 'react';
import { Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { User, AccessLevel } from '@/types/admin';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface UserListProps {
  users: User[];
  accessLevels: AccessLevel[];
  onEdit: (user: User) => void;
  onDelete: (userId: number, supabaseId?: string) => void;
  onConfigureAccess: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  accessLevels, 
  onEdit, 
  onDelete, 
  onConfigureAccess 
}) => {
  const getAccessLevelName = (id: number): string => {
    const level = accessLevels.find(level => level.id === id);
    return level ? level.name : 'Desconhecido';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Nível de Acesso</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Localidades</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{getAccessLevelName(user.accessLevelId)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.active ? 'Ativo' : 'Inativo'}
                </span>
              </TableCell>
              <TableCell>
                {user.assignedLocalities.length === 0 ? (
                  <span className="text-muted-foreground text-sm">Nenhuma localidade</span>
                ) : (
                  <span>{user.assignedLocalities.length} localidades</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onConfigureAccess(user)}>
                    <Shield className="h-4 w-4" />
                    <span className="sr-only">Configurar Acesso</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o usuário <strong>{user.name}</strong>? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(user.id, user.supabaseId)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
