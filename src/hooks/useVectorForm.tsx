
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormData, ValidationErrors } from '@/types/vectorForm';
import { calculateTotalQuantity } from '@/utils/formCalculations';
import { validateStep, validateForm } from '@/utils/formValidation';
import { processVectorData } from '@/services/vectorService';

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
    workModality: '', // Initialize the new field
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
    recuperadas: '',
    // Deposits fields
    a1: '',
    a2: '',
    b: '',
    c: '',
    d1: '',
    d2: '',
    e: '',
    depositos_eliminados: '',
    // New treated deposits fields
    larvicida: '',
    quantidade_larvicida: '',
    quantidade_depositos_tratados: '',
    adulticida: '',
    quantidade_cargas: '',
    total_tec_saude: '',
    total_dias_trabalhados: '',
    nome_supervisor: ''
  });
  
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateTotal = () => {
    const total = calculateTotalQuantity(formData);
    setFormData(prev => ({ ...prev, qt_total: total }));
  };
  
  const nextStep = () => {
    const newErrors = validateStep(currentStep, formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { mockVectorData, mockSummary } = await processVectorData(formData);
      
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
