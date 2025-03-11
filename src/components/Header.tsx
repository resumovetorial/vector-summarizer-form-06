
import React from 'react';
import AnimatedLogo from './AnimatedLogo';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full py-6 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between",
      "animate-fade-in",
      className
    )}>
      <div className="flex items-center">
        <AnimatedLogo className="mr-2" />
      </div>
      
      <div className="mt-4 sm:mt-0 glass py-2 px-4 rounded-full flex items-center shadow-subtle animate-slide-down">
        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
        <p className="text-sm text-muted-foreground">Pronto para processar</p>
      </div>
    </header>
  );
};

export default Header;
