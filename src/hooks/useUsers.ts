
import { useState, useEffect } from 'react';
import { User, AccessLevel } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { mockUsers } from '@/services/adminService';
import { fetchAccessLevels } from '@/services/accessLevelService';
import { toast } from 'sonner';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch access levels from Supabase first
        let fetchedAccessLevels: AccessLevel[] = [];
        try {
          fetchedAccessLevels = await fetchAccessLevels();
          console.log("Fetched access levels:", fetchedAccessLevels);
          setAccessLevels(fetchedAccessLevels);
        } catch (error) {
          console.error('Erro ao buscar níveis de acesso:', error);
          toast.error("Não foi possível carregar os níveis de acesso.");
          return;
        }
        
        if (fetchedAccessLevels.length === 0) {
          toast.error("Nenhum nível de acesso encontrado. Cadastre níveis de acesso primeiro.");
          return;
        }
        
        // Fetch users from Supabase
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Erro ao buscar perfis:', error);
          toast.error("Erro ao carregar usuários. Usando dados de exemplo temporariamente.");
          // Fallback to mock data only in development
          if (import.meta.env.DEV) {
            setUsers(mockUsers);
          }
          return;
        }

        if (profiles && profiles.length > 0) {
          // Convert Supabase profiles to User format
          const realUsers: User[] = profiles.map((profile, index) => {
            // Determine the access level ID based on profile
            let accessLevelId = fetchedAccessLevels[0].id; // Default to first access level
            
            if (profile.access_level_id) {
              // If profile has an access level ID, find the matching numeric ID
              const matchingLevel = fetchedAccessLevels.find(
                level => level.id.toString() === profile.access_level_id
              );
              if (matchingLevel) {
                accessLevelId = matchingLevel.id;
              }
            } else if (profile.role === 'admin') {
              // Try to find admin access level
              const adminLevel = fetchedAccessLevels.find(level => level.name.toLowerCase() === 'administrador');
              if (adminLevel) {
                accessLevelId = adminLevel.id;
              }
            }
            
            return {
              id: index + 1,
              supabaseId: profile.id,
              name: profile.username || `Usuário ${index + 1}`,
              email: profile.username || `usuario${index + 1}@exemplo.com`,
              role: profile.role || 'Usuário',
              accessLevelId: accessLevelId,
              active: profile.active ?? true,
              assignedLocalities: []
            };
          });
          
          console.log("Converted users:", realUsers);
          setUsers(realUsers);
        } else {
          // If no profiles found, show empty list instead of mock data in production
          if (import.meta.env.DEV) {
            console.log("No profiles found, using mock data in development");
            setUsers(mockUsers);
          } else {
            console.log("No profiles found, showing empty list");
            setUsers([]);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error("Erro inesperado ao carregar dados de usuários.");
        // Only use mock data in development
        if (import.meta.env.DEV) {
          setUsers(mockUsers);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteUser = async (userId: number, supabaseId?: string) => {
    if (!supabaseId) {
      // For mock users without Supabase ID
      if (import.meta.env.DEV) {
        setUsers(users.filter(user => user.id !== userId));
        return true;
      }
      toast.error("Este usuário não pode ser excluído");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Call the RPC function to delete both user and profile
      const { error } = await supabase.rpc('delete_user_and_profile', {
        user_id: supabaseId
      });
      
      if (error) {
        throw error;
      }
      
      // Update the user list in the UI
      setUsers(users.filter(user => user.id !== userId));
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast.error(`Erro ao excluir usuário: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    setUsers,
    accessLevels,
    isLoading,
    handleDeleteUser
  };
};
