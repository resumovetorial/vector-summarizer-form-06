
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  username: string;
  role: string;
  isAuthenticated: boolean;
  id: string;
  email?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}
