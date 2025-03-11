
import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn(
      "w-full py-6 px-4 sm:px-6 mt-auto",
      "text-center text-sm text-muted-foreground",
      className
    )}>
      <p>© {new Date().getFullYear()} VecSum. All rights reserved.</p>
      <p className="mt-1 text-xs">
        Crafted with precision for vector summarization.
      </p>
    </footer>
  );
};

export default Footer;
