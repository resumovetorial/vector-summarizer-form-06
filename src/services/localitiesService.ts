
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
    return [...defaultLocalities];
  } catch (error) {
    console.error('Error fetching localities:', error);
    return [...defaultLocalities];
  }
};

export const saveLocalities = (localities: string[]): boolean => {
  try {
    localStorage.setItem('localities', JSON.stringify(localities));
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
    if (currentLocalities.includes(locality)) {
      toast.error('Esta localidade já existe');
      return false;
    }
    
    const updatedLocalities = [...currentLocalities, locality];
    saveLocalities(updatedLocalities);
    return true;
  } catch (error) {
    console.error('Error adding locality:', error);
    return false;
  }
};

export const removeLocality = (locality: string): boolean => {
  try {
    const currentLocalities = getLocalities();
    const updatedLocalities = currentLocalities.filter(l => l !== locality);
    saveLocalities(updatedLocalities);
    return true;
  } catch (error) {
    console.error('Error removing locality:', error);
    return false;
  }
};
