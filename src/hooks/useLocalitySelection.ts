
import { useState } from 'react';
import { LocalityData } from '@/types/dashboard';

export const useLocalitySelection = (dashboardData: LocalityData[]) => {
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [localityData, setLocalityData] = useState<LocalityData | null>(null);
  const [localityHistoricalData, setLocalityHistoricalData] = useState<LocalityData[]>([]);

  const handleLocalityChange = (value: string) => {
    setSelectedLocality(value);

    if (value) {
      const filteredData = dashboardData
        .filter(item => item.locality === value)
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
      
      if (filteredData.length > 0) {
        setLocalityData(filteredData[0]);
        setLocalityHistoricalData(filteredData);
      } else {
        setLocalityData(null);
        setLocalityHistoricalData([]);
      }
    } else {
      setLocalityData(null);
      setLocalityHistoricalData([]);
    }
  };

  const resetLocalitySelection = () => {
    setSelectedLocality('');
    setLocalityData(null);
    setLocalityHistoricalData([]);
  };

  return {
    selectedLocality,
    localityData,
    localityHistoricalData,
    handleLocalityChange,
    resetLocalitySelection
  };
};
