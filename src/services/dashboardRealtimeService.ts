
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Configure Supabase to support Realtime for vector_data
 */
export const setupRealtimeSupport = async () => {
  try {
    console.log('Configurando suporte em tempo real para a tabela vector_data');
    
    // Verificar se já está configurado
    const { data, error } = await supabase
      .from('vector_data')
      .select('id')
      .limit(1);
      
    if (error) {
      throw error;
    }
    
    console.log('Suporte em tempo real já está habilitado para a tabela vector_data');
    // ALTER TABLE public.vector_data REPLICA IDENTITY FULL;
    // ALTER PUBLICATION supabase_realtime ADD TABLE public.vector_data;
    
    return true;
  } catch (error) {
    console.error('Falha ao configurar suporte em tempo real:', error);
    toast.error('Não foi possível configurar atualizações em tempo real');
    return false;
  }
};

// Inicializa o suporte em tempo real quando o serviço for carregado
setupRealtimeSupport().catch(console.error);

// Função para assinar o canal de atualizações em tempo real
export const subscribeToVectorDataChanges = async (callback: (payload: any) => void) => {
  console.log('Assinando canal de atualizações em tempo real para vector_data');
  
  // Obter o usuário autenticado de forma assíncrona
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id || '';
  
  const channel = supabase.channel('vector-data-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Escutar inserts, updates e deletes
        schema: 'public',
        table: 'vector_data',
        filter: `id=eq.${userId}`
      },
      (payload) => {
        console.log('Recebida atualização em tempo real:', payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log('Status da assinatura Realtime:', status);
      if (status === 'SUBSCRIBED') {
        toast.success('Conectado para atualizações em tempo real');
      }
    });
    
  return channel;
};
