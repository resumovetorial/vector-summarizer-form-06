
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import UserList from './UserList';
import { User } from '@/types/admin';
import UserAddDialog from './UserAddDialog';
import UserEditDialog from './UserEditDialog';
import UserAccessDialog from './UserAccessDialog';
import UserManagementActions from './UserManagementActions';
import { useUsers } from '@/hooks/useUsers';

const UserManagement: React.FC = () => {
  const { users, setUsers, accessLevels, isLoading, handleDeleteUser, refreshUsers } = useUsers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  
  const openEditDialog = (user: User) => {
    // Create a deep copy of the user to avoid reference issues
    const userCopy = JSON.parse(JSON.stringify(user));
    console.log("Opening edit dialog with user:", userCopy);
    setSelectedUser(userCopy);
    setIsEditDialogOpen(true);
  };
  
  const handleConfigureAccess = (user: User) => {
    // Create a deep copy of the user to avoid reference issues
    const userCopy = JSON.parse(JSON.stringify(user));
    setSelectedUser(userCopy);
    setIsAccessDialogOpen(true);
  };

  const handleUserDelete = async (userId: number, supabaseId?: string) => {
    const success = await handleDeleteUser(userId, supabaseId);
    if (success) {
      toast.success("Usuário excluído com sucesso!");
    } else {
      toast.error("Erro ao excluir usuário. Tente novamente mais tarde.");
    }
  };

  const handleDialogClose = () => {
    // Ao fechar o diálogo, recarregar a lista de usuários para garantir que temos os dados mais recentes
    refreshUsers();
    setIsAddDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    refreshUsers();
  };

  const handleAccessDialogClose = () => {
    setIsAccessDialogOpen(false);
    refreshUsers();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Usuários</CardTitle>
        <UserManagementActions 
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isLoading={isLoading}
          onRefresh={refreshUsers}
        />
        <UserAddDialog 
          isOpen={isAddDialogOpen}
          setIsOpen={handleDialogClose}
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
          onDelete={handleUserDelete}
          onConfigureAccess={handleConfigureAccess}
        />
      </CardContent>

      {/* Edit User Dialog */}
      <UserEditDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={handleEditDialogClose}
        users={users}
        setUsers={setUsers}
        accessLevels={accessLevels}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* User Access Dialog */}
      <UserAccessDialog 
        isOpen={isAccessDialogOpen}
        setIsOpen={handleAccessDialogClose}
        users={users}
        setUsers={setUsers}
        selectedUser={selectedUser}
      />
    </Card>
  );
};

export default UserManagement;
