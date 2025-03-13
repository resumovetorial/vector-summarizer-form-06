
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth();
  const location = useLocation();
  const [content, setContent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    // Define a list of public routes that don't require authentication
    const publicPaths = ['/login', '/unauthorized'];
    const isPublicPath = publicPaths.includes(location.pathname);

    // Still initializing auth - show loading spinner
    if (!isInitialized) {
      setContent(
        <div className="min-h-screen flex items-center justify-center background-gradient">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      );
      return;
    }

    // PUBLIC ROUTES: Always accessible
    if (isPublicPath) {
      setContent(children);
      return;
    }

    // PROTECTED ROUTES: Not authenticated - redirect to login
    if (!isAuthenticated) {
      setContent(<Navigate to="/login" state={{ from: location }} replace />);
      return;
    }

    // ADMIN ROUTES: Check role requirements
    if (requiredRole === 'admin' || location.pathname.startsWith('/admin')) {
      const isAdmin = user?.role === 'admin' || 
                     ['resumovetorial@gmail.com', 'admin@example.com'].includes(user?.email || '');
      
      if (!isAdmin) {
        setContent(<Navigate to="/unauthorized" replace />);
        return;
      }
    }

    // Default: Render children when all checks pass
    setContent(children);
  }, [isAuthenticated, isInitialized, user, location.pathname, location, children, requiredRole]);

  // While auth is initializing, show the loading state
  if (isInitialized && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center background-gradient">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return <>{content}</>;
};

export default ProtectedRoute;
