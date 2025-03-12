
import { useState, useEffect } from 'react';
import { User, AccessLevel } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { mockUsers } from '@/services/adminService';
import { fetchAccessLevels } from '@/services/accessLevelService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch access levels from Supabase if available
        let fetchedAccessLevels: AccessLevel[] = [];
        try {
          fetchedAccessLevels = await fetchAccessLevels();
          console.log("Fetched access levels:", fetchedAccessLevels);
          setAccessLevels(fetchedAccessLevels);
        } catch (error) {
          console.error('Erro ao buscar níveis de acesso:', error);
          // Fallback to mock data
          const { mockAccessLevels } = await import('@/services/adminService');
          setAccessLevels(mockAccessLevels);
        }
        
        // Fetch users from Supabase
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Erro ao buscar perfis:', error);
          // Fallback to mock data
          setUsers(mockUsers);
          return;
        }

        if (profiles && profiles.length > 0) {
          // Convert Supabase profiles to User format
          const realUsers: User[] = profiles.map((profile, index) => {
            // Determine the access level ID based on profile or defaults
            let accessLevelId = 3; // Default to lowest level
            
            if (profile.access_level_id) {
              // If profile has a UUID access level ID, find the matching numeric ID
              const matchingLevel = fetchedAccessLevels.find(
                level => level.id.toString() === profile.access_level_id
              );
              if (matchingLevel) {
                accessLevelId = matchingLevel.id;
              }
            } else if (profile.role === 'admin') {
              accessLevelId = 1;
            } else if (profile.role === 'supervisor') {
              accessLevelId = 2;
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
          // Fallback to mock data if no profiles found
          setUsers(mockUsers);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        // Fallback to mock data
        setUsers(mockUsers);
        const { mockAccessLevels } = await import('@/services/adminService');
        setAccessLevels(mockAccessLevels);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteUser = async (userId: number, supabaseId?: string) => {
    if (!supabaseId) {
      // For mock users without Supabase ID
      setUsers(users.filter(user => user.id !== userId));
      return true;
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
