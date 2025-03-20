
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
    
    // Limpar qualquer assinatura anterior
    if (channel) {
      console.log('Cancelando assinatura anterior');
      channel.unsubscribe();
    }
    
    let isMounted = true;
    
    // Função assíncrona para configurar o canal
    const setupChannel = async () => {
      try {
        // Criar canal de tempo real
        const realtimeChannel = await subscribeToVectorDataChanges((payload) => {
          console.log('Recebida atualização em tempo real (hook):', payload);
          
          if (payload && payload.new) {
            console.log('Novos dados recebidos:', payload.new);
            
            // Garantir que os dados sejam passados corretamente
            handleUpdate(payload);
            
            // Notificar o usuário sobre a atualização
            if (payload.eventType === 'UPDATE') {
              toast.success(`Dados de ${payload.new.localities?.name || 'localidade'} atualizados`);
            } else if (payload.eventType === 'INSERT') {
              toast.success(`Novos dados de ${payload.new.localities?.name || 'localidade'} adicionados`);
            }
          }
        });
        
        // Verificar se o componente ainda está montado antes de atualizar o estado
        if (isMounted) {
          setChannel(realtimeChannel);
          setIsSubscribed(true);
        }
      } catch (error) {
        console.error('Erro ao configurar canal de tempo real:', error);
        toast.error('Falha ao conectar para atualizações em tempo real');
      }
    };
    
    setupChannel();
    
    // Cleanup ao desmontar
    return () => {
      console.log('Limpando assinatura de tempo real');
      isMounted = false;
      if (channel) {
        channel.unsubscribe();
        setIsSubscribed(false);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { isSubscribed, channel };
};
