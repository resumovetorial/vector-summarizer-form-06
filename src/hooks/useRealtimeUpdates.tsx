
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LocalityData } from '@/types/dashboard';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

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
          if (payload.new && typeof payload.new === 'object') {
            // Type assertion for payload.new as vector_data row type
            const vectorData = payload.new as Tables<'vector_data'>;
            
            const newData: LocalityData = {
              municipality: vectorData.municipality || '',
              locality: vectorData.locality_id || '',
              cycle: vectorData.cycle || '',
              epidemiologicalWeek: vectorData.epidemiological_week || '',
              workModality: vectorData.work_modality || '',
              startDate: vectorData.start_date || '',
              endDate: vectorData.end_date || '',
              totalProperties: vectorData.total_properties || 0,
              inspections: vectorData.inspections || 0,
              depositsEliminated: vectorData.deposits_eliminated || 0,
              depositsTreated: vectorData.deposits_treated || 0,
              supervisor: vectorData.supervisor || '',
              qt_residencias: vectorData.qt_residencias || 0,
              qt_comercio: vectorData.qt_comercio || 0,
              qt_terreno_baldio: vectorData.qt_terreno_baldio || 0,
              qt_pe: vectorData.qt_pe || 0,
              qt_outros: vectorData.qt_outros || 0,
              qt_total: vectorData.qt_total || 0,
              tratamento_focal: vectorData.tratamento_focal || 0,
              tratamento_perifocal: vectorData.tratamento_perifocal || 0,
              amostras_coletadas: vectorData.amostras_coletadas || 0,
              recusa: vectorData.recusa || 0,
              fechadas: vectorData.fechadas || 0,
              recuperadas: vectorData.recuperadas || 0,
              a1: vectorData.a1 || 0,
              a2: vectorData.a2 || 0,
              b: vectorData.b || 0,
              c: vectorData.c || 0,
              d1: vectorData.d1 || 0,
              d2: vectorData.d2 || 0,
              e: vectorData.e || 0,
              larvicida: vectorData.larvicida || '',
              quantidade_larvicida: vectorData.quantidade_larvicida || 0,
              quantidade_depositos_tratados: vectorData.quantidade_depositos_tratados || 0,
              adulticida: vectorData.adulticida || '',
              quantidade_cargas: vectorData.quantidade_cargas || 0,
              total_tec_saude: vectorData.total_tec_saude || 0,
              total_dias_trabalhados: vectorData.total_dias_trabalhados || 0
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
