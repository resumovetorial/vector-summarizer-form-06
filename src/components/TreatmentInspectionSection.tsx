
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import FormField from './FormField';
import FormSection from './FormSection';

interface TreatmentInspectionSectionProps {
  formData: {
    qt_total: string;
    tratamento_focal: string;
    tratamento_perifocal: string;
    inspecionados: string;
    amostras_coletadas: string;
    recusa: string;
    fechadas: string;
    recuperadas: string;
  };
  handleInputChange: (field: string, value: any) => void;
  errors: {[key: string]: string};
}

const TreatmentInspectionSection: React.FC<TreatmentInspectionSectionProps> = ({
  formData,
  handleInputChange,
  errors
}) => {
  const [informados, setInformados] = useState<string>('0');

  // Calculate Informados when relevant values change
  useEffect(() => {
    const total = parseInt(formData.qt_total) || 0;
    const fechadas = parseInt(formData.fechadas) || 0;
    const recuperadas = parseInt(formData.recuperadas) || 0;
    
    const calculatedInformados = total + fechadas - recuperadas;
    setInformados(calculatedInformados.toString());
  }, [formData.qt_total, formData.fechadas, formData.recuperadas]);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 mt-8 text-center">Tratamentos e Inspeções</h2>
      
      <FormSection>
        <FormField
          id="tratamento_focal"
          label="Tratamento Focal"
          error={errors.tratamento_focal}
          animationDelay={350}
        >
          <Input
            id="tratamento_focal"
            type="number"
            min="0"
            value={formData.tratamento_focal}
            onChange={(e) => handleInputChange('tratamento_focal', e.target.value)}
            placeholder="Quantidade de tratamentos focais"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="tratamento_perifocal"
          label="Tratamento Perifocal"
          error={errors.tratamento_perifocal}
          animationDelay={400}
        >
          <Input
            id="tratamento_perifocal"
            type="number"
            min="0"
            value={formData.tratamento_perifocal}
            onChange={(e) => handleInputChange('tratamento_perifocal', e.target.value)}
            placeholder="Quantidade de tratamentos perifocais"
            className="w-full"
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="inspecionados"
          label="Inspecionados"
          error={errors.inspecionados}
          animationDelay={450}
        >
          <Input
            id="inspecionados"
            type="number"
            min="0"
            value={formData.inspecionados}
            onChange={(e) => handleInputChange('inspecionados', e.target.value)}
            placeholder="Quantidade de imóveis inspecionados"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="amostras_coletadas"
          label="Amostras Coletadas"
          error={errors.amostras_coletadas}
          animationDelay={500}
        >
          <Input
            id="amostras_coletadas"
            type="number"
            min="0"
            value={formData.amostras_coletadas}
            onChange={(e) => handleInputChange('amostras_coletadas', e.target.value)}
            placeholder="Quantidade de amostras coletadas"
            className="w-full"
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="recusa"
          label="Recusa"
          error={errors.recusa}
          animationDelay={550}
        >
          <Input
            id="recusa"
            type="number"
            min="0"
            value={formData.recusa}
            onChange={(e) => handleInputChange('recusa', e.target.value)}
            placeholder="Quantidade de recusas"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="fechadas"
          label="Fechadas"
          error={errors.fechadas}
          animationDelay={600}
        >
          <Input
            id="fechadas"
            type="number"
            min="0"
            value={formData.fechadas}
            onChange={(e) => handleInputChange('fechadas', e.target.value)}
            placeholder="Quantidade de unidades fechadas"
            className="w-full"
          />
        </FormField>
      </FormSection>
      
      <FormSection>
        <FormField
          id="recuperadas"
          label="Recuperadas"
          error={errors.recuperadas}
          animationDelay={650}
        >
          <Input
            id="recuperadas"
            type="number"
            min="0"
            value={formData.recuperadas}
            onChange={(e) => handleInputChange('recuperadas', e.target.value)}
            placeholder="Quantidade de unidades recuperadas"
            className="w-full"
          />
        </FormField>
        
        <FormField
          id="informados"
          label="Informados"
          animationDelay={700}
        >
          <Input
            id="informados"
            type="text"
            value={informados}
            readOnly
            className="w-full bg-gray-100"
          />
        </FormField>
      </FormSection>
    </>
  );
};

export default TreatmentInspectionSection;
