
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AccessLevel } from '@/types/admin';
import { mockAccessLevels } from '@/services/adminService';

const AccessLevels: React.FC = () => {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>(mockAccessLevels);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPermissions, setFormPermissions] = useState('');

  const handleAddLevel = () => {
    const newLevel: AccessLevel = {
      id: accessLevels.length + 1,
      name: formName,
      description: formDescription,
      permissions: formPermissions.split(',').map(p => p.trim())
    };
    
    setAccessLevels([...accessLevels, newLevel]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Nível de acesso adicionado com sucesso!");
  };
  
  const handleEditLevel = () => {
    if (!selectedLevel) return;
    
    const updatedLevels = accessLevels.map(level => 
      level.id === selectedLevel.id ? {
        ...level,
        name: formName,
        description: formDescription,
        permissions: formPermissions.split(',').map(p => p.trim())
      } : level
    );
    
    setAccessLevels(updatedLevels);
    setIsEditDialogOpen(false);
    resetForm();
    toast.success("Nível de acesso atualizado com sucesso!");
  };
  
  const handleDeleteLevel = (levelId: number) => {
    if (confirm("Tem certeza que deseja excluir este nível de acesso?")) {
      setAccessLevels(accessLevels.filter(level => level.id !== levelId));
      toast.success("Nível de acesso removido com sucesso!");
    }
  };
  
  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPermissions('');
    setSelectedLevel(null);
  };
  
  const openEditDialog = (level: AccessLevel) => {
    setSelectedLevel(level);
    setFormName(level.name);
    setFormDescription(level.description);
    setFormPermissions(level.permissions.join(', '));
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Níveis de Acesso</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Nível de Acesso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nível de Acesso</DialogTitle>
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
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={formDescription} 
                  onChange={(e) => setFormDescription(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissions">Permissões (separadas por vírgula)</Label>
                <Textarea 
                  id="permissions" 
                  value={formPermissions} 
                  onChange={(e) => setFormPermissions(e.target.value)}
                  placeholder="dashboard, form, admin"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddLevel}>
                  Adicionar Nível
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
                <TableHead>Descrição</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessLevels.map(level => (
                <TableRow key={level.id}>
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
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(level)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteLevel(level.id)}>
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

      {/* Edit Level Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nível de Acesso</DialogTitle>
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
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea 
                id="edit-description" 
                value={formDescription} 
                onChange={(e) => setFormDescription(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-permissions">Permissões (separadas por vírgula)</Label>
              <Textarea 
                id="edit-permissions" 
                value={formPermissions} 
                onChange={(e) => setFormPermissions(e.target.value)} 
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditLevel}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AccessLevels;
