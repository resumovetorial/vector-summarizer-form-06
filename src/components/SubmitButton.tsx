
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  isDisabled?: boolean;
  animationDelay?: number;
  label?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isLoading, 
  isDisabled, 
  animationDelay = 300,
  label
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, animationDelay);
    
    return () => clearTimeout(timeout);
  }, [animationDelay]);
  
  return (
    <Button 
      type="submit" 
      disabled={isDisabled}
      className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        label || "Enviar"
      )}
    </Button>
  );
};

export default SubmitButton;
