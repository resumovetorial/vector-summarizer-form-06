
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import FormField from './FormField';
import FormSection from './FormSection';

interface QuantitativeDataSectionProps {
  formData: {
    qt_residencias: string;
    qt_comercio: string;
    qt_terreno_baldio: string;
    qt_pe: string;
    qt_outros: string;
    qt_total: string;
    tratamento_focal: string;
    tratamento_perifocal: string;
    inspecionados: string;
    amostras_coletadas: string;
    recusa: string;
    fechadas: string;
    recuperadas: string;
    workModality: string; // Add workModality to the formData interface
  };
  handleInputChange: (field: string, value: any) => void;
  errors: {[key: string]: string};
  calculateTotal: () => void;
}

const QuantitativeDataSection: React.FC<QuantitativeDataSectionProps> = ({
  formData,
  handleInputChange,
  errors,
  calculateTotal
}) => {
  
  useEffect(() => {
    calculateTotal();
  }, [
    formData.qt_residencias,
    formData.qt_comercio,
    formData.qt_terreno_baldio,
    formData.qt_pe,
    formData.qt_outros
  ]);

  // Check if PE field should be active
  const isPEFieldActive = formData.workModality === "PE";
  
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">Dados Quantitativos</h2>
      
      <FormSection>
        <FormField
          id="qt_residencias"
          label="Residências"
          error={errors.qt_residencias}
          animationDelay={50}
        >
          <Input
            id="qt_residencias"
            type="number"
            min="0"
            value={formData.qt_residencias}
            onChange={(e) => handleInputChange('qt_residencias', e.target.value)}
            placeholder="Quantidade de residências"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="qt_comercio"
          label="Comércio"
          error={errors.qt_comercio}
          animationDelay={100}
        >
          <Input
            id="qt_comercio"
            type="number"
            min="0"
            value={formData.qt_comercio}
            onChange={(e) => handleInputChange('qt_comercio', e.target.value)}
            placeholder="Quantidade de comércios"
            className="w-full"
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="qt_terreno_baldio"
          label="Terreno Baldio"
          error={errors.qt_terreno_baldio}
          animationDelay={150}
        >
          <Input
            id="qt_terreno_baldio"
            type="number"
            min="0"
            value={formData.qt_terreno_baldio}
            onChange={(e) => handleInputChange('qt_terreno_baldio', e.target.value)}
            placeholder="Quantidade de terrenos baldios"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="qt_pe"
          label="PE"
          error={errors.qt_pe}
          animationDelay={200}
        >
          <Input
            id="qt_pe"
            type="number"
            min="0"
            value={formData.qt_pe}
            onChange={(e) => handleInputChange('qt_pe', e.target.value)}
            placeholder="Quantidade de PE"
            disabled={!isPEFieldActive}
            className={`w-full ${!isPEFieldActive ? 'bg-gray-100' : ''}`}
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="qt_outros"
          label="Outros"
          error={errors.qt_outros}
          animationDelay={250}
        >
          <Input
            id="qt_outros"
            type="number"
            min="0"
            value={formData.qt_outros}
            onChange={(e) => handleInputChange('qt_outros', e.target.value)}
            placeholder="Quantidade de outros"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="qt_total"
          label="Total"
          error={errors.qt_total}
          animationDelay={300}
        >
          <Input
            id="qt_total"
            type="number"
            value={formData.qt_total}
            readOnly
            className="w-full bg-gray-100"
          />
        </FormField>
      </FormSection>
    </>
  );
};

export default QuantitativeDataSection;
