
import React from 'react';
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
}

const CycleSelectorDashboard: React.FC<CycleSelectorDashboardProps> = ({
  value,
  onChange,
  cycles
}) => {
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
          {cycles.map((cycle) => (
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
