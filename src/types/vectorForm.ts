
// Vector form data types

// Form data structure
export interface FormData {
  municipality: string;
  locality: string;
  cycle: string;
  epidemiologicalWeek: string;
  workModality: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  // Quantitative data
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
  // Deposits inspection
  a1: string;
  a2: string;
  b: string;
  c: string;
  d1: string;
  d2: string;
  e: string;
  depositos_eliminados: string;
  // Treated deposits
  larvicida: string;
  quantidade_larvicida: string;
  quantidade_depositos_tratados: string;
  adulticida: string;
  quantidade_cargas: string;
  total_tec_saude: string;
  total_dias_trabalhados: string;
  nome_supervisor: string | null;
  recordId?: string; // ID for editing existing records
}

// Validation errors type
export interface ValidationErrors {
  [key: string]: string | undefined;
}
