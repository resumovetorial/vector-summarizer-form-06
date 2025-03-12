
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserAccessFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
}

const UserAccessFormActions: React.FC<UserAccessFormActionsProps> = ({
  onCancel,
  onSave
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button onClick={onSave}>
        Salvar Configurações de Acesso
      </Button>
    </div>
  );
};

export default UserAccessFormActions;
