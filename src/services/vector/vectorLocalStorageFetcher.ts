
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';

/**
 * Retrieves vector data from local storage
 * @returns Array of locality data from local storage or empty array if not found
 */
export const getLocalVectorData = (): LocalityData[] => {
  const savedData = localStorage.getItem('vectorData');
  if (savedData) {
    try {
      console.log("Dados recuperados do localStorage");
      const parsedData = JSON.parse(savedData);
      toast.info(`${parsedData.length} registros carregados do armazenamento local`);
      return parsedData;
    } catch (error) {
      console.error('Erro ao analisar dados do localStorage:', error);
      toast.error('Erro ao ler dados locais');
      return [];
    }
  }
  console.log("Nenhum dado encontrado no localStorage");
  toast.warning('Nenhum dado encontrado localmente');
  return [];
};
