
import React from 'react';
import { Input } from '@/components/ui/input';
import FormField from './FormField';
import FormSection from './FormSection';

interface DepositsInspectionSectionProps {
  formData: {
    a1: string;
    a2: string;
    b: string;
    c: string;
    d1: string;
    d2: string;
    e: string;
    depositos_eliminados: string;
  };
  handleInputChange: (field: string, value: any) => void;
  errors: {[key: string]: string};
}

const DepositsInspectionSection: React.FC<DepositsInspectionSectionProps> = ({
  formData,
  handleInputChange,
  errors
}) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">Depósitos Inspecionados</h2>
      
      <FormSection>
        <FormField
          id="a1"
          label="A1"
          error={errors.a1}
          animationDelay={50}
        >
          <Input
            id="a1"
            type="number"
            min="0"
            value={formData.a1}
            onChange={(e) => handleInputChange('a1', e.target.value)}
            placeholder="Depósitos A1"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="a2"
          label="A2"
          error={errors.a2}
          animationDelay={100}
        >
          <Input
            id="a2"
            type="number"
            min="0"
            value={formData.a2}
            onChange={(e) => handleInputChange('a2', e.target.value)}
            placeholder="Depósitos A2"
            className="w-full"
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="b"
          label="B"
          error={errors.b}
          animationDelay={150}
        >
          <Input
            id="b"
            type="number"
            min="0"
            value={formData.b}
            onChange={(e) => handleInputChange('b', e.target.value)}
            placeholder="Depósitos B"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="c"
          label="C"
          error={errors.c}
          animationDelay={200}
        >
          <Input
            id="c"
            type="number"
            min="0"
            value={formData.c}
            onChange={(e) => handleInputChange('c', e.target.value)}
            placeholder="Depósitos C"
            className="w-full"
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="d1"
          label="D1"
          error={errors.d1}
          animationDelay={250}
        >
          <Input
            id="d1"
            type="number"
            min="0"
            value={formData.d1}
            onChange={(e) => handleInputChange('d1', e.target.value)}
            placeholder="Depósitos D1"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="d2"
          label="D2"
          error={errors.d2}
          animationDelay={300}
        >
          <Input
            id="d2"
            type="number"
            min="0"
            value={formData.d2}
            onChange={(e) => handleInputChange('d2', e.target.value)}
            placeholder="Depósitos D2"
            className="w-full"
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="e"
          label="E"
          error={errors.e}
          animationDelay={350}
        >
          <Input
            id="e"
            type="number"
            min="0"
            value={formData.e}
            onChange={(e) => handleInputChange('e', e.target.value)}
            placeholder="Depósitos E"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="depositos_eliminados"
          label="Depósitos Eliminados"
          error={errors.depositos_eliminados}
          animationDelay={400}
        >
          <Input
            id="depositos_eliminados"
            type="number"
            min="0"
            value={formData.depositos_eliminados}
            onChange={(e) => handleInputChange('depositos_eliminados', e.target.value)}
            placeholder="Total de depósitos eliminados"
            className="w-full"
          />
        </FormField>
      </FormSection>
    </>
  );
};

export default DepositsInspectionSection;
