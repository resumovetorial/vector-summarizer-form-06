
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import ResultDisplay from './ResultDisplay';
import StepIndicator from './StepIndicator';
import GeneralInformationStep from './GeneralInformationStep';
import QuantitativeDataStep from './QuantitativeDataStep';
import DepositsInspectionStep from './DepositsInspectionStep';
import TreatedDepositsStep from './TreatedDepositsStep';
import SubmitButton from './SubmitButton';
import { useVectorForm } from '@/hooks/useVectorForm';
import { useLocation } from 'react-router-dom';
import { FormData } from '@/types/vectorForm';
import { toast } from 'sonner';

const VectorSummarizerForm: React.FC = () => {
  const location = useLocation();
  const editMode = location.state?.editMode;
  const vectorDataToEdit = location.state?.vectorDataToEdit as FormData | undefined;
  
  const {
    formData,
    setFormData,
    handleInputChange,
    errors,
    isLoading,
    handleSubmit,
    showResults,
    vectorData,
    summary,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    calculateTotal
  } = useVectorForm();
  
  // Carregar dados para edição quando disponíveis
  useEffect(() => {
    if (editMode && vectorDataToEdit) {
      setFormData(vectorDataToEdit);
      toast.info("Dados carregados para edição");
    }
  }, [editMode, vectorDataToEdit, setFormData]);
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 sm:p-8">
        {editMode && (
          <div className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-md">
            <p className="text-center font-medium">Modo de edição ativo</p>
            <p className="text-center text-sm">
              Você está editando dados da localidade {vectorDataToEdit?.locality}
            </p>
          </div>
        )}
        
        <StepIndicator currentStep={currentStep} totalSteps={5} />
        
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
          <TreatedDepositsStep 
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        
        {currentStep === 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editMode ? "Finalizar Edição" : "Finalizar"}
            </h2>
            <p className="text-center mb-6">
              {editMode 
                ? "Revise as alterações e clique em enviar para atualizar os dados."
                : "Revise as informações e clique em enviar para gerar o relatório."
              }
            </p>
            
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
                label={editMode ? "Atualizar" : undefined}
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
