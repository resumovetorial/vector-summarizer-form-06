
import React, { useState, useEffect } from 'react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  fetchAccessLevels, 
  createAccessLevel, 
  updateAccessLevel, 
  deleteAccessLevel 
} from '@/services/accessLevelService';
import { useAuth } from '@/hooks/useAuth';

const AccessLevels: React.FC = () => {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPermissions, setFormPermissions] = useState('');

  // Buscar níveis de acesso ao carregar o componente
  useEffect(() => {
    loadAccessLevels();
  }, []);

  const loadAccessLevels = async () => {
    try {
      setIsLoading(true);
      const levels = await fetchAccessLevels();
      setAccessLevels(levels);
    } catch (error: any) {
      toast.error(`Erro ao carregar níveis de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLevel = async () => {
    try {
      setIsLoading(true);
      
      const newLevel = await createAccessLevel({
        name: formName,
        description: formDescription,
        permissions: formPermissions.split(',').map(p => p.trim()),
      });
      
      setAccessLevels([...accessLevels, newLevel]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Nível de acesso adicionado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditLevel = async () => {
    if (!selectedLevel) return;
    
    try {
      setIsLoading(true);
      
      const updatedLevel = await updateAccessLevel({
        ...selectedLevel,
        name: formName,
        description: formDescription,
        permissions: formPermissions.split(',').map(p => p.trim()),
      });
      
      const updatedLevels = accessLevels.map(level => 
        level.id === selectedLevel.id ? updatedLevel : level
      );
      
      setAccessLevels(updatedLevels);
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Nível de acesso atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteLevel = async (level: AccessLevel) => {
    try {
      setIsLoading(true);
      await deleteAccessLevel(level.name);
      
      setAccessLevels(accessLevels.filter(l => l.id !== level.id));
      toast.success("Nível de acesso removido com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover nível de acesso: ${error.message}`);
    } finally {
      setIsLoading(false);
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

  // Verificar se o usuário é admin
  const isAdmin = user?.role === 'admin';
  
  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40 flex-col gap-4">
            <p className="text-muted-foreground text-center">
              Você não tem permissão para acessar esta seção.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Níveis de Acesso</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto" disabled={isLoading}>
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
                <Button onClick={handleAddLevel} disabled={isLoading}>
                  Adicionar Nível
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && accessLevels.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : (
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
                {accessLevels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      Nenhum nível de acesso encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  accessLevels.map(level => (
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
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(level)} disabled={isLoading}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                disabled={isLoading}
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
                                  onClick={() => handleDeleteLevel(level)}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
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
              <Button onClick={handleEditLevel} disabled={isLoading}>
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
