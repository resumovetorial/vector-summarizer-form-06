import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin } from 'lucide-react';
import FormField from './FormField';
import FormSection from './FormSection';
import DatePickerField from './DatePickerField';
import LocalitySelector from './formSteps/LocalitySelector';
import CycleSelector from './formSteps/CycleSelector';
import WorkModalitySelector from './formSteps/WorkModalitySelector';
import EpidemiologicalWeekSelector from './formSteps/EpidemiologicalWeekSelector';
import { FormData, ValidationErrors } from '@/types/vectorForm';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

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
          <Select
            value={formData.municipality}
            onValueChange={(value) => handleInputChange('municipality', value)}
          >
            <SelectTrigger className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione o município" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Itabuna">Itabuna</SelectItem>
              {/* We can add more municipalities here in the future */}
            </SelectContent>
          </Select>
        </FormField>
        
        <LocalitySelector
          value={formData.locality}
          onChange={(value) => handleInputChange('locality', value)}
          error={errors.locality}
        />
      </FormSection>
      
      <FormSection>
        <WorkModalitySelector
          value={formData.workModality}
          onChange={(value) => handleInputChange('workModality', value)}
          error={errors.workModality}
          animationDelay={150}
        />
        
        <CycleSelector
          value={formData.cycle}
          onChange={(value) => handleInputChange('cycle', value)}
          error={errors.cycle}
          animationDelay={200}
          workModality={formData.workModality} // Pass the workModality to CycleSelector
        />
      </FormSection>
      
      <FormSection>
        <EpidemiologicalWeekSelector
          value={formData.epidemiologicalWeek}
          onChange={(value) => handleInputChange('epidemiologicalWeek', value)}
          error={errors.epidemiologicalWeek}
          animationDelay={225}
        />
        
        <DatePickerField
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
        <DatePickerField
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
