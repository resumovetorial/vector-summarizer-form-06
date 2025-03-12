
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Estado:', { 
    isAuthenticated, 
    isLoading, 
    isInitialized,
    pathname: location.pathname,
    user: user ? { role: user.role, email: user.email } : null
  });

  // Aguardar inicialização
  if (!isInitialized) {
    console.log('ProtectedRoute - Aguardando inicialização...');
    return (
      <div className="min-h-screen flex items-center justify-center background-gradient">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Verificar autenticação
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permissões de administrador
  const isAdmin = user?.role === 'admin' || 
                 ['resumovetorial@gmail.com', 'admin@example.com'].includes(user?.email || '');

  console.log('ProtectedRoute - Verificação de admin:', { isAdmin, role: user?.role, email: user?.email });

  // Verificar permissões específicas
  if (requiredRole === 'admin' && !isAdmin) {
    console.log('ProtectedRoute - Acesso negado: requer admin');
    return <Navigate to="/unauthorized" replace />;
  }

  if (!isAdmin && location.pathname.startsWith('/admin')) {
    console.log('ProtectedRoute - Acesso negado: rota de admin');
    return <Navigate to="/unauthorized" replace />;
  }

  // Acesso permitido
  console.log('ProtectedRoute - Acesso permitido');
  return <>{children}</>;
};

export default ProtectedRoute;
