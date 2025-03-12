
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center background-gradient">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has been approved by an admin
  // By default, only users with role 'admin' are considered approved
  const isApproved = user?.role === 'admin';

  // For the admin route, strictly check for admin role
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  // For dashboard and other routes, check if user is approved
  if (!isApproved && location.pathname !== '/unauthorized') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
