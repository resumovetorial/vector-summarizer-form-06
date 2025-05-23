
export interface AuthUser {
  username: string;
  role: string;
  isAuthenticated: boolean;
  id: string;
  email?: string;
  accessLevel?: 'supervisor' | 'administrador';
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error?: string | null;
  hasPermission: (requiredRole: string) => boolean;
  hasAccessLevel: (requiredLevel: 'supervisor' | 'administrador') => boolean;
}
