
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const AccessRestrictionCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-500 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Acesso Restrito
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 text-center">
          <p className="mb-2">Você não tem permissão para visualizar os dados desta localidade.</p>
          <p className="text-sm text-muted-foreground">Entre em contato com um administrador para solicitar acesso.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessRestrictionCard;
