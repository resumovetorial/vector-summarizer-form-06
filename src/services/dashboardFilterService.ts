
import { LocalityData } from "@/types/dashboard";

/**
 * Filters dashboard data by year
 * @param data The data to filter
 * @param year The year to filter by
 * @returns Filtered data
 */
export const filterDataByYear = (data: LocalityData[], year: string): LocalityData[] => {
  return data.filter(item => item.startDate.startsWith(year));
};

/**
 * Filters dashboard data by locality
 * @param data The data to filter
 * @param locality The locality name to filter by
 * @returns Filtered data
 */
export const filterDataByLocality = (data: LocalityData[], locality: string): LocalityData[] => {
  return data
    .filter(item => item.locality === locality)
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
};
