
/**
 * Format error messages for common auth errors
 */
export const formatAuthError = (error: any): string => {
  let errorMessage = "Erro inesperado. Tente novamente.";
  
  if (error.message) {
    if (error.message.includes("already registered")) {
      errorMessage = "Este email já está cadastrado. Por favor, faça login.";
    } else if (error.message.includes("password")) {
      errorMessage = "A senha deve ter pelo menos 6 caracteres.";
    } else if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Email ou senha inválidos. Tente novamente.";
    } else {
      errorMessage = error.message;
    }
  }
  
  return errorMessage;
};
