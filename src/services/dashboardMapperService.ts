
import { LocalityData } from "@/types/dashboard";

/**
 * Helper function to map Supabase data to LocalityData format
 */
export const mapSupabaseDataToLocalityData = (data: any[]): LocalityData[] => {
  return data.map((item) => ({
    municipality: item.municipality,
    locality: item.locality_id,
    cycle: item.cycle,
    epidemiologicalWeek: item.epidemiological_week,
    workModality: item.work_modality,
    startDate: item.start_date,
    endDate: item.end_date,
    totalProperties: item.total_properties,
    inspections: item.inspections,
    depositsEliminated: item.deposits_eliminated,
    depositsTreated: item.deposits_treated,
    supervisor: item.supervisor,
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
    total_dias_trabalhados: item.total_dias_trabalhados
  }));
};
