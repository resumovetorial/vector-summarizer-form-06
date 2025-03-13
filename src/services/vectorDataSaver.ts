
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Salvar dados vetoriais no localStorage e tentar no Supabase
export const saveVectorData = async (data: LocalityData[]): Promise<boolean> => {
  try {
    // Validar dados antes de salvar
    if (!Array.isArray(data)) {
      console.error('Formato de dados inválido: esperava um array');
      toast.error('Erro ao salvar os dados: formato inválido');
      return false;
    }
    
    // Verificar se há itens no array
    if (data.length === 0) {
      console.warn('Salvando array de dados vazio');
    }
    
    // Salvar no localStorage para compatibilidade
    const dataString = JSON.stringify(data);
    localStorage.setItem('vectorData', dataString);
    
    console.log('Dados vetoriais salvos no localStorage:', data);
    
    // Tentar sincronizar com Supabase
    try {
      await syncDataWithSupabase(data);
    } catch (syncError) {
      console.error('Erro ao sincronizar com Supabase, mas dados foram salvos localmente:', syncError);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados vetoriais:', error);
    
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      toast.error('Não foi possível salvar os dados: espaço de armazenamento excedido');
    } else {
      toast.error('Erro ao salvar os dados');
    }
    
    return false;
  }
};

// Função auxiliar para sincronizar dados com Supabase
const syncDataWithSupabase = async (data: LocalityData[]): Promise<void> => {
  // Usar ID fixo para demonstração
  const userId = '00000000-0000-0000-0000-000000000000';
  
  for (const item of data) {
    try {
      // Verificar se esta localidade existe
      const { data: localityData, error: localityError } = await supabase
        .from('localities')
        .select('id')
        .eq('name', item.locality)
        .single();
        
      if (localityError) {
        console.log('Criando nova localidade:', item.locality);
        // Criar localidade
        const { data: newLocality, error: createError } = await supabase
          .from('localities')
          .insert([
            { name: item.locality }
          ])
          .select('id')
          .single();
          
        if (createError) {
          console.error('Erro ao criar localidade:', createError);
          continue;
        }
        
        var localityId = newLocality.id;
      } else {
        var localityId = localityData.id;
      }
      
      // Inserir dados no Supabase
      const { error } = await supabase
        .from('vector_data')
        .insert([{
          municipality: item.municipality,
          locality_id: localityId,
          cycle: item.cycle,
          epidemiological_week: item.epidemiologicalWeek,
          work_modality: item.workModality,
          start_date: item.startDate,
          end_date: item.endDate,
          total_properties: item.totalProperties,
          inspections: item.inspections,
          deposits_eliminated: item.depositsEliminated,
          deposits_treated: item.depositsTreated,
          supervisor: userId,
          qt_residencias: item.qt_residencias,
          qt_comercio: item.qt_comercio,
          qt_terreno_baldio: item.qt_terreno_baldio,
          qt_pe: item.qt_pe,
          qt_outros: item.qt_outros,
          qt_total: item.qt_total,
          tratamento_focal: item.tratamento_focal,
          tratamento_perifocal: item.tratamento_perifocal,
          amostras_coletadas: item.amostras_coletadas,
          recusa: item.recusa,
          fechadas: item.fechadas,
          recuperadas: item.recuperadas,
          a1: item.a1,
          a2: item.a2,
          b: item.b,
          c: item.c,
          d1: item.d1,
          d2: item.d2,
          e: item.e,
          larvicida: item.larvicida,
          quantidade_larvicida: item.quantidade_larvicida,
          quantidade_depositos_tratados: item.quantidade_depositos_tratados,
          adulticida: item.adulticida,
          quantidade_cargas: item.quantidade_cargas,
          total_tec_saude: item.total_tec_saude,
          total_dias_trabalhados: item.total_dias_trabalhados,
          created_by: userId
        }]);
          
      if (error) {
        console.error('Erro ao inserir dados no Supabase:', error);
      } else {
        console.log('Dados sincronizados com sucesso no Supabase');
      }
    } catch (error) {
      console.error('Erro ao sincronizar dados com Supabase:', error);
    }
  }
};
