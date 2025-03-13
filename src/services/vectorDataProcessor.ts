
import { FormData } from "@/types/vectorForm";
import { format } from 'date-fns';
import { LocalityData } from "@/types/dashboard";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { getSavedVectorData } from './vectorDataFetcher';
import { saveVectorData } from './vectorDataSaver';

export const processVectorData = async (formData: FormData) => {
  console.log("Iniciando processamento de dados do formulário:", formData);
  
  // Converter dados do formulário para o formato de dados vetoriais
  const vectorData: LocalityData = {
    municipality: formData.municipality,
    locality: formData.locality,
    cycle: formData.cycle,
    epidemiologicalWeek: formData.epidemiologicalWeek,
    workModality: formData.workModality,
    startDate: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : '',
    endDate: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : '',
    totalProperties: parseInt(formData.qt_total) || 0,
    inspections: parseInt(formData.inspecionados) || 0,
    depositsEliminated: parseInt(formData.depositos_eliminados) || 0,
    depositsTreated: parseInt(formData.quantidade_depositos_tratados) || 0,
    supervisor: formData.nome_supervisor,
    qt_residencias: parseInt(formData.qt_residencias) || 0,
    qt_comercio: parseInt(formData.qt_comercio) || 0,
    qt_terreno_baldio: parseInt(formData.qt_terreno_baldio) || 0,
    qt_pe: parseInt(formData.qt_pe) || 0,
    qt_outros: parseInt(formData.qt_outros) || 0,
    qt_total: parseInt(formData.qt_total) || 0,
    tratamento_focal: parseInt(formData.tratamento_focal) || 0,
    tratamento_perifocal: parseInt(formData.tratamento_perifocal) || 0,
    amostras_coletadas: parseInt(formData.amostras_coletadas) || 0,
    recusa: parseInt(formData.recusa) || 0,
    fechadas: parseInt(formData.fechadas) || 0,
    recuperadas: parseInt(formData.recuperadas) || 0,
    a1: parseInt(formData.a1) || 0,
    a2: parseInt(formData.a2) || 0,
    b: parseInt(formData.b) || 0,
    c: parseInt(formData.c) || 0,
    d1: parseInt(formData.d1) || 0,
    d2: parseInt(formData.d2) || 0,
    e: parseInt(formData.e) || 0,
    larvicida: formData.larvicida,
    quantidade_larvicida: parseInt(formData.quantidade_larvicida) || 0,
    quantidade_depositos_tratados: parseInt(formData.quantidade_depositos_tratados) || 0,
    adulticida: formData.adulticida,
    quantidade_cargas: parseInt(formData.quantidade_cargas) || 0,
    total_tec_saude: parseInt(formData.total_tec_saude) || 0,
    total_dias_trabalhados: parseInt(formData.total_dias_trabalhados) || 0
  };
  
  try {
    // ID de usuário fixo para demonstração - na implementação real, seria o ID do usuário autenticado
    const userId = '00000000-0000-0000-0000-000000000000';
    
    // Verificar e obter o ID da localidade de forma mais robusta
    console.log("Buscando localidade:", formData.locality);
    
    // Tentar obter ou criar a localidade
    let localityId = null;
    let maxRetries = 3;
    let retryCount = 0;
    
    while (localityId === null && retryCount < maxRetries) {
      try {
        // Primeiro, tentamos buscar a localidade pelo nome exato
        const { data: existingLocalities, error: searchError } = await supabase
          .from('localities')
          .select('id')
          .eq('name', formData.locality);
        
        console.log("Resultado da busca por localidade:", existingLocalities, searchError);
        
        if (searchError) {
          console.error("Erro ao buscar localidade:", searchError);
          // Continuar com a lógica em caso de erro - tentaremos criar
        }
        
        // Se encontramos a localidade, usar o ID
        if (existingLocalities && existingLocalities.length > 0) {
          localityId = existingLocalities[0].id;
          console.log("Localidade encontrada com ID:", localityId);
        } else {
          // Se não encontramos, criar nova localidade
          console.log("Localidade não encontrada, criando nova:", formData.locality);
          
          const { data: newLocality, error: insertError } = await supabase
            .from('localities')
            .insert([{ name: formData.locality }])
            .select('id');
          
          if (insertError) {
            console.error("Erro ao criar localidade:", insertError);
            throw insertError;
          }
          
          if (newLocality && newLocality.length > 0) {
            localityId = newLocality[0].id;
            console.log("Nova localidade criada com ID:", localityId);
          } else {
            throw new Error("Falha ao criar localidade: sem retorno de dados");
          }
        }
      } catch (error) {
        console.error(`Tentativa ${retryCount + 1} falhou:`, error);
        retryCount++;
        
        // Pequeno atraso entre tentativas
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Se não conseguimos um ID de localidade após todas as tentativas, usar fallback para localStorage
    if (localityId === null) {
      console.error("Não foi possível obter ou criar ID de localidade após várias tentativas");
      throw new Error("Falha ao processar localidade após múltiplas tentativas");
    }
    
    // Garantir que as datas estejam formatadas corretamente
    const startDate = formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null;
    const endDate = formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null;
    
    if (!startDate || !endDate) {
      throw new Error('Datas de início e fim são obrigatórias');
    }
    
    // Preparar dados para inserção
    const insertData = {
      municipality: vectorData.municipality,
      locality_id: localityId,
      cycle: vectorData.cycle,
      epidemiological_week: vectorData.epidemiologicalWeek,
      work_modality: vectorData.workModality,
      start_date: startDate,
      end_date: endDate,
      total_properties: vectorData.totalProperties,
      inspections: vectorData.inspections,
      deposits_eliminated: vectorData.depositsEliminated,
      deposits_treated: vectorData.depositsTreated,
      supervisor: userId, // Usar ID fixo para demonstração
      qt_residencias: vectorData.qt_residencias,
      qt_comercio: vectorData.qt_comercio,
      qt_terreno_baldio: vectorData.qt_terreno_baldio,
      qt_pe: vectorData.qt_pe,
      qt_outros: vectorData.qt_outros,
      qt_total: vectorData.qt_total,
      tratamento_focal: vectorData.tratamento_focal,
      tratamento_perifocal: vectorData.tratamento_perifocal,
      amostras_coletadas: vectorData.amostras_coletadas,
      recusa: vectorData.recusa,
      fechadas: vectorData.fechadas,
      recuperadas: vectorData.recuperadas,
      a1: vectorData.a1,
      a2: vectorData.a2,
      b: vectorData.b,
      c: vectorData.c,
      d1: vectorData.d1,
      d2: vectorData.d2,
      e: vectorData.e,
      larvicida: vectorData.larvicida,
      quantidade_larvicida: vectorData.quantidade_larvicida,
      quantidade_depositos_tratados: vectorData.quantidade_depositos_tratados,
      adulticida: vectorData.adulticida,
      quantidade_cargas: vectorData.quantidade_cargas,
      total_tec_saude: vectorData.total_tec_saude,
      total_dias_trabalhados: vectorData.total_dias_trabalhados,
      created_by: userId
    };
    
    console.log("Dados para inserção:", insertData);
    
    // Inserir dados no Supabase
    const { data, error } = await supabase
      .from('vector_data')
      .insert([insertData]);
    
    if (error) {
      console.error('Erro ao inserir dados no Supabase:', error);
      toast.error(`Erro ao salvar no banco de dados: ${error.message}`);
      
      // Fallback para armazenamento local
      await saveVectorData([vectorData]);
      toast.warning('Dados salvos localmente como backup');
    } else {
      console.log('Dados inseridos com sucesso no Supabase:', data);
      toast.success('Dados salvos com sucesso no banco de dados');
    }
  } catch (error: any) {
    console.error('Erro na operação do Supabase:', error);
    toast.error('Erro ao salvar os dados. Verifique sua conexão e tente novamente.');
    
    // Fallback para localStorage
    await saveVectorData([vectorData]);
    toast.warning('Dados salvos localmente como backup');
  }
  
  // Gerar resumo a partir de dados vetoriais
  const summary = generateSummary(formData);
  
  return { vectorData, summary };
};

// Função auxiliar para gerar resumo
const generateSummary = (formData: FormData): string => {
  return `Resumo para ${formData.municipality}, ${formData.locality}, durante o ciclo ${formData.cycle} (semana epidemiológica ${formData.epidemiologicalWeek}). Período: ${formData.startDate ? format(formData.startDate, 'dd/MM/yyyy') : 'N/A'} a ${formData.endDate ? format(formData.endDate, 'dd/MM/yyyy') : 'N/A'}. Total de imóveis: ${formData.qt_total}. Depósitos eliminados: ${formData.depositos_eliminados || 0}. Depósitos tratados: ${formData.quantidade_depositos_tratados || 0}. Supervisor: ${formData.nome_supervisor || 'N/A'}.`;
};
