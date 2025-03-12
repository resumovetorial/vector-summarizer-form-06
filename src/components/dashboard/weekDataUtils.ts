
import { LocalityData, WeekSummary } from '@/types/dashboard';

/**
 * Groups locality data by epidemiological week
 */
export const groupDataByWeek = (data: LocalityData[]): Record<string, WeekSummary> => {
  const groupedByWeek: Record<string, WeekSummary> = {};
  
  data.forEach(entry => {
    if (!groupedByWeek[entry.epidemiologicalWeek]) {
      groupedByWeek[entry.epidemiologicalWeek] = {
        week: entry.epidemiologicalWeek,
        totalProperties: 0,
        totalInspections: 0,
        totalDepositsEliminated: 0,
        totalDepositsTreated: 0,
        localities: []
      };
    }
    
    groupedByWeek[entry.epidemiologicalWeek].totalProperties += Number(entry.totalProperties);
    groupedByWeek[entry.epidemiologicalWeek].totalInspections += Number(entry.inspections);
    groupedByWeek[entry.epidemiologicalWeek].totalDepositsEliminated += Number(entry.depositsEliminated);
    groupedByWeek[entry.epidemiologicalWeek].totalDepositsTreated += Number(entry.depositsTreated);
    groupedByWeek[entry.epidemiologicalWeek].localities.push(entry);
  });
  
  return groupedByWeek;
};

/**
 * Converts grouped data to array and sorts by week
 */
export const getWeekSummaries = (groupedByWeek: Record<string, WeekSummary>): WeekSummary[] => {
  return Object.values(groupedByWeek).sort((a, b) => 
    parseInt(a.week) - parseInt(b.week)
  );
};
