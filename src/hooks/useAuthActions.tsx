
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatAuthError } from '@/utils/authUtils';
import { AuthUser } from '@/types/auth';

export function useAuthActions(
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    console.log('useAuthActions - Tentando login com email:', email);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Simula verificação de credenciais (em ambiente real seria validado no backend)
      // Verificamos se o email é de um administrador
      const adminEmails = ['admin@sistema.com', 'resumovetorial@gmail.com'];
      const isAdmin = adminEmails.includes(email.toLowerCase());
      
      // Cria um usuário simulado conforme o tipo de acesso
      const mockUser: AuthUser = {
        id: '1',
        email: email,
        username: email.split('@')[0], // Use parte do email como username
        role: isAdmin ? 'admin' : 'user',
        isAuthenticated: true
      };
      
      setUser(mockUser);
      toast.success("Login realizado com sucesso!");
      
      // Redireciona para dashboard
      console.log(`useAuthActions - Login bem-sucedido como ${mockUser.role}, redirecionando para dashboard`);
      navigate('/dashboard', { replace: true });
      return true;
      
    } catch (error: any) {
      console.error('useAuthActions - Erro no login:', error);
      const errorMessage = formatAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simula registro de usuário (em ambiente real seria enviado ao backend)
      // Novos usuários são sempre criados com papel 'user'
      const mockUser: AuthUser = {
        id: crypto.randomUUID(),
        email: email,
        username: email.split('@')[0],
        role: 'user', // Novos usuários sempre começam como 'user'
        isAuthenticated: true
      };
      
      setUser(mockUser);
      toast.success("Cadastro realizado com sucesso! Redirecionando para o formulário.");
      
      // Redireciona para o formulário após o registro
      navigate('/', { replace: true });
      return true;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      const errorMessage = formatAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      toast.success("Logout realizado com sucesso");
      navigate('/login', { replace: true });
      return true;
    } catch (error: any) {
      console.error('Erro no logout:', error);
      setError(error.message);
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, logout };
}
