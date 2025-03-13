
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona somente se estiver inicializado E autenticado
    if (isInitialized && isAuthenticated) {
      console.log('Login - Redirecionando para dashboard, usuário já autenticado');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate]);

  const handleRegisterSuccess = () => {
    setActiveTab('login');
  };

  // Exibe o formulário de login mesmo durante a inicialização
  return (
    <div className="min-h-screen flex items-center justify-center background-gradient p-4">
      <Card className="w-full max-w-md shadow-lg bg-[#D3E4FD]">
        <CardHeader className="space-y-2 text-center">
          <LoginHeader />
        </CardHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardContent>
              <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            </CardContent>
          </TabsContent>
          
          <TabsContent value="register">
            <CardContent>
              <RegisterForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onRegisterSuccess={handleRegisterSuccess}
              />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
