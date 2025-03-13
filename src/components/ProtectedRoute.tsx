
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Simplesmente renderiza o conteúdo sem verificar autenticação
  return <>{children}</>;
};

export default ProtectedRoute;
