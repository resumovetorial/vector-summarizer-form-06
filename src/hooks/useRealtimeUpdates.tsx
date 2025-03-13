
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LocalityData } from '@/types/dashboard';
import { toast } from 'sonner';

export function useRealtimeUpdates(callback: (data: LocalityData) => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Configure Supabase Realtime channel
    const channel = supabase
      .channel('vector-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (insert, update, delete)
          schema: 'public',
          table: 'vector_data'
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          
          // Convert payload data to LocalityData format
          if (payload.new) {
            const newData: LocalityData = {
              municipality: payload.new.municipality,
              locality: payload.new.locality_id,
              cycle: payload.new.cycle,
              epidemiologicalWeek: payload.new.epidemiological_week,
              workModality: payload.new.work_modality,
              startDate: payload.new.start_date,
              endDate: payload.new.end_date,
              totalProperties: payload.new.total_properties,
              inspections: payload.new.inspections,
              depositsEliminated: payload.new.deposits_eliminated,
              depositsTreated: payload.new.deposits_treated,
              supervisor: payload.new.supervisor,
              qt_residencias: payload.new.qt_residencias,
              qt_comercio: payload.new.qt_comercio,
              qt_terreno_baldio: payload.new.qt_terreno_baldio,
              qt_pe: payload.new.qt_pe,
              qt_outros: payload.new.qt_outros,
              qt_total: payload.new.qt_total,
              tratamento_focal: payload.new.tratamento_focal,
              tratamento_perifocal: payload.new.tratamento_perifocal,
              amostras_coletadas: payload.new.amostras_coletadas,
              recusa: payload.new.recusa,
              fechadas: payload.new.fechadas,
              recuperadas: payload.new.recuperadas,
              a1: payload.new.a1,
              a2: payload.new.a2,
              b: payload.new.b,
              c: payload.new.c,
              d1: payload.new.d1,
              d2: payload.new.d2,
              e: payload.new.e,
              larvicida: payload.new.larvicida,
              quantidade_larvicida: payload.new.quantidade_larvicida,
              quantidade_depositos_tratados: payload.new.quantidade_depositos_tratados,
              adulticida: payload.new.adulticida,
              quantidade_cargas: payload.new.quantidade_cargas,
              total_tec_saude: payload.new.total_tec_saude,
              total_dias_trabalhados: payload.new.total_dias_trabalhados
            };
            
            // Call callback with the new data
            callback(newData);
            
            // Notify user
            if (payload.eventType === 'INSERT') {
              toast.info('Novos dados recebidos e atualizados!');
            } else if (payload.eventType === 'UPDATE') {
              toast.info('Dados atualizados recebidos!');
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
          toast.success('Conectado para atualizações em tempo real');
        }
      });

    // Cleanup subscription when component unmounts
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [callback]);

  return { isSubscribed };
}
