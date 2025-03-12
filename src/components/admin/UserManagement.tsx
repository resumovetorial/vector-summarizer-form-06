
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [accessLevels] = useState<AccessLevel[]>(mockAccessLevels);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Adicionar usuários reais do Supabase
  useEffect(() => {
    const fetchRealUsers = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Erro ao buscar perfis:', error);
          return;
        }

        if (profiles && profiles.length > 0) {
          // Converter perfis do Supabase para o formato User
          const realUsers: User[] = profiles.map((profile, index) => ({
            id: index + 1,
            supabaseId: profile.id,
            name: profile.username || `Usuário ${index + 1}`,
            email: profile.username || `usuario${index + 1}@exemplo.com`,
            role: profile.role || 'Usuário',
            accessLevelId: profile.role === 'admin' ? 1 : profile.role === 'supervisor' ? 2 : 3,
            active: profile.active ?? true,
            assignedLocalities: []
          }));
          
          // Mesclar usuários reais com mock users (apenas para demonstração)
          // Em produção, você provavelmente usaria apenas usuários reais
          setUsers([...realUsers]);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };
    
    fetchRealUsers();
  }, []);
  
  const handleDeleteUser = async (userId: number, supabaseId?: string) => {
    if (!supabaseId) {
      // Para usuários mock sem ID do Supabase
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Usuário removido com sucesso!");
      return;
    }

    setIsLoading(true);
    
    try {
      // Chamar a função RPC que criamos para excluir o usuário e seu perfil
      const { error } = await supabase.rpc('delete_user_and_profile', {
        user_id: supabaseId
      });
      
      if (error) {
        throw error;
      }
      
      // Atualizar a lista de usuários na interface
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
