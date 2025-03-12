
import { LocalityData } from "@/types/dashboard";
import { getSavedVectorData } from "./vectorService";
import { mockDashboardData } from "./mockDashboardData";
import { filterDataByYear } from "./dashboardFilterService";

/**
 * Fetches dashboard data from local storage or falls back to mock data
 * @param year The year to filter data by (defaults to current year)
 * @returns Promise resolving to filtered dashboard data
 */
export const fetchDashboardData = async (year: string = "2024"): Promise<LocalityData[]> => {
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get data from localStorage first
  const savedData = getSavedVectorData();
  console.log("Fetched saved data:", savedData);
  
  // If there's saved data, use it
  if (savedData && savedData.length > 0) {
    console.log("Using saved data:", savedData);
    // Filter by year
    return filterDataByYear(savedData, year);
  }
  
  // If no saved data is available, use mock data
  console.log("Using mock data");
  return filterDataByYear(mockDashboardData, year);
};
