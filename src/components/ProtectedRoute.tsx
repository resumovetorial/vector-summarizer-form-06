
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Aguarda a inicialização da autenticação para evitar redirecionamentos prematuros
  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
