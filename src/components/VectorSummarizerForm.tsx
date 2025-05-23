
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
import { useLocation, useNavigate } from 'react-router-dom';
import { FormData } from '@/types/vectorForm';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const VectorSummarizerForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editMode = location.state?.editMode || false;
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
  
  // Load edit data when available
  useEffect(() => {
    if (editMode && vectorDataToEdit) {
      console.log("Carregando dados para edição:", vectorDataToEdit);
      
      // Log the recordId to verify it was properly loaded
      if (vectorDataToEdit.recordId) {
        console.log("Editando registro com ID:", vectorDataToEdit.recordId);
      }
      
      // Certifica-se de que todos os campos numéricos estão no formato correto
      const processedData = { ...vectorDataToEdit };
      
      // Converter campos para o formato correto
      Object.keys(processedData).forEach(key => {
        if (typeof processedData[key] === 'number') {
          processedData[key] = processedData[key].toString();
        }
      });
      
      setFormData(processedData);
      // Usar toast.info uma única vez para evitar múltiplos alertas
      toast.info("Dados carregados para edição", {
        id: "edit-data-loaded", // ID único para evitar duplicação
        duration: 3000 // Duração em ms
      });
    }
  }, [editMode, vectorDataToEdit, setFormData]);
  
  const handleCancel = () => {
    if (window.confirm("Deseja cancelar a edição? Alterações não salvas serão perdidas.")) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 sm:p-8">
        {editMode && (
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
            <AlertTitle className="text-blue-800 font-medium">Modo de edição ativo</AlertTitle>
            <AlertDescription className="text-blue-700">
              <p>
                Você está editando dados da localidade {vectorDataToEdit?.locality}
                {vectorDataToEdit?.recordId && (
                  <span className="text-xs block mt-1">ID: {vectorDataToEdit.recordId}</span>
                )}
              </p>
              <div className="mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  className="bg-white hover:bg-gray-100"
                >
                  Cancelar edição
                </Button>
              </div>
            </AlertDescription>
          </Alert>
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
