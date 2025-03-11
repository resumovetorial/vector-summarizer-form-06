
import React from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import FormField from './FormField';
import SubmitButton from './SubmitButton';
import ResultDisplay from './ResultDisplay';
import FormSection from './FormSection';
import DatePickerField from './DatePickerField';
import StepIndicator from './StepIndicator';
import QuantitativeDataSection from './QuantitativeDataSection';
import { useVectorForm } from '@/hooks/useVectorForm';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Informações Gerais</h2>
            <FormSection>
              <FormField
                id="municipality"
                label="Município"
                required
                error={errors.municipality}
                animationDelay={50}
              >
                <Input
                  id="municipality"
                  value={formData.municipality}
                  onChange={(e) => handleInputChange('municipality', e.target.value)}
                  placeholder="Digite o município"
                  className="w-full"
                />
              </FormField>
              
              <FormField
                id="locality"
                label="Localidade"
                required
                error={errors.locality}
                animationDelay={100}
              >
                <Input
                  id="locality"
                  value={formData.locality}
                  onChange={(e) => handleInputChange('locality', e.target.value)}
                  placeholder="Digite a localidade"
                  className="w-full"
                />
              </FormField>
            </FormSection>
            
            <FormSection>
              <FormField
                id="cycle"
                label="Ciclo"
                required
                error={errors.cycle}
                animationDelay={150}
              >
                <Input
                  id="cycle"
                  value={formData.cycle}
                  onChange={(e) => handleInputChange('cycle', e.target.value)}
                  placeholder="Digite o ciclo"
                  className="w-full"
                />
              </FormField>
              
              <FormField
                id="epidemiologicalWeek"
                label="Semana Epidemiológica"
                required
                error={errors.epidemiologicalWeek}
                animationDelay={200}
              >
                <Input
                  id="epidemiologicalWeek"
                  value={formData.epidemiologicalWeek}
                  onChange={(e) => handleInputChange('epidemiologicalWeek', e.target.value)}
                  placeholder="Digite a semana epidemiológica"
                  className="w-full"
                />
              </FormField>
            </FormSection>
            
            <FormSection>
              <DatePickerField
                id="startDate"
                label="Data Inicial"
                date={formData.startDate}
                onDateChange={(date) => handleInputChange('startDate', date)}
                required
                error={errors.startDate}
                animationDelay={250}
              />
              
              <DatePickerField
                id="endDate"
                label="Data Final"
                date={formData.endDate}
                onDateChange={(date) => handleInputChange('endDate', date)}
                required
                error={errors.endDate}
                animationDelay={300}
              />
            </FormSection>
            
            <div className="flex justify-end mt-6">
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
        )}
        
        {currentStep === 2 && (
          <>
            <QuantitativeDataSection 
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              calculateTotal={calculateTotal}
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
              
              <SubmitButton 
                isLoading={isLoading} 
                isDisabled={isLoading} 
                animationDelay={650}
              />
            </div>
          </>
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
