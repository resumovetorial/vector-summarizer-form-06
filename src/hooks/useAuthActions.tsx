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

  // Helper para determinar o nível de acesso com base no email ou role
  const determineAccessLevel = (email: string, role: string): 'supervisor' | 'administrador' => {
    // Administradores
    if (role === 'admin' || email.includes('admin')) {
      return 'administrador';
    }
    
    // Todos os outros usuários serão supervisores
    return 'supervisor';
  };

  const login = async (email: string, password: string) => {
    console.log('useAuthActions - Tentando login com email:', email);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Simula verificação de credenciais (em ambiente real seria validado no backend)
      // Verificamos se o email é de um administrador
      const adminEmails = ['admin@sistema.com', 'resumovetorial@gmail.com'];
      const isAdmin = adminEmails.includes(email.toLowerCase());
      
      // Define o papel do usuário
      const role = isAdmin ? 'admin' : 'user';
      
      // Determina o nível de acesso com base no email e papel
      const accessLevel = determineAccessLevel(email.toLowerCase(), role);
      
      // Cria um usuário simulado conforme o tipo de acesso
      const mockUser: AuthUser = {
        id: '1',
        email: email,
        username: email.split('@')[0], // Use parte do email como username
        role: role,
        accessLevel: accessLevel,
        isAuthenticated: true
      };
      
      setUser(mockUser);
      toast.success(`Login realizado com sucesso como ${accessLevel}!`);
      
      // Redireciona para dashboard
      console.log(`useAuthActions - Login bem-sucedido como ${role}/${accessLevel}, redirecionando para dashboard`);
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
      
      // Determina o nível de acesso com base no email
      const accessLevel = determineAccessLevel(email.toLowerCase(), 'user');
      
      // Simula registro de usuário (em ambiente real seria enviado ao backend)
      const mockUser: AuthUser = {
        id: crypto.randomUUID(),
        email: email,
        username: email.split('@')[0],
        role: 'user', // Novos usuários sempre começam como 'user'
        accessLevel: accessLevel, // Mas agora só podem ser supervisor ou administrador
        isAuthenticated: true
      };
      
      setUser(mockUser);
      toast.success(`Cadastro realizado com sucesso como ${accessLevel}! Redirecionando para o formulário.`);
      
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
