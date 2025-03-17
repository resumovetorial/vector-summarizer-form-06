
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
          
          // Set access levels (including all defined levels)
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
        
        // Fetch real users from Supabase with their access levels
        try {
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, username, role, active, access_level_id');
          
          if (error) {
            throw error;
          }

          console.log("Raw profiles data:", profiles);

          if (profiles && profiles.length > 0) {
            // Get auth users to combine with profiles if possible
            const emailMap: Record<string, string> = {};
            
            try {
              const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
              
              if (!authError && authUsers?.users) {
                console.log("Auth users data:", authUsers.users);
                // Create a mapping of user IDs to emails
                authUsers.users.forEach((user: any) => {
                  if (user.id && user.email) {
                    emailMap[user.id] = user.email;
                  }
                });
              } else {
                console.log("Could not fetch auth users (expected for non-admin access):", authError);
              }
            } catch (authError) {
              console.log("Error fetching auth users (expected for non-admin access):", authError);
            }

            // Fetch assigned localities for each profile
            const localityMap = new Map<string, string[]>();
            
            try {
              const { data: localityAccess, error: localityError } = await supabase
                .from('locality_access')
                .select('user_id, localities(name)');
                
              if (!localityError && localityAccess) {
                console.log("Locality access data:", localityAccess);
                
                // Group localities by user ID
                localityAccess.forEach((access: any) => {
                  if (access.user_id && access.localities?.name) {
                    if (!localityMap.has(access.user_id)) {
                      localityMap.set(access.user_id, []);
                    }
                    localityMap.get(access.user_id)?.push(access.localities.name);
                  }
                });
              }
            } catch (localityError) {
              console.error("Error fetching locality access:", localityError);
            }

            // Convert Supabase profiles to User format
            const realUsers: User[] = profiles.map((profile, index) => {
              // Get the access level ID - either use the one stored in the profile or default to the first one
              let accessLevelId = profile.access_level_id ? 
                fetchedAccessLevels.find(level => level.id.toString() === profile.access_level_id)?.id : 
                fetchedAccessLevels[0].id;
                
              // If access level is not found, use the first one
              if (!accessLevelId) {
                accessLevelId = fetchedAccessLevels[0].id;
              }
              
              // Get email from auth users if available, or use username
              const email = emailMap[profile.id] || profile.username || `usuario${index + 1}@exemplo.com`;
              
              // Get assigned localities
              const assignedLocalities = localityMap.get(profile.id) || [];
              
              return {
                id: index + 1,
                supabaseId: profile.id,
                name: profile.username || email.split('@')[0] || `Usuário ${index + 1}`,
                email: email,
                role: profile.role || 'Usuário',
                accessLevelId: accessLevelId,
                active: profile.active ?? true,
                assignedLocalities: assignedLocalities
              };
            });
            
            console.log("Converted users:", realUsers);
            setUsers(realUsers);
          } else {
            console.log("No profiles found, showing empty list");
            setUsers([]);
          }
        } catch (profileError) {
          console.error('Erro ao buscar perfis:', profileError);
          toast.error("Erro ao carregar usuários. Continuando em modo de demonstração.");
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
        // Continue anyway in demo mode
        toast.error(`Erro ao excluir usuário no Supabase: ${profileError.message}. Removendo usuário localmente.`);
      }
      
      // Update UI state regardless of backend success
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Usuário removido com sucesso!");
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast.error(`Erro ao excluir usuário: ${error.message}. Continuando em modo de demonstração.`);
      
      // In demo mode, we'll still update the UI
      setUsers(users.filter(user => user.id !== userId));
      return true;
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
