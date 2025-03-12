
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import FormField from './FormField';
import FormSection from './FormSection';
import DatePickerField from './DatePickerField';
import { ChevronRight, Briefcase } from 'lucide-react';
import { FormData, ValidationErrors } from '@/types/vectorForm';

interface GeneralInformationStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  errors: ValidationErrors;
  nextStep: () => void;
}

const GeneralInformationStep: React.FC<GeneralInformationStepProps> = ({
  formData,
  handleInputChange,
  errors,
  nextStep
}) => {
  return (
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
        <FormField
          id="workModality"
          label="Tipo de Modalidade de Trabalho"
          required
          error={errors.workModality}
          animationDelay={225}
        >
          <Select
            value={formData.workModality}
            onValueChange={(value) => handleInputChange('workModality', value)}
          >
            <SelectTrigger className="w-full">
              <Briefcase className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione a modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LI">LI</SelectItem>
              <SelectItem value="LI + T">LI + T</SelectItem>
              <SelectItem value="PE">PE</SelectItem>
              <SelectItem value="TRATAMENTO">TRATAMENTO</SelectItem>
              <SelectItem value="DF">DF</SelectItem>
              <SelectItem value="PVE">PVE</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        
        <FormField
          id="startDate"
          label="Data Inicial"
          date={formData.startDate}
          onDateChange={(date) => handleInputChange('startDate', date)}
          required
          error={errors.startDate}
          animationDelay={250}
        />
      </FormSection>
      
      <FormSection>
        <FormField
          id="endDate"
          label="Data Final"
          date={formData.endDate}
          onDateChange={(date) => handleInputChange('endDate', date)}
          required
          error={errors.endDate}
          animationDelay={300}
        />
        
        <div className="mb-6"> {/* Empty div to balance the grid */}</div>
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
  );
};

export default GeneralInformationStep;
