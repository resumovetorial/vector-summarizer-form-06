
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AccessLevelGuardProps {
  children: React.ReactNode;
  requiredLevel: 'supervisor' | 'administrador';
  fallbackMessage?: string;
}

const AccessLevelGuard: React.FC<AccessLevelGuardProps> = ({ 
  children, 
  requiredLevel,
  fallbackMessage
}) => {
  const { hasAccessLevel } = useAuth();
  
  const hasAccess = hasAccessLevel(requiredLevel);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-500 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Acesso Restrito
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center">
          {fallbackMessage || `Você precisa ter nível de acesso "${requiredLevel}" ou superior para visualizar este conteúdo.`}
        </p>
      </CardContent>
    </Card>
  );
};

export default AccessLevelGuard;
