
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TreatedDepositsSection from './TreatedDepositsSection';
import { FormData, ValidationErrors } from '@/types/vectorForm';

interface TreatedDepositsStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  errors: ValidationErrors;
  prevStep: () => void;
  nextStep: () => void;
}

const TreatedDepositsStep: React.FC<TreatedDepositsStepProps> = ({
  formData,
  handleInputChange,
  errors,
  prevStep,
  nextStep
}) => {
  return (
    <>
      <TreatedDepositsSection 
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
      />
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        
        <Button 
          type="button"
          onClick={nextStep}
          className="flex items-center"
        >
          Próximo
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default TreatedDepositsStep;
