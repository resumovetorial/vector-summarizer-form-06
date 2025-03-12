
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart4, Home, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col items-center sm:flex-row sm:items-center mb-4 sm:mb-0">
          <img 
            src="/lovable-uploads/b6d22591-56f9-448f-8acf-120f160d571f.png" 
            alt="Brasão de Itabuna" 
            className="h-20 w-auto mb-2 sm:mb-0 sm:mr-3"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold">DIVISÃO DE ENDEMIAS ITABUNA</h1>
            <p className="text-sm text-muted-foreground">
              Sistema de resumo vetorial
            </p>
          </div>
        </div>
        
        <nav>
          <div className="flex space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Início
              </Link>
            </Button>
            
            <Button variant="ghost" asChild>
              <Link to="/dashboard">
                <BarChart4 className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            
            <Button variant="ghost" asChild>
              <Link to="/admin">
                <ShieldAlert className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
