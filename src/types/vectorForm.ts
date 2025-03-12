
import { Dispatch, SetStateAction } from 'react';

export interface FormData {
  municipality: string;
  locality: string;
  cycle: string;
  epidemiologicalWeek: string;
  workModality: string; // New field for work modality
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
  // New fields for deposits
  a1: string;
  a2: string;
  b: string;
  c: string;
  d1: string;
  d2: string;
  e: string;
  depositos_eliminados: string;
  // New fields for treated deposits
  larvicida: string;
  quantidade_larvicida: string;
  quantidade_depositos_tratados: string;
  adulticida: string;
  quantidade_cargas: string;
  total_tec_saude: string;
  total_dias_trabalhados: string;
  nome_supervisor: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface VectorFormState {
  formData: FormData;
  errors: ValidationErrors;
  isLoading: boolean;
  showResults: boolean;
  vectorData: any;
  summary: string;
  currentStep: number;
}

export interface VectorFormActions {
  setFormData: Dispatch<SetStateAction<FormData>>;
  setErrors: Dispatch<SetStateAction<ValidationErrors>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setShowResults: Dispatch<SetStateAction<boolean>>;
  setVectorData: Dispatch<SetStateAction<any>>;
  setSummary: Dispatch<SetStateAction<string>>;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}
