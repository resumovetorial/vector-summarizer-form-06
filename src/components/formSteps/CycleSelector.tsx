
import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import FormField from '../FormField';

interface CycleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  animationDelay?: number;
  workModality: string; // Add workModality prop to determine cycle options
}

const CycleSelector: React.FC<CycleSelectorProps> = ({
  value,
  onChange,
  error,
  animationDelay = 200,
  workModality
}) => {
  // State to hold the available cycles based on work modality
  const [cycleOptions, setCycleOptions] = useState<string[]>([]);

  // Update cycle options when work modality changes
  useEffect(() => {
    if (workModality === 'PE') {
      // Generate cycles 01-27 for PE modality
      const peOptions = Array.from({ length: 27 }, (_, i) => 
        (i + 1).toString().padStart(2, '0')
      );
      setCycleOptions(peOptions);
    } else {
      // Generate cycles 01-06 for all other modalities
      const regularOptions = Array.from({ length: 6 }, (_, i) => 
        (i + 1).toString().padStart(2, '0')
      );
      setCycleOptions(regularOptions);
    }
  }, [workModality]);

  // If the current value is not valid for the new options, reset it
  useEffect(() => {
    if (value && !cycleOptions.includes(value)) {
      onChange('');
    }
  }, [cycleOptions, value, onChange]);

  return (
    <FormField
      id="cycle"
      label="Ciclo"
      required
      error={error}
      animationDelay={animationDelay}
    >
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Selecione o ciclo" />
        </SelectTrigger>
        <SelectContent>
          {cycleOptions.map((cycle) => (
            <SelectItem key={cycle} value={cycle}>
              {cycle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
};

export default CycleSelector;
