
import { LocalityData } from "@/types/dashboard";
import { fetchDashboardData } from "./dashboardFetchService";
import { filterDataByLocality, filterDataByYear } from "./dashboardFilterService";
import { mockDashboardData } from "./mockDashboardData";

// Re-export all the functionality
export {
  fetchDashboardData,
  filterDataByLocality,
  filterDataByYear,
  mockDashboardData
};
