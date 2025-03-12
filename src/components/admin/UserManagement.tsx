
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import UserList from './UserList';
import { User, AccessLevel } from '@/types/admin';
import { mockUsers, mockAccessLevels, fetchAccessLevels as fetchMockAccessLevels } from '@/services/adminService';
import UserAddDialog from './UserAddDialog';
import UserEditDialog from './UserEditDialog';
import UserAccessDialog from './UserAccessDialog';
import { supabase } from '@/lib/supabase';
import { fetchAccessLevels } from '@/services/accessLevelService';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch users and access levels when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch access levels from Supabase if available
        let fetchedAccessLevels: AccessLevel[] = [];
        try {
          fetchedAccessLevels = await fetchAccessLevels();
          console.log("Fetched access levels:", fetchedAccessLevels);
          setAccessLevels(fetchedAccessLevels);
        } catch (error) {
          console.error('Erro ao buscar níveis de acesso:', error);
          // Fallback to mock data if Supabase fetch fails
          const mockLevels = await fetchMockAccessLevels();
          setAccessLevels(mockLevels);
        }
        
        // Fetch users from Supabase
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Erro ao buscar perfis:', error);
          // Fallback to mock data
          setUsers(mockUsers);
          return;
        }

        if (profiles && profiles.length > 0) {
          // Convert Supabase profiles to User format
          const realUsers: User[] = profiles.map((profile, index) => {
            // Determine the access level ID based on profile or defaults
            let accessLevelId = 3; // Default to lowest level
            
            if (profile.access_level_id) {
              // If profile has a UUID access level ID, find the matching numeric ID
              const matchingLevel = fetchedAccessLevels.find(
                level => level.id.toString() === profile.access_level_id
              );
              if (matchingLevel) {
                accessLevelId = matchingLevel.id;
              }
            } else if (profile.role === 'admin') {
              accessLevelId = 1;
            } else if (profile.role === 'supervisor') {
              accessLevelId = 2;
            }
            
            return {
              id: index + 1,
              supabaseId: profile.id,
              name: profile.username || `Usuário ${index + 1}`,
              email: profile.username || `usuario${index + 1}@exemplo.com`,
              role: profile.role || 'Usuário',
              accessLevelId: accessLevelId,
              active: profile.active ?? true,
              assignedLocalities: []
            };
          });
          
          console.log("Converted users:", realUsers);
          setUsers(realUsers);
        } else {
          // Fallback to mock data if no profiles found
          setUsers(mockUsers);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        // Fallback to mock data
        setUsers(mockUsers);
        setAccessLevels(mockAccessLevels);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleDeleteUser = async (userId: number, supabaseId?: string) => {
    if (!supabaseId) {
      // For mock users without Supabase ID
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Usuário removido com sucesso!");
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the RPC function we created to delete both user and profile
      const { error } = await supabase.rpc('delete_user_and_profile', {
        user_id: supabaseId
      });
      
      if (error) {
        throw error;
      }
      
      // Update the user list in the UI
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Usuário excluído com sucesso!");
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast.error(`Erro ao excluir usuário: ${error.message || 'Tente novamente mais tarde'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Usuários</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto" disabled={isLoading}>
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
