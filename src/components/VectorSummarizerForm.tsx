
import React from 'react';
import ResultDisplay from './ResultDisplay';
import StepIndicator from './StepIndicator';
import GeneralInformationStep from './GeneralInformationStep';
import QuantitativeDataStep from './QuantitativeDataStep';
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
        <StepIndicator currentStep={currentStep} totalSteps={2} />
        
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
            isLoading={isLoading}
          />
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
