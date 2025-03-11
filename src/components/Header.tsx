
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
        <div className="text-center sm:text-left">
          <p className="text-xs uppercase tracking-wider text-muted-foreground animate-slide-up">
            Vector Summarizer
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight animate-slide-up" style={{ animationDelay: '50ms' }}>
            VecSum
          </h1>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-0 glass py-2 px-4 rounded-full flex items-center shadow-subtle animate-slide-down">
        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
        <p className="text-sm text-muted-foreground">Ready to process</p>
      </div>
    </header>
  );
};

export default Header;
