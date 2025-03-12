
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          role: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          role?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          role?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      localities: {
        Row: {
          id: string
          name: string
          created_at: string
          active: boolean
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          active?: boolean
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          active?: boolean
        }
      }
      locality_access: {
        Row: {
          id: string
          user_id: string
          locality_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          locality_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          locality_id?: string
          created_at?: string
        }
      }
      vector_data: {
        Row: {
          id: string
          municipality: string
          locality_id: string
          cycle: string
          epidemiological_week: string
          work_modality: string
          start_date: string
          end_date: string
          total_properties: number
          inspections: number
          deposits_eliminated: number
          deposits_treated: number
          supervisor: string
          qt_residencias: number
          qt_comercio: number
          qt_terreno_baldio: number
          qt_pe: number
          qt_outros: number
          qt_total: number
          tratamento_focal: number
          tratamento_perifocal: number
          amostras_coletadas: number
          recusa: number
          fechadas: number
          recuperadas: number
          a1: number
          a2: number
          b: number
          c: number
          d1: number
          d2: number
          e: number
          larvicida: string | null
          quantidade_larvicida: number
          quantidade_depositos_tratados: number
          adulticida: string | null
          quantidade_cargas: number
          total_tec_saude: number
          total_dias_trabalhados: number
          created_at: string
          created_by: string
          updated_at: string
        }
        Insert: {
          id?: string
          municipality: string
          locality_id: string
          cycle: string
          epidemiological_week: string
          work_modality: string
          start_date: string
          end_date: string
          total_properties: number
          inspections: number
          deposits_eliminated: number
          deposits_treated: number
          supervisor: string
          qt_residencias?: number
          qt_comercio?: number
          qt_terreno_baldio?: number
          qt_pe?: number
          qt_outros?: number
          qt_total?: number
          tratamento_focal?: number
          tratamento_perifocal?: number
          amostras_coletadas?: number
          recusa?: number
          fechadas?: number
          recuperadas?: number
          a1?: number
          a2?: number
          b?: number
          c?: number
          d1?: number
          d2?: number
          e?: number
          larvicida?: string | null
          quantidade_larvicida?: number
          quantidade_depositos_tratados?: number
          adulticida?: string | null
          quantidade_cargas?: number
          total_tec_saude?: number
          total_dias_trabalhados?: number
          created_at?: string
          created_by: string
          updated_at?: string
        }
        Update: {
          id?: string
          municipality?: string
          locality_id?: string
          cycle?: string
          epidemiological_week?: string
          work_modality?: string
          start_date?: string
          end_date?: string
          total_properties?: number
          inspections?: number
          deposits_eliminated?: number
          deposits_treated?: number
          supervisor?: string
          qt_residencias?: number
          qt_comercio?: number
          qt_terreno_baldio?: number
          qt_pe?: number
          qt_outros?: number
          qt_total?: number
          tratamento_focal?: number
          tratamento_perifocal?: number
          amostras_coletadas?: number
          recusa?: number
          fechadas?: number
          recuperadas?: number
          a1?: number
          a2?: number
          b?: number
          c?: number
          d1?: number
          d2?: number
          e?: number
          larvicida?: string | null
          quantidade_larvicida?: number
          quantidade_depositos_tratados?: number
          adulticida?: string | null
          quantidade_cargas?: number
          total_tec_saude?: number
          total_dias_trabalhados?: number
          created_at?: string
          created_by?: string
          updated_at?: string
        }
      }
    }
  }
}
