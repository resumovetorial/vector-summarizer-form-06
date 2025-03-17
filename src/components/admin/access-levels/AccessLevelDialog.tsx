
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AccessLevelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formName: string;
  formDescription: string;
  formPermissions: string;
  onSubmit: () => void;
  setFormName: (value: string) => void;
  setFormDescription: (value: string) => void;
  setFormPermissions: (value: string) => void;
  isLoading: boolean;
}

const AccessLevelDialog: React.FC<AccessLevelDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  formName,
  formDescription,
  formPermissions,
  onSubmit,
  setFormName,
  setFormDescription,
  setFormPermissions,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              value={formName} 
              onChange={(e) => setFormName(e.target.value)} 
              required
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
            <p className="text-xs text-muted-foreground">
              Exemplos: dashboard, form, admin, reports, settings
            </p>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processando..." : title === "Adicionar Nível de Acesso" ? "Adicionar Nível" : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessLevelDialog;
