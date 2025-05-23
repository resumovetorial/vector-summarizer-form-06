
import { FormData, ValidationErrors } from "@/types/vectorForm";

export const validateStep = (step: number, formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (step === 1) {
    if (!formData.municipality.trim()) {
      errors.municipality = 'Município é obrigatório';
    }
    
    if (!formData.locality.trim()) {
      errors.locality = 'Localidade é obrigatória';
    }
    
    if (!formData.cycle.trim()) {
      errors.cycle = 'Ciclo é obrigatório';
    }
    
    if (!formData.epidemiologicalWeek.trim()) {
      errors.epidemiologicalWeek = 'Semana Epidemiológica é obrigatória';
    }
    
    if (!formData.workModality) {
      errors.workModality = 'Tipo de Modalidade de Trabalho é obrigatório';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Data Inicial é obrigatória';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'Data Final é obrigatória';
    }
  } else if (step === 2) {
    // Step 2 validation if needed
    // Currently no validations for step 2
  }
  
  return errors;
};

// Adicionar as funções específicas que estão sendo importadas
export const validateFormStep1 = (formData: FormData): ValidationErrors => {
  return validateStep(1, formData);
};

export const validateFormStep2 = (formData: FormData): ValidationErrors => {
  return validateStep(2, formData);
};

export const validateForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!formData.municipality.trim()) {
    errors.municipality = 'Município é obrigatório';
  }
  
  if (!formData.locality.trim()) {
    errors.locality = 'Localidade é obrigatória';
  }
  
  if (!formData.cycle.trim()) {
    errors.cycle = 'Ciclo é obrigatório';
  }
  
  if (!formData.epidemiologicalWeek.trim()) {
    errors.epidemiologicalWeek = 'Semana Epidemiológica é obrigatória';
  }
  
  if (!formData.workModality) {
    errors.workModality = 'Tipo de Modalidade de Trabalho é obrigatório';
  }
  
  if (!formData.startDate) {
    errors.startDate = 'Data Inicial é obrigatória';
  }
  
  if (!formData.endDate) {
    errors.endDate = 'Data Final é obrigatória';
  }
  
  return errors;
};
