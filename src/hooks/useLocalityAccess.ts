
import { useState, useEffect } from 'react';
import { getUserAccessibleLocalities } from '@/services/adminService';

interface UseLocalityAccessProps {
  localityName: string;
  userId?: number; // Make userId optional to allow for custom ID in the future
}

export const useLocalityAccess = ({ localityName, userId = 2 }: UseLocalityAccessProps) => {
  const [accessibleLocalities, setAccessibleLocalities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAccessControl = async () => {
      try {
        // In a real application, this would use the actual logged-in user ID
        const localities = await getUserAccessibleLocalities(userId);
        setAccessibleLocalities(localities);
      } catch (error) {
        console.error("Failed to load user permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAccessControl();
  }, [userId]);

  const hasAccess = localityName ? accessibleLocalities.includes(localityName) : false;
  
  return { hasAccess, isLoading, accessibleLocalities };
};
