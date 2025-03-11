
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  children: ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ children, className }) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-6", className)}>
      {children}
    </div>
  );
};

export default FormSection;
