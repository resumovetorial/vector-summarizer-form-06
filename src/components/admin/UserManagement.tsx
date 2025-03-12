
import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
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
  
  const getAccessLevelName = (id: number): string => {
    const level = accessLevels.find(level => level.id === id);
    return level ? level.name : 'Desconhecido';
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
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formEmail} 
                  onChange={(e) => setFormEmail(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input 
                  id="role" 
                  value={formRole} 
                  onChange={(e) => setFormRole(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessLevel">Nível de Acesso</Label>
                <Select 
                  value={formAccessLevel} 
                  onValueChange={setFormAccessLevel}
                >
                  <SelectTrigger id="accessLevel">
                    <SelectValue placeholder="Selecione um nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessLevels.map(level => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={formActive ? "default" : "outline"}
                    onClick={() => setFormActive(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ativo
                  </Button>
                  <Button
                    type="button"
                    variant={!formActive ? "default" : "outline"}
                    onClick={() => setFormActive(false)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Inativo
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddUser}>
                  Adicionar Usuário
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
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
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleConfigureAccess(user)}>
                        <Shield className="h-4 w-4" />
                        <span className="sr-only">Configurar Acesso</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input 
                id="edit-name" 
                value={formName} 
                onChange={(e) => setFormName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                type="email" 
                value={formEmail} 
                onChange={(e) => setFormEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Cargo</Label>
              <Input 
                id="edit-role" 
                value={formRole} 
                onChange={(e) => setFormRole(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-accessLevel">Nível de Acesso</Label>
              <Select 
                value={formAccessLevel} 
                onValueChange={setFormAccessLevel}
              >
                <SelectTrigger id="edit-accessLevel">
                  <SelectValue placeholder="Selecione um nível" />
                </SelectTrigger>
                <SelectContent>
                  {accessLevels.map(level => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={formActive ? "default" : "outline"}
                  onClick={() => setFormActive(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ativo
                </Button>
                <Button
                  type="button"
                  variant={!formActive ? "default" : "outline"}
                  onClick={() => setFormActive(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Inativo
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditUser}>
                Salvar Alterações
              </Button>
            </div>
          </div>
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
