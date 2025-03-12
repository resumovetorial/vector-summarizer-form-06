
import { createContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth';

// Create a context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component to wrap the app
export function AuthProvider({ children, value }: { children: ReactNode, value: AuthContextType }) {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the context
export default AuthContext;
