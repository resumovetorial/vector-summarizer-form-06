
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  animationDelay?: number;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading = false,
  isDisabled = false,
  className,
  animationDelay = 300
}) => {
  return (
    <Button
      type="submit"
      disabled={isDisabled || isLoading}
      className={cn(
        "relative overflow-hidden group w-full sm:w-auto px-8 py-6 h-auto",
        "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600",
        "shadow-md hover:shadow-lg transition-all duration-300 ease-in-out",
        "animate-slide-up font-medium text-base",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <span className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            Summarize
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </span>
        )}
      </span>
    </Button>
  );
};

export default SubmitButton;
