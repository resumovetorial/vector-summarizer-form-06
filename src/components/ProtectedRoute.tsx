
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth();
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    console.log('ProtectedRoute - Estado:', { 
      isAuthenticated, 
      isLoading, 
      isInitialized,
      pathname: location.pathname,
      user: user ? { role: user.role, email: user.email } : null
    });

    // Aguardar inicialização da autenticação antes de tomar decisões
    if (!isInitialized) {
      console.log('ProtectedRoute - Aguardando inicialização da autenticação...');
      setShouldRender(
        <div className="min-h-screen flex items-center justify-center background-gradient">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      );
      return;
    }

    // Verificar autenticação - redirecionar para login se não estiver autenticado
    if (!isAuthenticated) {
      console.log('ProtectedRoute - Usuário não autenticado, redirecionando para login');
      setShouldRender(<Navigate to="/login" state={{ from: location }} replace />);
      return;
    }

    // Verificar permissões de administrador
    const isAdmin = user?.role === 'admin' || 
                   ['resumovetorial@gmail.com', 'admin@example.com'].includes(user?.email || '');

    console.log('ProtectedRoute - Verificação de admin:', { isAdmin, role: user?.role, email: user?.email });

    // Verificar permissões específicas
    if (requiredRole === 'admin' && !isAdmin) {
      console.log('ProtectedRoute - Acesso negado: requer admin');
      setShouldRender(<Navigate to="/unauthorized" replace />);
      return;
    }

    if (!isAdmin && location.pathname.startsWith('/admin')) {
      console.log('ProtectedRoute - Acesso negado: rota de admin');
      setShouldRender(<Navigate to="/unauthorized" replace />);
      return;
    }

    // Acesso permitido
    console.log('ProtectedRoute - Acesso permitido');
    setShouldRender(children);
  }, [isAuthenticated, isInitialized, isLoading, user, location, children, requiredRole]);

  return <>{shouldRender}</>;
};

export default ProtectedRoute;
