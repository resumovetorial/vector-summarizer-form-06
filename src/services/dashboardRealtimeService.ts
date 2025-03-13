
import { supabase } from '@/integrations/supabase/client';

/**
 * Configure Supabase to support Realtime for vector_data
 */
export const setupRealtimeSupport = async () => {
  try {
    console.log('Realtime support is enabled for vector_data table via SQL configurations');
    // Note: We've already enabled Realtime for vector_data using SQL commands
    // ALTER TABLE public.vector_data REPLICA IDENTITY FULL;
    // ALTER PUBLICATION supabase_realtime ADD TABLE public.vector_data;
  } catch (error) {
    console.error('Failed to setup realtime support:', error);
  }
};

// Try to configure Realtime support
setupRealtimeSupport().catch(console.error);
