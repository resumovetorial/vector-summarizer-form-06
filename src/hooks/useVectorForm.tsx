
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormData, ValidationErrors } from '@/types/vectorForm';
import { calculateTotalQuantity } from '@/utils/formCalculations';
import { validateStep, validateForm } from '@/utils/formValidation';
import { processVectorData } from '@/services/vectorDataProcessor';
import { toast } from "sonner";
import { useLocation } from 'react-router-dom';

export const useVectorForm = () => {
  const { toast: toastHook } = useToast();
  const location = useLocation();
  const editMode = location.state?.editMode;
  
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
    workModality: '',
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
    // Campos de depósitos
    a1: '',
    a2: '',
    b: '',
    c: '',
    d1: '',
    d2: '',
    e: '',
    depositos_eliminados: '',
    // Novos campos de depósitos tratados
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
    // Limpar erro quando o usuário digita
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
      toast.error("Por favor, corrija os erros no formulário");
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
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }
    
    setIsLoading(true);
    toast.info(editMode ? "Atualizando dados..." : "Processando dados...");
    
    try {
      console.log("Enviando dados do formulário:", formData);
      
      // Verificar se existe algum campo obrigatório vazio
      if (!formData.municipality || !formData.locality || !formData.cycle || 
          !formData.epidemiologicalWeek || !formData.workModality || 
          !formData.startDate || !formData.endDate) {
        throw new Error("Todos os campos obrigatórios devem ser preenchidos");
      }
      
      const result = await processVectorData(formData);
      
      console.log("Resultado do processamento:", result);
      setVectorData(result.vectorData);
      setSummary(result.summary);
      setShowResults(true);
      
      toast.success(editMode 
        ? "Os dados foram atualizados com sucesso" 
        : "A sumarização foi gerada com sucesso"
      );
    } catch (error: any) {
      console.error("Erro ao processar o formulário:", error);
      toast.error(`Ocorreu um erro ao processar sua solicitação: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    formData,
    setFormData,
    handleInputChange,
    errors,
    isLoading,
    handleSubmit,
    showResults,
    vectorData,
    summary,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    calculateTotal
  };
};
