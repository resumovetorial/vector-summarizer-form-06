
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LocalityData } from '@/types/dashboard';

export const useRealtimeUpdates = (
  callback: (payload?: any) => void,
  dependencies: any[] = []
) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    console.log("Configurando assinatura Realtime para a tabela vector_data");
    
    // Enable realtime for the vector_data table
    const enableRealtime = async () => {
      try {
        // First check if the table has realtime enabled
        const { error } = await supabase.rpc('supabase_realtime.enable_publication_for_table', {
          table_name: 'vector_data'
        });
        
        if (error) {
          console.error("Erro ao ativar realtime para a tabela vector_data:", error);
          return;
        }
        
        console.log("Realtime support is enabled for vector_data table via SQL configurations");
      } catch (err) {
        console.error("Erro ao configurar realtime:", err);
      }
    };
    
    enableRealtime();
    
    // Inscrever-se para mudanças na tabela vector_data
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vector_data'
        },
        (payload) => {
          console.log('Mudança recebida!', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log("Status da assinatura Realtime:", status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });
    
    // Função de limpeza
    return () => {
      console.log("Limpando assinatura realtime");
      setIsSubscribed(false);
      supabase.removeChannel(channel);
    };
  }, dependencies);

  return { isSubscribed };
};

export default useRealtimeUpdates;
