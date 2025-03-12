
import React from 'react';
import { Calendar } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import FormField from '../FormField';

// Create array of epidemiological weeks from 01 to 53
const epidemiologicalWeeks = Array.from({ length: 53 }, (_, i) => 
  (i + 1).toString().padStart(2, '0')
);

interface EpidemiologicalWeekSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  animationDelay?: number;
  withFormField?: boolean;
  placeholder?: string;
}

const EpidemiologicalWeekSelector: React.FC<EpidemiologicalWeekSelectorProps> = ({
  value,
  onChange,
  error,
  animationDelay = 200,
  withFormField = true,
  placeholder = "Selecione a semana"
}) => {
  const selector = (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full">
        <Calendar className="mr-2 h-4 w-4" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {epidemiologicalWeeks.map((week) => (
          <SelectItem key={week} value={week}>
            {week}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (!withFormField) {
    return selector;
  }

  return (
    <FormField
      id="epidemiologicalWeek"
      label="Semana Epidemiológica"
      required
      error={error}
      animationDelay={animationDelay}
    >
      {selector}
    </FormField>
  );
};

export default EpidemiologicalWeekSelector;
