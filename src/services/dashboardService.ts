
import { LocalityData } from "@/types/dashboard";
import { fetchDashboardData } from "./dashboardDataFetcher";
import { filterDataByLocality, filterDataByYear } from "./dashboardFilterService";
import { mockDashboardData } from "./mockDashboardData";
import { setupRealtimeSupport } from "./dashboardRealtimeService";

// Re-export all the functionality
export {
  fetchDashboardData,
  filterDataByLocality,
  filterDataByYear,
  mockDashboardData,
  setupRealtimeSupport
};
