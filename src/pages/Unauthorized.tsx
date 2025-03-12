
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 background-gradient">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Acesso Pendente</h1>
        
        <div className="mb-6 text-center">
          <div className="text-yellow-600 bg-yellow-50 p-4 rounded-md mb-4">
            <p className="font-medium text-lg mb-2">Sua conta está aguardando aprovação</p>
            <p className="text-sm">
              Olá, {user?.username || 'Usuário'}. Sua conta foi criada com sucesso, 
              mas precisa ser aprovada por um administrador antes que você possa 
              acessar o sistema.
            </p>
          </div>
          
          <p className="text-gray-600 text-sm mb-6">
            Por favor, entre em contato com o administrador do sistema para 
            obter acesso. Quando sua conta for aprovada, você poderá fazer login novamente.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleLogout}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Voltar para Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
