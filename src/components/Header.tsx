
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart4, Home, LogOut, ShieldAlert, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AccessLevelBadge from './AccessLevelBadge';

const Header = () => {
  const { isAuthenticated, logout, hasPermission, user } = useAuth();

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
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
            {isAuthenticated && user?.accessLevel && (
              <div className="mb-2 sm:mb-0 sm:mr-2">
                <AccessLevelBadge level={user.accessLevel} />
              </div>
            )}
            
            <div className="flex space-x-2">
              {isAuthenticated && (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/">
                      <Home className="h-4 w-4 mr-2" />
                      Formulário
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">
                      <BarChart4 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  
                  {/* Mostra link de Admin apenas se o usuário tiver acesso de administrador */}
                  {hasPermission('admin') || (user?.accessLevel === 'administrador') && (
                    <Button variant="ghost" asChild>
                      <Link to="/admin">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  
                  <Button variant="ghost" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              )}
              
              {!isAuthenticated && (
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
