
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for checking user permissions related to access levels
 */
export const useAccessLevelsPermissions = () => {
  const { user } = useAuth();

  /**
   * Check if the user has permission to manage access levels
   */
  const hasPermissionToManage = (): boolean => {
    if (!user) return false;
    
    // Administrador sempre tem acesso
    if (user.role === 'admin') return true;
    
    // Verificar o nível de acesso do usuário
    const accessLevel = user.accessLevel?.toLowerCase();
    return accessLevel === 'supervisor' || accessLevel === 'administrador';
  };

  return {
    isAdmin: hasPermissionToManage()
  };
};
