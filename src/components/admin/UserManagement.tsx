
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import UserList from './UserList';
import { User, AccessLevel } from '@/types/admin';
import { mockUsers, mockAccessLevels } from '@/services/adminService';
import UserAddDialog from './UserAddDialog';
import UserEditDialog from './UserEditDialog';
import UserAccessDialog from './UserAccessDialog';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [accessLevels] = useState<AccessLevel[]>(mockAccessLevels);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  
  const handleDeleteUser = (userId: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Usuário removido com sucesso!");
    }
  };
  
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };
  
  const handleConfigureAccess = (user: User) => {
    setSelectedUser(user);
    setIsAccessDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Usuários</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
        </Dialog>
        <UserAddDialog 
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          users={users}
          setUsers={setUsers}
          accessLevels={accessLevels}
        />
      </CardHeader>
      <CardContent>
        <UserList 
          users={users}
          accessLevels={accessLevels}
          onEdit={openEditDialog}
          onDelete={handleDeleteUser}
          onConfigureAccess={handleConfigureAccess}
        />
      </CardContent>

      {/* Edit User Dialog */}
      <UserEditDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        users={users}
        setUsers={setUsers}
        accessLevels={accessLevels}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* User Access Dialog */}
      <UserAccessDialog 
        isOpen={isAccessDialogOpen}
        setIsOpen={setIsAccessDialogOpen}
        users={users}
        setUsers={setUsers}
        selectedUser={selectedUser}
      />
    </Card>
  );
};

export default UserManagement;
