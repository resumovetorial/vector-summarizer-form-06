
import React from 'react';
import { MapPin } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import FormField from '../FormField';

const localities = [
  "Alemita",
  "Alto Maron", 
  "Antique",
  "Bananeira",
  "Banco Raso", 
  "California", 
  "Carlos Silva", 
  "Castalia", 
  "Centro",
  "Centro Comercial",
  "Conceicao",
  "Corbiniano Freire",
  "Daniel Gomes",
  "Fatima",
  "Fernando Gomes", 
  "Ferradas",
  "Fonseca", 
  "Goes Calmon", 
  "Horteiro",
  "Itamaraca",
  "Jacana",
  "Jardim Brasil",
  "Jardim Grapiuna",
  "Jardim Primavera",
  "Joao Soares",
  "Jorge Amado",
  "Lomanto",
  "Mangabinha",
  "Manoel Leão",
  "Maria Matos",
  "Maria Pinheiro",
  "Monte Cristo",
  "Mutuns",
  "N S das Gracas", 
  "Nova California",
  "Nova Esperança",
  "Nova Ferradas",
  "Nova Itabuna", 
  "Nova Fonseca", 
  "Novo Horizonte",
  "Novo S Caetano",
  "Parque Boa Vista",
  "Parque Verde",
  "Pedro Geronimo",
  "Pontalzinho",
  "Roca do Povo",
  "Santa Catarina",
  "Santa Clara",
  "Santa Ines",
  "Santo Antonio",
  "Sao Caetano",
  "Sao Judas",
  "Sao Lourenço",
  "Sao Pedro",
  "Sao Roque",
  "Sarinha",
  "Sinval Palmeira",
  "Taverolandia",
  "Urbis IV",
  "Vila Analia",
  "Vila Paloma",
  "Zildolandia",
  "Zizo"
];

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
        <SelectContent className="max-h-80">
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
