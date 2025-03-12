
export const validateUserForm = (
  name: string,
  email: string,
  role: string,
  accessLevel: string,
  setFormErrors: (errors: string | null) => void
): boolean => {
  if (!name.trim()) {
    setFormErrors("O nome do usuário é obrigatório");
    return false;
  }
  if (!email.trim()) {
    setFormErrors("O email do usuário é obrigatório");
    return false;
  }
  if (!role.trim()) {
    setFormErrors("O cargo do usuário é obrigatório");
    return false;
  }
  if (!accessLevel) {
    setFormErrors("O nível de acesso é obrigatório");
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    setFormErrors("Por favor, insira um email válido");
    return false;
  }

  setFormErrors(null);
  return true;
};
