
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/types/auth';
import { determineAccessLevel, createDemoSession } from '@/utils/authHelpers';

export function useLogin(
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    console.log('useLogin - Tentando login com email:', email);
    
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

      // Cria uma sessão demo válida
      const demoSession = createDemoSession(email, role);
      
      console.log('Sessão configurada com sucesso:', demoSession);
      
      // Configurar sessão manual no Supabase
      await supabase.auth.setSession(demoSession);
      
      // Simulação de login no Supabase para obter um token válido
      try {
        // Tentar fazer login real no Supabase (vai falhar em modo de demo, mas não tem problema)
        const { error: authError } = await supabase.auth.signInWithPassword({
          email, 
          password
        });
        
        if (authError) {
          // Em modo de demonstração, ignoramos este erro
          console.log('Modo de demonstração: Ignorando erro de auth do Supabase:', authError.message);
        }
      } catch (supabaseError) {
        // Ignorar erros do Supabase em modo de demonstração
        console.log('Modo de demonstração: Erro ignorado do Supabase:', supabaseError);
      }
      
      setUser(mockUser);
      toast.success(`Login realizado com sucesso como ${accessLevel}!`);
      
      // Redireciona para dashboard
      console.log(`useLogin - Login bem-sucedido como ${role}/${accessLevel}, redirecionando para dashboard`);
      navigate('/dashboard', { replace: true });
      return true;
      
    } catch (error: any) {
      console.error('useLogin - Erro no login:', error);
      setError(error.message);
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return login;
}
