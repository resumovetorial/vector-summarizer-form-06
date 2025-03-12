
import React from 'react';
import { Briefcase } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import FormField from '../FormField';

interface WorkModalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  animationDelay?: number;
}

const WorkModalitySelector: React.FC<WorkModalitySelectorProps> = ({
  value,
  onChange,
  error,
  animationDelay = 150
}) => {
  return (
    <FormField
      id="workModality"
      label="Tipo de Modalidade de Trabalho"
      required
      error={error}
      animationDelay={animationDelay}
    >
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <Briefcase className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Selecione a modalidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LI">LI</SelectItem>
          <SelectItem value="LI + T">LI + T</SelectItem>
          <SelectItem value="PE">PE</SelectItem>
          <SelectItem value="TRATAMENTO">TRATAMENTO</SelectItem>
          <SelectItem value="DF">DF</SelectItem>
          <SelectItem value="PVE">PVE</SelectItem>
        </SelectContent>
      </Select>
    </FormField>
  );
};

export default WorkModalitySelector;
