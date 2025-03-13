
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
import { toast } from 'sonner';

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
        console.log('Buscando localidades do Supabase...');
        
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('localities')
          .select('name')
          .order('name');
          
        if (error) {
          console.error('Erro ao buscar localidades do Supabase:', error);
          // Fallback to local data
          const localLocalities = getLocalities();
          console.log('Usando localidades locais:', localLocalities.length);
          setLocalities(localLocalities);
          toast.warning('Usando localidades locais (sem conexão com servidor)');
        } else if (data && data.length > 0) {
          // Map locality names from Supabase
          const localityNames = data.map(loc => loc.name);
          console.log('Localidades carregadas do Supabase:', localityNames.length);
          setLocalities(localityNames);
          toast.success('Localidades carregadas com sucesso');
        } else {
          // If no data in Supabase, use fallback
          console.log('Nenhuma localidade encontrada no Supabase, usando dados locais');
          const localLocalities = getLocalities();
          setLocalities(localLocalities);
          
          // Try to populate Supabase with local localities
          if (localLocalities.length > 0) {
            try {
              console.log('Tentando povoar o Supabase com localidades locais...');
              for (const locality of localLocalities) {
                await supabase.from('localities').insert({ name: locality }).select();
              }
              console.log('Localidades locais carregadas para o Supabase');
            } catch (insertError) {
              console.error('Erro ao povoar localidades no Supabase:', insertError);
            }
          }
        }
      } catch (err) {
        console.error('Erro ao carregar localidades:', err);
        // Fallback to local data in case of error
        setLocalities(getLocalities());
        toast.error('Erro ao carregar localidades do servidor');
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
