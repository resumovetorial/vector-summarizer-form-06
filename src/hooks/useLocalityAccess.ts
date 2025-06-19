
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UseLocalityAccessProps {
  localityName: string;
}

export const useLocalityAccess = ({ localityName }: UseLocalityAccessProps) => {
  const [accessibleLocalities, setAccessibleLocalities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadAccessibleLocalities = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Get locality ID by name
        const { data: localityData, error: localityError } = await supabase
          .from('localities')
          .select('id')
          .eq('name', localityName)
          .maybeSingle();
          
        if (localityError || !localityData) {
          console.error('Erro ao buscar ID da localidade:', localityError);
          setIsLoading(false);
          return;
        }
        
        const localityId = localityData.id;
        
        // Check if user has access to this locality
        const { data: access, error: accessError } = await supabase
          .from('locality_access')
          .select('*')
          .eq('user_id', user.id)
          .eq('locality_id', localityId);
          
        if (accessError) {
          console.error('Erro ao verificar acesso do usuário:', accessError);
          setIsLoading(false);
          return;
        }
        
        // User has access if there's at least one entry in the table
        const userHasAccess = access && access.length > 0;
        setHasAccess(userHasAccess);
        
        // Fetch all accessible localities for the user
        const { data: userLocalities, error: userLocalitiesError } = await supabase
          .from('locality_access')
          .select('localities(name)')
          .eq('user_id', user.id);
          
        if (userLocalitiesError) {
          console.error('Erro ao buscar localidades do usuário:', userLocalitiesError);
          setIsLoading(false);
          return;
        }
        
        // Extract locality names
        const localityNames = userLocalities
          .map(entry => entry.localities?.name)
          .filter(Boolean) as string[];
          
        setAccessibleLocalities(localityNames);
      } catch (error) {
        console.error('Erro ao verificar acesso às localidades:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAccessibleLocalities();
  }, [user?.id, localityName]);
  
  return { hasAccess, isLoading, accessibleLocalities };
};
