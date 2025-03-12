
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
import { ChevronRight, Briefcase, MapPin, Calendar } from 'lucide-react';
import { FormData, ValidationErrors } from '@/types/vectorForm';

interface GeneralInformationStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  errors: ValidationErrors;
  nextStep: () => void;
}

const localities = [
  "Alemita",
  "Alto Maron", 
  "Antique",
  "Bananeira",
  "Banco Raso", 
  "California", 
  "Carlos Silva", 
  "Castalia", 
  "Centro",
  "Centro Comercial",
  "Conceicao",
  "Corbiniano Freire",
  "Daniel Gomes",
  "Fatima",
  "Fernando Gomes", 
  "Ferradas",
  "Fonseca", 
  "Goes Calmon", 
  "Horteiro",
  "Itamaraca",
  "Jacana",
  "Jardim Brasil",
  "Jardim Grapiuna",
  "Jardim Primavera",
  "Joao Soares",
  "Jorge Amado",
  "Lomanto",
  "Mangabinha",
  "Manoel Leão",
  "Maria Matos",
  "Maria Pinheiro",
  "Monte Cristo",
  "Mutuns",
  "N S das Gracas", 
  "Nova California",
  "Nova Esperança",
  "Nova Ferradas",
  "Nova Itabuna", 
  "Nova Fonseca", 
  "Novo Horizonte",
  "Novo S Caetano",
  "Parque Boa Vista",
  "Parque Verde",
  "Pedro Geronimo",
  "Pontalzinho",
  "Roca do Povo",
  "Santa Catarina",
  "Santa Clara",
  "Santa Ines",
  "Santo Antonio",
  "Sao Caetano",
  "Sao Judas",
  "Sao Lourenço",
  "Sao Pedro",
  "Sao Roque",
  "Sarinha",
  "Sinval Palmeira",
  "Taverolandia",
  "Urbis IV",
  "Vila Analia",
  "Vila Paloma",
  "Zildolandia",
  "Zizo"
];

const cycles = ["01", "02", "03", "04", "05", "06"];

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
          <Select
            value={formData.locality}
            onValueChange={(value) => handleInputChange('locality', value)}
          >
            <SelectTrigger className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione a localidade" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {localities.map((locality) => (
                <SelectItem key={locality} value={locality}>
                  {locality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select
            value={formData.cycle}
            onValueChange={(value) => handleInputChange('cycle', value)}
          >
            <SelectTrigger className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione o ciclo" />
            </SelectTrigger>
            <SelectContent>
              {cycles.map((cycle) => (
                <SelectItem key={cycle} value={cycle}>
                  {cycle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
