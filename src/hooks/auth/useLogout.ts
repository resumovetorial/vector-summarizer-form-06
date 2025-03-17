
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useLogout(
  setUser: React.Dispatch<React.SetStateAction<any | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      toast.success("Logout realizado com sucesso");
      navigate('/login', { replace: true });
      return true;
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return logout;
}
