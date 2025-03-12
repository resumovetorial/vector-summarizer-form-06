
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import DepositsInspectionSection from './DepositsInspectionSection';
import { FormData, ValidationErrors } from '@/types/vectorForm';

interface DepositsInspectionStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  errors: ValidationErrors;
  prevStep: () => void;
  nextStep: () => void;
}

const DepositsInspectionStep: React.FC<DepositsInspectionStepProps> = ({
  formData,
  handleInputChange,
  errors,
  prevStep,
  nextStep
}) => {
  return (
    <>
      <DepositsInspectionSection 
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
      </div>
    </>
  );
};

export default DepositsInspectionStep;
