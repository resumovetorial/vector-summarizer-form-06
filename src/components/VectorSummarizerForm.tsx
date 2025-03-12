
import React from 'react';
import ResultDisplay from './ResultDisplay';
import StepIndicator from './StepIndicator';
import GeneralInformationStep from './GeneralInformationStep';
import QuantitativeDataStep from './QuantitativeDataStep';
import DepositsInspectionStep from './DepositsInspectionStep';
import SubmitButton from './SubmitButton';
import { useVectorForm } from '@/hooks/useVectorForm';

const VectorSummarizerForm: React.FC = () => {
  const {
    formData,
    handleInputChange,
    errors,
    isLoading,
    handleSubmit,
    showResults,
    vectorData,
    summary,
    currentStep,
    nextStep,
    prevStep,
    calculateTotal
  } = useVectorForm();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 sm:p-8">
        <StepIndicator currentStep={currentStep} totalSteps={4} />
        
        {currentStep === 1 && (
          <GeneralInformationStep 
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            nextStep={nextStep}
          />
        )}
        
        {currentStep === 2 && (
          <QuantitativeDataStep 
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            calculateTotal={calculateTotal}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}

        {currentStep === 3 && (
          <DepositsInspectionStep 
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Finalizar</h2>
            <p className="text-center mb-6">Revise as informações e clique em enviar para gerar o relatório.</p>
            
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
              
              <SubmitButton 
                isLoading={isLoading} 
                isDisabled={isLoading} 
                animationDelay={650}
              />
            </div>
          </div>
        )}
      </form>
      
      <ResultDisplay 
        visible={showResults} 
        vectorData={vectorData} 
        summary={summary} 
      />
    </div>
  );
};

export default VectorSummarizerForm;
