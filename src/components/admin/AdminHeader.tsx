
import React from 'react';
import { Shield } from 'lucide-react';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Shield className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">Administração - DIVISÃO DE ENDEMIAS ITABUNA</h1>
        </div>
        <div className="text-sm">
          Controle de acesso e gerenciamento de usuários
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
