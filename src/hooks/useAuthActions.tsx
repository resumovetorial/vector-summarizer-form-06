
import { useLogin } from './auth/useLogin';
import { useRegister } from './auth/useRegister';
import { useLogout } from './auth/useLogout';
import { AuthUser } from '@/types/auth';

export function useAuthActions(
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const login = useLogin(setUser, setError, setIsLoading);
  const register = useRegister(setUser, setError, setIsLoading);
  const logout = useLogout(setUser, setIsLoading);

  return { login, register, logout };
}
