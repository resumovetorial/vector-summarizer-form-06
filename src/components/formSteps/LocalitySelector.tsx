
import React, { useEffect, useState } from 'react';
import FormField from '@/components/FormField';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { getLocalities } from '@/services/localitiesService';
import { supabase } from '@/lib/supabase';

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
  // Use state to store localities
  const [localities, setLocalities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch localities from Supabase and fallback to local data
  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        setLoading(true);
        
        // Tentar buscar do Supabase primeiro
        const { data, error } = await supabase
          .from('localities')
          .select('name')
          .order('name');
          
        if (error) {
          console.error('Erro ao buscar localidades do Supabase:', error);
          // Fallback para dados locais
          const localLocalities = getLocalities();
          console.log('Usando localidades locais:', localLocalities.length);
          setLocalities(localLocalities);
        } else if (data && data.length > 0) {
          // Mapear nomes de localidades do Supabase
          const localityNames = data.map(loc => loc.name);
          console.log('Localidades carregadas do Supabase:', localityNames.length);
          setLocalities(localityNames);
        } else {
          // Se não houver dados no Supabase, usar fallback
          console.log('Nenhuma localidade encontrada no Supabase, usando dados locais');
          setLocalities(getLocalities());
        }
      } catch (err) {
        console.error('Erro ao carregar localidades:', err);
        // Fallback para dados locais em caso de erro
        setLocalities(getLocalities());
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocalities();
  }, []);
  
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
        disabled={loading}
      >
        <SelectTrigger className="w-full">
          <MapPin className="mr-2 h-4 w-4" />
          <SelectValue placeholder={loading ? "Carregando localidades..." : "Selecione a localidade"} />
        </SelectTrigger>
        <SelectContent>
          {localities.map((locality) => (
            <SelectItem key={locality} value={locality}>
              {locality}
            </SelectItem>
          ))}
          {localities.length === 0 && !loading && (
            <SelectItem value="sem-localidades" disabled>
              Nenhuma localidade encontrada
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </FormField>
  );
};

export default LocalitySelector;
