
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AccessDeniedCard: React.FC = () => {
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
};

export default AccessDeniedCard;
