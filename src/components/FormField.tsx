
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
  description?: string;
  required?: boolean;
  animationDelay?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  className,
  children,
  description,
  required = false,
  animationDelay = 0
}) => {
  return (
    <div 
      className={cn(
        "mb-6 animate-slide-up form-transition", 
        className
      )} 
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <label 
        htmlFor={id} 
        className="block text-sm font-medium mb-2 text-foreground"
      >
        {label}
        {required && <span className="text-blue-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-destructive animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
