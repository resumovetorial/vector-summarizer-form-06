
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isInitialized, user, error } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Estado atual:', { 
    isAuthenticated, 
    isLoading, 
    isInitialized,
    pathname: location.pathname,
    user: user ? { role: user.role, email: user.email } : null,
    error
  });

  // Se ainda estiver inicializando ou carregando, mostrar o spinner
  if (!isInitialized || isLoading) {
    console.log('ProtectedRoute - Aguardando inicialização...');
    return (
      <div className="min-h-screen flex items-center justify-center background-gradient">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para o login
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Não autenticado, redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar o papel do usuário e aprovar automaticamente o admin pelo email
  const isAdmin = user?.role === 'admin' || 
                  (user?.email && ['resumovetorial@gmail.com', 'admin@example.com'].includes(user.email));
  
  console.log('ProtectedRoute - Verificação de admin:', { isAdmin, role: user?.role, email: user?.email });
  
  // Verificar se o usuário tem acesso à rota solicitada
  if (requiredRole === 'admin' && !isAdmin) {
    console.log('ProtectedRoute - Usuário não tem permissão de admin:', user);
    return <Navigate to="/unauthorized" replace />;
  }

  // Para dashboard e outras rotas protegidas, verificar se o usuário é admin ou está aprovado
  if (!isAdmin && location.pathname !== '/unauthorized') {
    console.log('ProtectedRoute - Usuário não aprovado/admin para acessar:', location.pathname, user);
    return <Navigate to="/unauthorized" replace />;
  }

  // Se passou por todas as verificações, renderizar o conteúdo
  console.log('ProtectedRoute - Acesso permitido:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
