
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import UserList from './UserList';
import { User } from '@/types/admin';
import UserAddDialog from './UserAddDialog';
import UserEditDialog from './UserEditDialog';
import UserAccessDialog from './UserAccessDialog';
import UserManagementActions from './UserManagementActions';
import { useUsers } from '@/hooks/users';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { supabase } from '@/lib/supabase';

const UserManagement: React.FC = () => {
  const { users, setUsers, accessLevels, isLoading, handleDeleteUser, refreshUsers } = useUsers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  
  // Auto-refresh users on mount
  useEffect(() => {
    refreshUsers();
    
    // Setup realtime subscription for profiles table changes
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('Mudança detectada na tabela profiles, atualizando lista de usuários');
          refreshUsers();
        }
      )
      .subscribe();
      
    // Setup realtime subscription for locality_access changes
    const localityAccessChannel = supabase
      .channel('locality-access-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'locality_access'
        },
        () => {
          console.log('Mudança detectada na tabela locality_access, atualizando lista de usuários');
          refreshUsers();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(localityAccessChannel);
    };
  }, [refreshUsers]);
  
  const openEditDialog = (user: User) => {
    const userCopy = JSON.parse(JSON.stringify(user));
    console.log("Opening edit dialog with user:", userCopy);
    setSelectedUser(userCopy);
    setIsEditDialogOpen(true);
  };
  
  const handleConfigureAccess = (user: User) => {
    const userCopy = JSON.parse(JSON.stringify(user));
    console.log("Configuring access for user:", userCopy);
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
    setIsAddDialogOpen(false);
    refreshUsers();
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    refreshUsers();
  };

  const handleAccessDialogClose = () => {
    setIsAccessDialogOpen(false);
    setSelectedUser(null);
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

      <UserEditDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={handleEditDialogClose}
        users={users}
        setUsers={setUsers}
        accessLevels={accessLevels}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

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
