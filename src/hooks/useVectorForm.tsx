import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface FormData {
  municipality: string;
  locality: string;
  cycle: string;
  epidemiologicalWeek: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
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
}

interface ValidationErrors {
  [key: string]: string;
}

export const useVectorForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [vectorData, setVectorData] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<FormData>({
    municipality: '',
    locality: '',
    cycle: '',
    epidemiologicalWeek: '',
    startDate: undefined,
    endDate: undefined,
    qt_residencias: '',
    qt_comercio: '',
    qt_terreno_baldio: '',
    qt_pe: '',
    qt_outros: '',
    qt_total: '',
    tratamento_focal: '',
    tratamento_perifocal: '',
    inspecionados: '',
    amostras_coletadas: '',
    recusa: '',
    fechadas: '',
    recuperadas: ''
  });
  
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateTotal = () => {
    const qtResidencias = parseInt(formData.qt_residencias) || 0;
    const qtComercio = parseInt(formData.qt_comercio) || 0;
    const qtTerrenoBaldio = parseInt(formData.qt_terreno_baldio) || 0;
    const qtPe = parseInt(formData.qt_pe) || 0;
    const qtOutros = parseInt(formData.qt_outros) || 0;
    
    const total = qtResidencias + qtComercio + qtTerrenoBaldio + qtPe + qtOutros;
    
    setFormData(prev => ({ ...prev, qt_total: total.toString() }));
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
    }
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (step === 1) {
      if (!formData.municipality.trim()) {
        newErrors.municipality = 'Município é obrigatório';
      }
      
      if (!formData.locality.trim()) {
        newErrors.locality = 'Localidade é obrigatória';
      }
      
      if (!formData.cycle.trim()) {
        newErrors.cycle = 'Ciclo é obrigatório';
      }
      
      if (!formData.epidemiologicalWeek.trim()) {
        newErrors.epidemiologicalWeek = 'Semana Epidemiológica é obrigatória';
      }
      
      if (!formData.startDate) {
        newErrors.startDate = 'Data Inicial é obrigatória';
      }
      
      if (!formData.endDate) {
        newErrors.endDate = 'Data Final é obrigatória';
      }
    } else if (step === 2) {
      // Step 2 validation if needed
      // We can keep it simple for now
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.municipality.trim()) {
      newErrors.municipality = 'Município é obrigatório';
    }
    
    if (!formData.locality.trim()) {
      newErrors.locality = 'Localidade é obrigatória';
    }
    
    if (!formData.cycle.trim()) {
      newErrors.cycle = 'Ciclo é obrigatório';
    }
    
    if (!formData.epidemiologicalWeek.trim()) {
      newErrors.epidemiologicalWeek = 'Semana Epidemiológica é obrigatória';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Data Inicial é obrigatória';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Data Final é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate creating vector data - in a real app, this would be done by an API
      const mockVectorData = {
        municipality: formData.municipality,
        locality: formData.locality,
        cycle: formData.cycle,
        epidemiologicalWeek: formData.epidemiologicalWeek,
        startDate: formData.startDate,
        endDate: formData.endDate,
        quantitativeData: {
          residencias: formData.qt_residencias,
          comercio: formData.qt_comercio,
          terrenoBaldio: formData.qt_terreno_baldio,
          pe: formData.qt_pe,
          outros: formData.qt_outros,
          total: formData.qt_total,
          tratamento_focal: formData.tratamento_focal,
          tratamento_perifocal: formData.tratamento_perifocal,
          inspecionados: formData.inspecionados,
          amostras_coletadas: formData.amostras_coletadas,
          recusa: formData.recusa,
          fechadas: formData.fechadas,
          recuperadas: formData.recuperadas
        }
      };
      
      // Simulate summary - in a real app, this would be generated by an API
      const mockSummary = `Resumo para ${formData.municipality}, ${formData.locality}, durante o ciclo ${formData.cycle} (semana epidemiológica ${formData.epidemiologicalWeek}). Período: ${formData.startDate ? format(formData.startDate, 'PP') : 'N/A'} a ${formData.endDate ? format(formData.endDate, 'PP') : 'N/A'}. Total de imóveis: ${formData.qt_total}.`;
      
      setVectorData(mockVectorData);
      setSummary(mockSummary);
      setShowResults(true);
      
      toast({
        title: "Processamento Concluído",
        description: "A sumarização foi gerada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
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
  };
};
