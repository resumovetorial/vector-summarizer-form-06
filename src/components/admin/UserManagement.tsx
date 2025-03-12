
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import UserList from './UserList';
import UserForm from './UserForm';
import UserAccessForm from './UserAccessForm';
import { User, AccessLevel } from '@/types/admin';
import { mockUsers, mockAccessLevels } from '@/services/adminService';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [accessLevels] = useState<AccessLevel[]>(mockAccessLevels);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formAccessLevel, setFormAccessLevel] = useState('');
  const [formActive, setFormActive] = useState(true);

  const handleAddUser = () => {
    const newUser: User = {
      id: users.length + 1,
      name: formName,
      email: formEmail,
      role: formRole,
      accessLevelId: parseInt(formAccessLevel),
      active: formActive,
      assignedLocalities: []
    };
    
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Usuário adicionado com sucesso!");
  };
  
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? {
        ...user,
        name: formName,
        email: formEmail,
        role: formRole,
        accessLevelId: parseInt(formAccessLevel),
        active: formActive
      } : user
    );
    
    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    resetForm();
    toast.success("Usuário atualizado com sucesso!");
  };
  
  const handleDeleteUser = (userId: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Usuário removido com sucesso!");
    }
  };
  
  const handleConfigureAccess = (user: User) => {
    setSelectedUser(user);
    setIsAccessDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('');
    setFormAccessLevel('');
    setFormActive(true);
    setSelectedUser(null);
  };
  
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormAccessLevel(user.accessLevelId.toString());
    setFormActive(user.active);
    setIsEditDialogOpen(true);
  };
  
  const updateUserLocalities = (userId: number, localities: string[]) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, assignedLocalities: localities } : user
    );
    setUsers(updatedUsers);
    setIsAccessDialogOpen(false);
    toast.success("Acesso às localidades atualizado com sucesso!");
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            </DialogHeader>
            <UserForm
              name={formName}
              setName={setFormName}
              email={formEmail}
              setEmail={setFormEmail}
              role={formRole}
              setRole={setFormRole}
              accessLevel={formAccessLevel}
              setAccessLevel={setFormAccessLevel}
              active={formActive}
              setActive={setFormActive}
              accessLevels={accessLevels}
              onCancel={() => setIsAddDialogOpen(false)}
              onSubmit={handleAddUser}
              submitLabel="Adicionar Usuário"
            />
          </DialogContent>
        </Dialog>
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <UserForm
            name={formName}
            setName={setFormName}
            email={formEmail}
            setEmail={setFormEmail}
            role={formRole}
            setRole={setFormRole}
            accessLevel={formAccessLevel}
            setAccessLevel={setFormAccessLevel}
            active={formActive}
            setActive={setFormActive}
            accessLevels={accessLevels}
            onCancel={() => setIsEditDialogOpen(false)}
            onSubmit={handleEditUser}
            submitLabel="Salvar Alterações"
          />
        </DialogContent>
      </Dialog>

      {/* User Access Dialog */}
      <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Configurar Acesso às Localidades - {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserAccessForm 
              user={selectedUser} 
              onSave={(localities) => updateUserLocalities(selectedUser.id, localities)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagement;
