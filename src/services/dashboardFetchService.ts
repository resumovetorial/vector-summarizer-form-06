
// Re-export all functionality from specialized modules
import { fetchDashboardData } from './dashboardDataFetcher';
import { setupRealtimeSupport } from './dashboardRealtimeService';

export {
  fetchDashboardData,
  setupRealtimeSupport
};
