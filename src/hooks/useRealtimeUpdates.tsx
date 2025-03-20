
import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { subscribeToVectorDataChanges } from '@/services/dashboardRealtimeService';

export const useRealtimeUpdates = (
  handleUpdate: (payload: any) => void,
  dependencies: any[] = []
) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    console.log('Configurando assinatura de tempo real');
    
    // Criar canal de tempo real
    const realtimeChannel = subscribeToVectorDataChanges((payload) => {
      console.log('Recebida atualização em tempo real (hook):', payload);
      handleUpdate(payload);
    });
    
    setChannel(realtimeChannel);
    setIsSubscribed(true);
    
    // Cleanup ao desmontar
    return () => {
      console.log('Limpando assinatura de tempo real');
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
        setIsSubscribed(false);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { isSubscribed, channel };
};
