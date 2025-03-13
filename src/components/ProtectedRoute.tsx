
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized, user } = useAuth();

  // If still initializing, show a loading spinner
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center background-gradient">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
