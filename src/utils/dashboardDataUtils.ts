
import { LocalityData, CycleSummary } from '@/types/dashboard';

/**
 * Groups locality data by cycle and modality
 */
export const prepareCycleSummaries = (data: LocalityData[]): CycleSummary[] => {
  // Group data by cycle and modality
  const groupedByCycleAndModality: Record<string, CycleSummary> = {};
  
  data.forEach(entry => {
    const key = `${entry.workModality}-${entry.cycle}`;
    if (!groupedByCycleAndModality[key]) {
      groupedByCycleAndModality[key] = {
        workModality: entry.workModality,
        cycle: entry.cycle,
        totalProperties: 0,
        totalInspections: 0,
        totalDepositsEliminated: 0,
        totalDepositsTreated: 0,
        localities: []
      };
    }
    
    groupedByCycleAndModality[key].totalProperties += Number(entry.totalProperties);
    groupedByCycleAndModality[key].totalInspections += Number(entry.inspections);
    groupedByCycleAndModality[key].totalDepositsEliminated += Number(entry.depositsEliminated);
    groupedByCycleAndModality[key].totalDepositsTreated += Number(entry.depositsTreated);
    groupedByCycleAndModality[key].localities.push(entry);
  });
  
  // Convert grouped data to array and sort
  return Object.values(groupedByCycleAndModality).sort((a, b) => {
    if (a.workModality !== b.workModality) {
      return a.workModality.localeCompare(b.workModality);
    }
    return parseInt(a.cycle) - parseInt(b.cycle);
  });
};

/**
 * Gets unique modalities from cycle summaries
 */
export const getUniqueModalities = (cycleSummaries: CycleSummary[]): string[] => {
  return [...new Set(cycleSummaries.map(item => item.workModality))];
};
