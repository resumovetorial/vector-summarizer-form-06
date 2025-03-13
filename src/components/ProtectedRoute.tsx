
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
  const [content, setContent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    // Definir páginas públicas que não exigem autenticação
    const publicPages = ['/login', '/unauthorized'];
    const isPublicPage = publicPages.includes(location.pathname);

    // Mostrar loader durante inicialização
    if (!isInitialized) {
      setContent(
        <div className="min-h-screen flex items-center justify-center background-gradient">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      );
      return;
    }

    // Se estiver em uma página pública, permitir acesso independente de autenticação
    if (isPublicPage) {
      setContent(children);
      return;
    }

    // Redirecionar para login se não estiver autenticado
    if (!isAuthenticated) {
      setContent(<Navigate to="/login" state={{ from: location }} replace />);
      return;
    }

    // Verificações de role apenas para usuários autenticados
    if (user) {
      const isAdmin = user.role === 'admin' || 
                     ['resumovetorial@gmail.com', 'admin@example.com'].includes(user.email || '');

      // Verificar requisito específico de role
      if (requiredRole === 'admin' && !isAdmin) {
        setContent(<Navigate to="/unauthorized" replace />);
        return;
      }

      // Verificar acesso a rotas de admin
      if (!isAdmin && location.pathname.startsWith('/admin')) {
        setContent(<Navigate to="/unauthorized" replace />);
        return;
      }
    }

    // Acesso concedido
    setContent(children);
  }, [isAuthenticated, isInitialized, user, location, children, requiredRole]);

  return <>{content}</>;
};

export default ProtectedRoute;
