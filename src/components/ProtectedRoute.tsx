
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
    // Define public pages that don't require authentication
    const publicPages = ['/login', '/unauthorized'];
    const isPublicPage = publicPages.includes(location.pathname);

    // Show loading indicator while initializing
    if (!isInitialized) {
      setContent(
        <div className="min-h-screen flex items-center justify-center background-gradient">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      );
      return;
    }

    // CASE 1: Public page - always allow access regardless of auth status
    if (isPublicPage) {
      setContent(children);
      return;
    }
    
    // CASE 2: Protected page but user is not authenticated - redirect to login
    if (!isAuthenticated) {
      setContent(<Navigate to="/login" state={{ from: location }} replace />);
      return;
    }
    
    // CASE 3: User is authenticated but we need to check roles for admin access
    if (user) {
      const isAdmin = user.role === 'admin' || 
                    ['resumovetorial@gmail.com', 'admin@example.com'].includes(user.email || '');
      
      // Check admin role requirement
      if (requiredRole === 'admin' && !isAdmin) {
        setContent(<Navigate to="/unauthorized" replace />);
        return;
      }
      
      // Check admin routes access
      if (!isAdmin && location.pathname.startsWith('/admin')) {
        setContent(<Navigate to="/unauthorized" replace />);
        return;
      }
    }
    
    // CASE 4: All checks passed - grant access
    setContent(children);
  }, [isAuthenticated, isInitialized, user, location, children, requiredRole]);

  return <>{content}</>;
};

export default ProtectedRoute;
