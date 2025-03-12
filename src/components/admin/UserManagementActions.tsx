
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface UserManagementActionsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isLoading: boolean;
}

const UserManagementActions: React.FC<UserManagementActionsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isLoading
}) => {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto" disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default UserManagementActions;
