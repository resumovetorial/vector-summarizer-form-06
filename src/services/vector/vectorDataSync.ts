
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { findOrCreateLocality } from '../localities/localityManager';

/**
 * Attempts to synchronize vector data with Supabase
 * @param data Array of locality data to synchronize
 * @returns True if at least one record was synced successfully
 */
export const syncDataWithSupabase = async (data: LocalityData[]): Promise<boolean> => {
  // Try to get the current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  let successCount = 0;
  
  for (const item of data) {
    try {
      // Try to get or create locality
      const localityId = await findOrCreateLocality(item.locality);
      
      if (!localityId) {
        console.error(`Falha ao processar localidade: ${item.locality}`);
        continue;
      }
      
      // Ensure dates are present
      if (!item.startDate || !item.endDate) {
        console.error("Data de início ou fim ausente para o item:", item);
        continue;
      }
      
      // Insert data to Supabase
      console.log("Inserindo dados para localidade:", item.locality, "com ID:", localityId);
      
      // Verificar se usuário está autenticado
      if (!user || !user.id) {
        console.warn("Usuário não autenticado, usando NULL para o supervisor");
      }
      
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
          supervisor: user?.id || null,
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
          created_by: user?.id || null
        }]);
        
      if (error) {
        console.error('Erro ao inserir dados no Supabase:', error);
      } else {
        console.log('Dados sincronizados com sucesso no Supabase para localidade:', item.locality);
        successCount++;
      }
    } catch (error) {
      console.error('Erro durante operação de sincronização com Supabase:', error);
    }
  }
  
  return successCount > 0;
};
