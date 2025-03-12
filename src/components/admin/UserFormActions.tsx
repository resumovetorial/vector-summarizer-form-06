
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const UserFormActions: React.FC<UserFormActionsProps> = ({
  onCancel,
  onSubmit,
  submitLabel
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button onClick={onSubmit}>
        {submitLabel}
      </Button>
    </div>
  );
};

export default UserFormActions;
