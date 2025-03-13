
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
    
    console.log('Dados vetoriais salvos no localStorage:', data.length, 'itens');
    
    // Tentar sincronizar com Supabase se houver dados para salvar
    if (data.length > 0) {
      try {
        console.log('Tentando sincronizar com Supabase...');
        const syncResult = await syncDataWithSupabase(data);
        if (syncResult) {
          toast.success('Dados sincronizados com sucesso');
          return true;
        } else {
          toast.warning('Dados salvos localmente, mas não foi possível sincronizar com o servidor');
        }
      } catch (syncError) {
        console.error('Erro ao sincronizar com Supabase, mas dados foram salvos localmente:', syncError);
        toast.warning('Dados salvos localmente, mas não foi possível sincronizar com o servidor');
      }
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
const syncDataWithSupabase = async (data: LocalityData[]): Promise<boolean> => {
  // Usar ID fixo para demonstração - em produção, seria o ID do usuário autenticado
  const userId = '00000000-0000-0000-0000-000000000000';
  let successCount = 0;
  
  for (const item of data) {
    try {
      // Verificar se esta localidade existe
      let localityId = null;
      
      console.log(`Verificando localidade: "${item.locality}"`);
      
      // Primeiro, tentamos buscar a localidade pelo nome exato
      const { data: existingLocalities, error: searchError } = await supabase
        .from('localities')
        .select('id')
        .eq('name', item.locality);
      
      if (searchError) {
        console.error("Erro ao buscar localidade:", searchError);
        // Tentar criar a localidade mesmo assim
        try {
          const { data: newLoc, error: insertErr } = await supabase
            .from('localities')
            .insert([{ name: item.locality }])
            .select('id');
          
          if (insertErr) {
            console.error("Erro ao criar localidade após falha na busca:", insertErr);
            continue;
          } else if (newLoc && newLoc.length > 0) {
            localityId = newLoc[0].id;
            console.log("Localidade criada com ID:", localityId);
          }
        } catch (e) {
          console.error("Exceção ao criar localidade:", e);
          continue;
        }
      } else if (existingLocalities && existingLocalities.length > 0) {
        // Se encontramos a localidade, usar o ID
        localityId = existingLocalities[0].id;
        console.log("Localidade encontrada com ID:", localityId);
      } else {
        // Se não encontramos, criar nova localidade
        console.log("Localidade não encontrada, criando nova:", item.locality);
        
        try {
          const { data: newLocality, error: insertError } = await supabase
            .from('localities')
            .insert([{ name: item.locality }])
            .select('id');
          
          if (insertError) {
            console.error("Erro ao criar localidade:", insertError);
            continue;
          }
          
          if (newLocality && newLocality.length > 0) {
            localityId = newLocality[0].id;
            console.log("Nova localidade criada com ID:", localityId);
          } else {
            console.error("Falha ao criar localidade: sem retorno de dados");
            continue;
          }
        } catch (e) {
          console.error("Exceção ao criar nova localidade:", e);
          continue;
        }
      }
      
      // Se temos um ID de localidade válido, inserir os dados
      if (localityId) {
        // Garantir que as datas estejam presentes
        if (!item.startDate || !item.endDate) {
          console.error("Datas de início e/ou fim ausentes para o item:", item);
          continue;
        }
        
        // Inserir dados no Supabase
        console.log("Inserindo dados para localidade:", item.locality);
        
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
          console.log('Dados sincronizados com sucesso no Supabase para localidade:', item.locality);
          successCount++;
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar dados com Supabase:', error);
    }
  }
  
  return successCount > 0;
};
