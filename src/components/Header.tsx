
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart4, Home } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <AnimatedLogo />
          <div className="ml-3">
            <h1 className="text-xl sm:text-2xl font-bold">VectorSummarizer</h1>
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
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
