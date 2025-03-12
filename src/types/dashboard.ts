
// Dashboard related types
export interface LocalityData {
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
