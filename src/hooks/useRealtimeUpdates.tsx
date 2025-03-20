
import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { subscribeToVectorDataChanges } from '@/services/dashboardRealtimeService';
import { toast } from 'sonner';

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
      
      if (payload && payload.new) {
        console.log('Novos dados recebidos:', payload.new);
        // Garantir que os dados sejam passados corretamente
        handleUpdate(payload);
        
        // Notificar o usuário sobre a atualização
        if (payload.eventType === 'UPDATE') {
          toast.success(`Dados de ${payload.new.localities?.name || 'localidade'} atualizados`);
        }
      }
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
