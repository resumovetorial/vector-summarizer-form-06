
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';

interface UserManagementActionsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  onRefresh?: () => void;
}

const UserManagementActions: React.FC<UserManagementActionsProps> = ({ 
  isAddDialogOpen, 
  setIsAddDialogOpen,
  isLoading,
  onRefresh
}) => {
  return (
    <div className="flex space-x-2">
      {onRefresh && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar Lista
        </Button>
      )}
      <Button 
        size="sm" 
        onClick={() => setIsAddDialogOpen(true)}
        disabled={isLoading || isAddDialogOpen}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Adicionar Usuário
      </Button>
    </div>
  );
};

export default UserManagementActions;
