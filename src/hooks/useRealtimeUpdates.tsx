
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
    
    // Since the table is already configured for realtime in Supabase (as indicated by the SQL error),
    // we don't need to try enabling it again. The publication is already active.
    
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
