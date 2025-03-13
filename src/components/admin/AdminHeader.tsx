
import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Shield className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">Administração - DIVISÃO DE ENDEMIAS ITABUNA</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="bg-white hover:bg-gray-100 text-primary">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Link>
          </Button>
          <div className="text-sm">
            Controle de acesso e gerenciamento de usuários
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
