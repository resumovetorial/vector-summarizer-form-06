
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
    // Wait for auth to initialize before making decisions
    if (!isInitialized) {
      setContent(
        <div className="min-h-screen flex items-center justify-center background-gradient">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      );
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      setContent(<Navigate to="/login" state={{ from: location }} replace />);
      return;
    }

    // Check admin permissions if needed
    const isAdmin = user?.role === 'admin' || 
                   ['resumovetorial@gmail.com', 'admin@example.com'].includes(user?.email || '');

    // Verify specific role requirements
    if (requiredRole === 'admin' && !isAdmin) {
      setContent(<Navigate to="/unauthorized" replace />);
      return;
    }

    // Verify admin route access
    if (!isAdmin && location.pathname.startsWith('/admin')) {
      setContent(<Navigate to="/unauthorized" replace />);
      return;
    }

    // Access granted
    setContent(children);
  }, [isAuthenticated, isInitialized, isLoading, user, location, children, requiredRole]);

  return <>{content}</>;
};

export default ProtectedRoute;
