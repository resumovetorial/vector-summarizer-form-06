
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import FormField from './FormField';
import SubmitButton from './SubmitButton';
import ResultDisplay from './ResultDisplay';
import FormSection from './FormSection';
import DatePickerField from './DatePickerField';
import AlgorithmSettings from './AlgorithmSettings';
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
    summary
  } = useVectorForm();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 sm:p-8">
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
        
        <FormField
          id="title"
          label="Título do Documento"
          required
          error={errors.title}
          animationDelay={350}
        >
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Digite o título do documento"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="textContent"
          label="Conteúdo do Texto"
          required
          error={errors.textContent}
          description="Digite o texto que você deseja converter para formato vetorial e resumir"
          animationDelay={400}
        >
          <Textarea
            id="textContent"
            value={formData.textContent}
            onChange={(e) => handleInputChange('textContent', e.target.value)}
            placeholder="Cole ou digite seu conteúdo aqui..."
            className="w-full min-h-[150px]"
          />
        </FormField>
        
        <Separator className="my-6" />
        
        <AlgorithmSettings
          algorithm={formData.algorithm}
          onAlgorithmChange={(value) => handleInputChange('algorithm', value)}
          dimensions={formData.dimensions}
          onDimensionsChange={(value) => handleInputChange('dimensions', value)}
          normalization={formData.normalization}
          onNormalizationChange={(value) => handleInputChange('normalization', value)}
          weightFactor={formData.weightFactor}
          onWeightFactorChange={(value) => handleInputChange('weightFactor', value)}
        />
        
        <div className="flex justify-center sm:justify-end">
          <SubmitButton 
            isLoading={isLoading} 
            isDisabled={isLoading} 
            animationDelay={650}
          />
        </div>
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
