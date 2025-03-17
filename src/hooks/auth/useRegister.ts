
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthUser } from '@/types/auth';
import { determineAccessLevel } from '@/utils/authHelpers';

export function useRegister(
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const navigate = useNavigate();

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
      setError(error.message);
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return register;
}
