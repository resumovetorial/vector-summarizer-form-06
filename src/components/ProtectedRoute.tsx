
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Apenas mostra um indicador de carregamento durante a inicialização
  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Redireciona para login apenas quando temos certeza que não está autenticado
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Usuário não autenticado, redirecionando para /login');
    return <Navigate to="/login" replace />;
  }

  // Se chegou aqui, o usuário está autenticado
  return <>{children}</>;
};

export default ProtectedRoute;
