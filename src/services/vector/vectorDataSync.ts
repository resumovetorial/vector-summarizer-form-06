
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { findOrCreateLocality } from '../localities/localityManager';

/**
 * Attempts to synchronize vector data with Supabase
 * @param data Array of locality data to synchronize
 * @returns True if at least one record was synced successfully
 */
export const syncDataWithSupabase = async (data: LocalityData[]): Promise<boolean> => {
  // Use ID for demonstration - in production, would be the authenticated user's ID
  const userId = '00000000-0000-0000-0000-000000000000';
  let successCount = 0;
  
  for (const item of data) {
    try {
      // Try to get or create locality
      const localityId = await findOrCreateLocality(item.locality);
      
      if (!localityId) {
        console.error(`Failed to process locality: ${item.locality}`);
        continue;
      }
      
      // Ensure dates are present
      if (!item.startDate || !item.endDate) {
        console.error("Missing start or end date for item:", item);
        continue;
      }
      
      // Insert data to Supabase
      console.log("Inserting data for locality:", item.locality, "with ID:", localityId);
      
      const { error } = await supabase
        .from('vector_data')
        .insert([{
          municipality: item.municipality,
          locality_id: localityId,
          cycle: item.cycle,
          epidemiological_week: item.epidemiologicalWeek,
          work_modality: item.workModality,
          start_date: item.startDate,
          end_date: item.endDate,
          total_properties: item.totalProperties,
          inspections: item.inspections,
          deposits_eliminated: item.depositsEliminated,
          deposits_treated: item.depositsTreated,
          supervisor: userId,
          qt_residencias: item.qt_residencias,
          qt_comercio: item.qt_comercio,
          qt_terreno_baldio: item.qt_terreno_baldio,
          qt_pe: item.qt_pe,
          qt_outros: item.qt_outros,
          qt_total: item.qt_total,
          tratamento_focal: item.tratamento_focal,
          tratamento_perifocal: item.tratamento_perifocal,
          amostras_coletadas: item.amostras_coletadas,
          recusa: item.recusa,
          fechadas: item.fechadas,
          recuperadas: item.recuperadas,
          a1: item.a1,
          a2: item.a2,
          b: item.b,
          c: item.c,
          d1: item.d1,
          d2: item.d2,
          e: item.e,
          larvicida: item.larvicida,
          quantidade_larvicida: item.quantidade_larvicida,
          quantidade_depositos_tratados: item.quantidade_depositos_tratados,
          adulticida: item.adulticida,
          quantidade_cargas: item.quantidade_cargas,
          total_tec_saude: item.total_tec_saude,
          total_dias_trabalhados: item.total_dias_trabalhados,
          created_by: userId
        }]);
        
      if (error) {
        console.error('Error inserting data into Supabase:', error);
      } else {
        console.log('Data synchronized successfully with Supabase for locality:', item.locality);
        successCount++;
      }
    } catch (error) {
      console.error('Error during Supabase sync operation:', error);
    }
  }
  
  return successCount > 0;
};
