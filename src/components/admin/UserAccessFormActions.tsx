
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface UserAccessFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isLoading?: boolean;
}

const UserAccessFormActions: React.FC<UserAccessFormActionsProps> = ({ 
  onCancel, 
  onSave,
  isLoading = false
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar"
        )}
      </Button>
    </div>
  );
};

export default UserAccessFormActions;
