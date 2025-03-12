
import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface CycleSelectorDashboardProps {
  value: string;
  onChange: (value: string) => void;
  cycles: string[];
  workModality?: string; // Optional work modality to filter cycles
}

const CycleSelectorDashboard: React.FC<CycleSelectorDashboardProps> = ({
  value,
  onChange,
  cycles,
  workModality
}) => {
  // State to hold the available cycles based on work modality
  const [availableCycles, setAvailableCycles] = useState<string[]>(cycles);

  // Update available cycles when work modality changes
  useEffect(() => {
    if (workModality === 'PE') {
      // For PE modality, use all cycles up to 27
      const maxCycle = 27;
      const cycleNumbers = Array.from({ length: maxCycle }, (_, i) => 
        (i + 1).toString()
      );
      // Filter to only include cycles that exist in the data
      const filteredCycles = cycleNumbers.filter(cycle => 
        cycles.includes(cycle)
      );
      setAvailableCycles(filteredCycles);
    } else if (workModality) {
      // For other modalities, use cycles up to 6
      const maxCycle = 6;
      const cycleNumbers = Array.from({ length: maxCycle }, (_, i) => 
        (i + 1).toString()
      );
      // Filter to only include cycles that exist in the data
      const filteredCycles = cycleNumbers.filter(cycle => 
        cycles.includes(cycle)
      );
      setAvailableCycles(filteredCycles);
    } else {
      // If no modality specified, use all available cycles
      setAvailableCycles(cycles);
    }
  }, [workModality, cycles]);

  // Format cycle numbers to ensure they have leading zeros (e.g., "01", "02")
  const formatCycleNumber = (cycle: string): string => {
    // If cycle is already formatted or is "all", return as is
    if (cycle === "all" || cycle.length === 2) {
      return cycle;
    }
    
    // Add leading zero for single digit cycles
    return cycle.padStart(2, '0');
  };

  return (
    <div className="w-full sm:w-64">
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Selecione o ciclo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os ciclos</SelectItem>
          {availableCycles.map((cycle) => (
            <SelectItem key={cycle} value={cycle}>
              Ciclo {formatCycleNumber(cycle)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CycleSelectorDashboard;
