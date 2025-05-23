
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QuantitativeDataSection from './QuantitativeDataSection';
import TreatmentInspectionSection from './TreatmentInspectionSection';
import { FormData, ValidationErrors } from '@/types/vectorForm';

interface QuantitativeDataStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  errors: ValidationErrors;
  calculateTotal: () => void;
  prevStep: () => void;
  nextStep: () => void;
}

const QuantitativeDataStep: React.FC<QuantitativeDataStepProps> = ({
  formData,
  handleInputChange,
  errors,
  calculateTotal,
  prevStep,
  nextStep
}) => {
  return (
    <>
      <QuantitativeDataSection 
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
        calculateTotal={calculateTotal}
      />
      
      <TreatmentInspectionSection
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

export default QuantitativeDataStep;
