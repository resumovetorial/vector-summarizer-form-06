
import { useState, useEffect } from 'react';
import { User, AccessLevel } from '@/types/admin';
import { supabase } from '@/lib/supabase';
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
          
          // Set access levels (including "Agente" level)
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
        
        // Fetch real users from Supabase
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, username, role, active, access_level_id');
        
        if (error) {
          console.error('Erro ao buscar perfis:', error);
          toast.error("Erro ao carregar usuários.");
          setUsers([]);
          return;
        }

        console.log("Raw profiles data:", profiles);

        if (profiles && profiles.length > 0) {
          // Get auth users to combine with profiles
          const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
          
          // Initialize emailMap as an empty Record<string, string>
          let emailMap: Record<string, string> = {};
          
          if (!authError && authUsers?.users) {
            console.log("Auth users data:", authUsers.users);
            // Create a mapping of user IDs to emails
            // Explicitly type the array and initial value for reduce
            emailMap = authUsers.users.reduce((map: Record<string, string>, user: any) => {
              if (user.id && user.email) {
                map[user.id] = user.email;
              }
              return map;
            }, {} as Record<string, string>); // Specify initial value type
          } else {
            console.log("Could not fetch auth users (expected for non-admin access):", authError);
          }

          // Convert Supabase profiles to User format
          const realUsers: User[] = profiles.map((profile, index) => {
            // Determine the access level ID based on profile
            let accessLevelId = fetchedAccessLevels[0].id; // Default to first access level
            
            if (profile.access_level_id) {
              const foundLevel = fetchedAccessLevels.find(
                level => level.id.toString() === profile.access_level_id
              );
              if (foundLevel) {
                accessLevelId = foundLevel.id;
              }
            } else if (profile.role === 'admin') {
              const adminLevel = fetchedAccessLevels.find(
                level => level.name.toLowerCase() === 'administrador'
              );
              if (adminLevel) {
                accessLevelId = adminLevel.id;
              }
            }
            
            // Get email from auth users if available, or use username
            const email = emailMap[profile.id] || profile.username || `usuario${index + 1}@exemplo.com`;
            
            return {
              id: index + 1,
              supabaseId: profile.id,
              name: profile.username || email.split('@')[0] || `Usuário ${index + 1}`,
              email: email,
              role: profile.role || 'Usuário',
              accessLevelId: accessLevelId,
              active: profile.active ?? true,
              assignedLocalities: []
            };
          });
          
          console.log("Converted users:", realUsers);
          setUsers(realUsers);
        } else {
          console.log("No profiles found, showing empty list");
          setUsers([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error("Erro inesperado ao carregar dados de usuários.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteUser = async (userId: number, supabaseId?: string) => {
    if (!supabaseId) {
      toast.error("Este usuário não pode ser excluído");
      return false;
    }

    setIsLoading(true);
    
    try {
      // First try to delete the user's profile directly
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', supabaseId);
        
      if (profileError) {
        console.error('Erro ao excluir perfil:', profileError);
        throw profileError;
      }
      
      // If successful, update the UI
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
