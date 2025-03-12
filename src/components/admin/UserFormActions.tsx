
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface UserFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isLoading?: boolean;
}

const UserFormActions: React.FC<UserFormActionsProps> = ({
  onCancel,
  onSubmit,
  submitLabel,
  isLoading = false
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancelar
      </Button>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
};

export default UserFormActions;
