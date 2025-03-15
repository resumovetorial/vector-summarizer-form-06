
// Dashboard related types
export interface LocalityData {
  id?: string; // Add ID field for record identification
  municipality: string;
  locality: string;
  cycle: string;
  epidemiologicalWeek: string;
  workModality: string;
  startDate: string;
  endDate: string;
  totalProperties: number;
  inspections: number;
  depositsEliminated: number;
  depositsTreated: number;
  supervisor: string;
  // Additional fields from the form
  qt_residencias: number;
  qt_comercio: number;
  qt_terreno_baldio: number;
  qt_pe: number;
  qt_outros: number;
  qt_total: number;
  tratamento_focal: number;
  tratamento_perifocal: number;
  amostras_coletadas: number;
  recusa: number;
  fechadas: number;
  recuperadas: number;
  // Deposits details
  a1: number;
  a2: number;
  b: number;
  c: number;
  d1: number;
  d2: number;
  e: number;
  // Treatment details
  larvicida: string;
  quantidade_larvicida: number;
  quantidade_depositos_tratados: number;
  adulticida: string;
  quantidade_cargas: number;
  total_tec_saude: number;
  total_dias_trabalhados: number;
}

export interface WeekSummary {
  week: string;
  totalProperties: number;
  totalInspections: number;
  totalDepositsEliminated: number;
  totalDepositsTreated: number;
  localities: LocalityData[];
}

export interface CycleSummary {
  workModality: string;
  cycle: string;
  totalProperties: number;
  totalInspections: number;
  totalDepositsEliminated: number;
  totalDepositsTreated: number;
  localities: LocalityData[];
}
