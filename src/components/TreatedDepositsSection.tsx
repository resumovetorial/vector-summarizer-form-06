
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import FormField from './FormField';
import FormSection from './FormSection';
import { Beaker, Shield, Bug, User, Calendar, Clock } from 'lucide-react';
import { FormData, ValidationErrors } from '@/types/vectorForm';

interface TreatedDepositsSectionProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  errors: ValidationErrors;
}

const TreatedDepositsSection: React.FC<TreatedDepositsSectionProps> = ({
  formData,
  handleInputChange,
  errors
}) => {
  // Check if PE field should be active
  const isPEFieldActive = formData.workModality === "PE";
  
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">Depósitos Tratados</h2>
      
      <FormSection>
        <FormField
          id="larvicida"
          label="Larvicida"
          error={errors.larvicida}
          animationDelay={50}
        >
          <Select
            value={formData.larvicida}
            onValueChange={(value) => handleInputChange('larvicida', value)}
          >
            <SelectTrigger className="w-full">
              <Beaker className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione o larvicida" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTI">BTI</SelectItem>
              <SelectItem value="ESPINOSADE DT">ESPINOSADE DT</SelectItem>
              <SelectItem value="PIRIPROXUFEN">PIRIPROXUFEN</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        
        <FormField
          id="quantidade_larvicida"
          label="Quantidade de Larvicida"
          error={errors.quantidade_larvicida}
          animationDelay={100}
        >
          <Input
            id="quantidade_larvicida"
            type="number"
            min="0"
            value={formData.quantidade_larvicida}
            onChange={(e) => handleInputChange('quantidade_larvicida', e.target.value)}
            placeholder="Informe a quantidade"
            className="w-full"
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="quantidade_depositos_tratados"
          label="Quantidade de Depósitos Tratados"
          error={errors.quantidade_depositos_tratados}
          animationDelay={150}
        >
          <Input
            id="quantidade_depositos_tratados"
            type="number"
            min="0"
            value={formData.quantidade_depositos_tratados}
            onChange={(e) => handleInputChange('quantidade_depositos_tratados', e.target.value)}
            placeholder="Informe a quantidade"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="adulticida"
          label="Adulticida"
          error={errors.adulticida}
          animationDelay={200}
        >
          <Select
            value={formData.adulticida}
            onValueChange={(value) => handleInputChange('adulticida', value)}
            disabled={!isPEFieldActive}
          >
            <SelectTrigger className={`w-full ${!isPEFieldActive ? 'bg-gray-100' : ''}`}>
              <Bug className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione o adulticida" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FLUDORA">FLUDORA</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="quantidade_cargas"
          label="Quantidade de Cargas"
          error={errors.quantidade_cargas}
          animationDelay={250}
        >
          <Input
            id="quantidade_cargas"
            type="number"
            min="0"
            value={formData.quantidade_cargas}
            onChange={(e) => handleInputChange('quantidade_cargas', e.target.value)}
            placeholder="Informe a quantidade"
            className={`w-full ${!isPEFieldActive ? 'bg-gray-100' : ''}`}
            disabled={!isPEFieldActive}
          />
        </FormField>
        
        <FormField
          id="total_tec_saude"
          label="Total de Tec. Saúde por Semana"
          error={errors.total_tec_saude}
          animationDelay={300}
        >
          <Input
            id="total_tec_saude"
            type="number"
            min="0"
            value={formData.total_tec_saude}
            onChange={(e) => handleInputChange('total_tec_saude', e.target.value)}
            placeholder="Informe o total"
            className="w-full"
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="total_dias_trabalhados"
          label="Total de Dias Trabalhados na Semana"
          error={errors.total_dias_trabalhados}
          animationDelay={350}
        >
          <Input
            id="total_dias_trabalhados"
            type="number"
            min="0"
            max="7"
            value={formData.total_dias_trabalhados}
            onChange={(e) => handleInputChange('total_dias_trabalhados', e.target.value)}
            placeholder="Informe o total"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="nome_supervisor"
          label="Nome do Supervisor"
          error={errors.nome_supervisor}
          animationDelay={400}
        >
          <Input
            id="nome_supervisor"
            type="text"
            value={formData.nome_supervisor}
            onChange={(e) => handleInputChange('nome_supervisor', e.target.value)}
            placeholder="Informe o nome do supervisor"
            className="w-full"
          />
        </FormField>
      </FormSection>
    </>
  );
};

export default TreatedDepositsSection;
