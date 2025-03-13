
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useRealtimeUpdates = (
  callback: () => void,
  dependencies: any[] = []
) => {
  useEffect(() => {
    console.log("Setting up Realtime subscription for vector_data table");
    
    // Enable realtime for this table
    const enableRealtimeForTable = async () => {
      try {
        // Add the table to the realtime publication
        await supabase.rpc('supabase_functions.enable_realtime', {
          table_name: 'vector_data'
        });
        console.log("Realtime support is enabled for vector_data table via SQL configurations");
      } catch (error) {
        console.error("Failed to enable realtime:", error);
      }
    };
    
    enableRealtimeForTable();
    
    // Subscribe to changes on the vector_data table
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
          console.log('Change received!', payload);
          callback();
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });
    
    // Cleanup function
    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, dependencies);
};

export default useRealtimeUpdates;
