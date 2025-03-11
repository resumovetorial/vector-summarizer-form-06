
import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps,
  className
}) => {
  return (
    <div className={cn("w-full flex items-center justify-between mb-8", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <div key={stepNumber} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Line before */}
              {stepNumber > 1 && (
                <div 
                  className={cn(
                    "h-1 flex-1", 
                    isCompleted ? "bg-blue-500" : "bg-gray-300"
                  )}
                />
              )}
              
              {/* Circle */}
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  isActive ? "bg-blue-600 text-white" : 
                  isCompleted ? "bg-blue-500 text-white" : 
                  "bg-gray-200 text-gray-600"
                )}
              >
                {stepNumber}
              </div>
              
              {/* Line after */}
              {stepNumber < totalSteps && (
                <div 
                  className={cn(
                    "h-1 flex-1", 
                    isCompleted ? "bg-blue-500" : "bg-gray-300"
                  )}
                />
              )}
            </div>
            
            <span 
              className={cn(
                "text-xs mt-2",
                isActive || isCompleted ? "text-blue-600 font-medium" : "text-gray-500"
              )}
            >
              {stepNumber === 1 ? 'Informações Gerais' : 'Dados Quantitativos'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
