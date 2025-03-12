
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    // Evitar múltiplas submissões
    if (isSubmitting || isLoading) {
      console.log('LoginForm - Ignorando submissão adicional enquanto processando');
      return;
    }
    
    try {
      console.log('LoginForm - Iniciando processo de login');
      setIsSubmitting(true);
      const success = await login(email, password);
      console.log('LoginForm - Login concluído, sucesso:', success);
      
      // Não faça nada após login bem-sucedido - o redirecionamento é tratado em useAuthActions
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isLoading || isSubmitting;
  const buttonText = isButtonDisabled ? "Entrando..." : "Entrar";

  return (
    <form onSubmit={handleLogin}>
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
            className="bg-[#F1F1F1]"
            disabled={isButtonDisabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="login-password">Senha</Label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            className="bg-[#F1F1F1]"
            disabled={isButtonDisabled}
          />
        </div>
      </div>
      
      <div className="flex items-center mt-6">
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {buttonText}
            </span>
          ) : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
