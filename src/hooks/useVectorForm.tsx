
import { useState } from 'react';
import { processVectorData } from '@/services/vectorDataProcessor';
import { FormData } from '@/types/vectorForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateFormStep1, validateFormStep2 } from '@/utils/formValidation';
import { calculateTotalProperties } from '@/utils/formCalculations';
import { toast } from 'sonner';

export const useVectorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.editMode || false;
  
  const initialFormData: FormData = {
    recordId: '',
    municipality: '',
    locality: '',
    cycle: '',
    epidemiologicalWeek: '',
    workModality: '',
    startDate: null,
    endDate: null,
    qt_residencias: '0',
    qt_comercio: '0',
    qt_terreno_baldio: '0',
    qt_pe: '0',
    qt_outros: '0',
    qt_total: '0',
    tratamento_focal: '0',
    tratamento_perifocal: '0',
    inspecionados: '0',
    amostras_coletadas: '0',
    recusa: '0',
    fechadas: '0',
    recuperadas: '0',
    a1: '0',
    a2: '0',
    b: '0',
    c: '0',
    d1: '0',
    d2: '0',
    e: '0',
    depositos_eliminados: '0',
    larvicida: '',
    quantidade_larvicida: '0',
    quantidade_depositos_tratados: '0',
    adulticida: '',
    quantidade_cargas: '0',
    total_tec_saude: '0',
    total_dias_trabalhados: '0',
    nome_supervisor: ''
  };
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [vectorData, setVectorData] = useState(null);
  const [summary, setSummary] = useState({});

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // If we're changing property counts, recalculate the total
      if (['qt_residencias', 'qt_comercio', 'qt_terreno_baldio', 'qt_pe', 'qt_outros'].includes(field)) {
        const total = calculateTotalProperties(newData);
        newData.qt_total = total.toString();
      }
      
      // Clear any error for this field when changed
      if (errors[field]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[field];
          return newErrors;
        });
      }
      
      return newData;
    });
  };

  const calculateTotal = () => {
    const total = calculateTotalProperties(formData);
    handleInputChange('qt_total', total.toString());
    return total;
  };
  
  const nextStep = () => {
    if (currentStep === 1) {
      // Validar campos do passo 1
      const stepErrors = validateFormStep1(formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    } else if (currentStep === 2) {
      // Validar campos do passo 2
      const stepErrors = validateFormStep2(formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      
      // Calcular total se não foi calculado
      calculateTotal();
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  
  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log("Enviando formulário com dados:", formData);
      
      // Garantir que o ID é preservado durante a edição
      if (editMode && formData.recordId) {
        console.log("Modo de edição ativo para o registro:", formData.recordId);
      }
      
      // Garantir que os valores numéricos são convertidos
      const preparedData = { ...formData };
      
      // Processar os dados do formulário
      const result = await processVectorData(preparedData);
      
      if (result) {
        setVectorData(result.vectorData);
        setSummary(result.summary);
        setShowResults(true);
        
        // Se estiver no modo de edição, redirecionar para o dashboard após salvar
        if (editMode) {
          // Exibir toast de sucesso
          toast.success('Dados atualizados com sucesso! Você será redirecionado em instantes...', {
            duration: 3000
          });
          
          // Atraso para garantir que o toast seja exibido antes do redirecionamento
          setTimeout(() => {
            navigate('/dashboard', { state: { refreshData: true } });
          }, 2000);
        }
      } else {
        toast.error('Falha ao processar os dados. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      setErrors({ form: 'Erro ao processar dados. Verifique os campos e tente novamente.' });
      toast.error('Erro ao processar dados. Verifique os campos e tente novamente.');
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
