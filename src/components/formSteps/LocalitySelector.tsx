
import React from 'react';
import FormField from '@/components/FormField';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { getLocalities } from '@/services/localitiesService';

interface LocalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  animationDelay?: number;
}

const LocalitySelector: React.FC<LocalitySelectorProps> = ({
  value,
  onChange,
  error,
  animationDelay = 100
}) => {
  // Get localities from service
  const localities = getLocalities();
  
  return (
    <FormField
      id="locality"
      label="Localidade"
      required
      error={error}
      animationDelay={animationDelay}
    >
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <MapPin className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Selecione a localidade" />
        </SelectTrigger>
        <SelectContent>
          {localities.map((locality) => (
            <SelectItem key={locality} value={locality}>
              {locality}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
};

export default LocalitySelector;
