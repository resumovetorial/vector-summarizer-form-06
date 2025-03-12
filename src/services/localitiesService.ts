
import { toast } from 'sonner';
import { localities as defaultLocalities } from '@/utils/localities';

// In a real application, this would interact with a backend API
// For now, we'll use localStorage to persist changes

export const getLocalities = (): string[] => {
  try {
    const storedLocalities = localStorage.getItem('localities');
    if (storedLocalities) {
      return JSON.parse(storedLocalities);
    }
    
    // If no localities found in localStorage, use default and save them
    saveLocalities([...defaultLocalities]);
    return [...defaultLocalities];
  } catch (error) {
    console.error('Error fetching localities:', error);
    return [...defaultLocalities];
  }
};

export const saveLocalities = (localities: string[]): boolean => {
  try {
    // Sort localities alphabetically for better user experience
    const sortedLocalities = [...localities].sort((a, b) => 
      a.localeCompare(b, 'pt-BR')
    );
    
    localStorage.setItem('localities', JSON.stringify(sortedLocalities));
    return true;
  } catch (error) {
    console.error('Error saving localities:', error);
    toast.error('Erro ao salvar localidades');
    return false;
  }
};

export const addLocality = (locality: string): boolean => {
  try {
    const currentLocalities = getLocalities();
    
    // Check if locality already exists (case-insensitive)
    if (currentLocalities.some(l => l.toLowerCase() === locality.toLowerCase())) {
      toast.error('Esta localidade já existe');
      return false;
    }
    
    const updatedLocalities = [...currentLocalities, locality];
    return saveLocalities(updatedLocalities);
  } catch (error) {
    console.error('Error adding locality:', error);
    toast.error('Erro ao adicionar localidade');
    return false;
  }
};

export const removeLocality = (locality: string): boolean => {
  try {
    const currentLocalities = getLocalities();
    const updatedLocalities = currentLocalities.filter(l => l !== locality);
    return saveLocalities(updatedLocalities);
  } catch (error) {
    console.error('Error removing locality:', error);
    toast.error('Erro ao remover localidade');
    return false;
  }
};
