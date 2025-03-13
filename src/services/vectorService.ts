
// Main entry point for vector services
// Re-exports functionality from the specialized modules

import { getSavedVectorData } from './vectorDataFetcher';
import { saveVectorData } from './vectorDataSaver';
import { processVectorData } from './vectorDataProcessor';
import { formatFormToVectorData, generateSummary } from './vector/vectorDataFormatter';
import { saveVectorDataToSupabase } from './vector/vectorDataSaveService';
import { findOrCreateLocality } from './localities/localityManager';
import { saveToLocalStorage } from './vector/vectorLocalStorage';
import { syncDataWithSupabase } from './vector/vectorDataSync';

export {
  getSavedVectorData,
  saveVectorData,
  processVectorData,
  formatFormToVectorData,
  generateSummary,
  saveVectorDataToSupabase,
  findOrCreateLocality,
  saveToLocalStorage,
  syncDataWithSupabase
};
