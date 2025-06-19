
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';

interface UserManagementActionsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (() => void) | ((isOpen: boolean) => void);
  isLoading: boolean;
  onRefresh?: () => void;
}

const UserManagementActions: React.FC<UserManagementActionsProps> = ({ 
  isAddDialogOpen, 
  setIsAddDialogOpen,
  isLoading,
  onRefresh
}) => {
  const handleAddUserClick = () => {
    if (typeof setIsAddDialogOpen === 'function') {
      if (setIsAddDialogOpen.length === 0) {
        // It's a function with no parameters
        (setIsAddDialogOpen as () => void)();
      } else {
        // It's a function that expects a boolean parameter
        (setIsAddDialogOpen as (isOpen: boolean) => void)(true);
      }
    }
  };

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
        onClick={handleAddUserClick}
        disabled={isLoading || isAddDialogOpen}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Adicionar Usuário
      </Button>
    </div>
  );
};

export default UserManagementActions;
