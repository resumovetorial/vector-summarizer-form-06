
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AccessLevelBadgeProps {
  level: 'agente' | 'supervisor' | 'administrador' | string;
  className?: string;
}

const AccessLevelBadge: React.FC<AccessLevelBadgeProps> = ({ level, className = '' }) => {
  let color = '';
  
  switch (level.toLowerCase()) {
    case 'administrador':
      color = 'bg-red-500 hover:bg-red-600';
      break;
    case 'supervisor':
      color = 'bg-blue-500 hover:bg-blue-600';
      break;
    case 'agente':
      color = 'bg-green-500 hover:bg-green-600';
      break;
    default:
      color = 'bg-gray-500 hover:bg-gray-600';
  }
  
  return (
    <Badge className={`${color} ${className}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  );
};

export default AccessLevelBadge;
