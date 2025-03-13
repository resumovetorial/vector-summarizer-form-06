
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';

/**
 * Saves vector data to local storage
 * @param data Array of locality data to save
 * @returns True if save was successful, false otherwise
 */
export const saveToLocalStorage = async (data: LocalityData[]): Promise<boolean> => {
  try {
    // Validate input data
    if (!Array.isArray(data)) {
      console.error('Invalid data format: expected an array');
      return false;
    }
    
    if (data.length === 0) {
      console.warn('Saving empty data array');
    }
    
    // Save to localStorage
    const dataString = JSON.stringify(data);
    localStorage.setItem('vectorData', dataString);
    
    console.log('Vector data saved to localStorage:', data.length, 'items');
    return true;
  } catch (error) {
    console.error('Error saving vector data to localStorage:', error);
    
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      toast.error('Could not save data: storage quota exceeded');
    }
    
    return false;
  }
};
