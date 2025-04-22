export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_levels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          permissions: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permissions?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permissions?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      localities: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      locality_access: {
        Row: {
          created_at: string
          id: string
          locality_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          locality_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          locality_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "locality_access_locality_id_fkey"
            columns: ["locality_id"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locality_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_level_id: string | null
          active: boolean | null
          created_at: string
          id: string
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          access_level_id?: string | null
          active?: boolean | null
          created_at?: string
          id: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          access_level_id?: string | null
          active?: boolean | null
          created_at?: string
          id?: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_access_level_id_fkey"
            columns: ["access_level_id"]
            isOneToOne: false
            referencedRelation: "access_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_data: {
        Row: {
          a1: number
          a2: number
          adulticida: string | null
          amostras_coletadas: number
          b: number
          c: number
          created_at: string
          created_by: string | null
          cycle: string
          d1: number
          d2: number
          deposits_eliminated: number
          deposits_treated: number
          e: number
          end_date: string
          epidemiological_week: string
          fechadas: number
          id: string
          inspections: number
          larvicida: string | null
          locality_id: string
          municipality: string
          qt_comercio: number
          qt_outros: number
          qt_pe: number
          qt_residencias: number
          qt_terreno_baldio: number
          qt_total: number
          quantidade_cargas: number
          quantidade_depositos_tratados: number
          quantidade_larvicida: number
          recuperadas: number
          recusa: number
          start_date: string
          supervisor: string | null
          total_dias_trabalhados: number
          total_properties: number
          total_tec_saude: number
          tratamento_focal: number
          tratamento_perifocal: number
          updated_at: string
          work_modality: string
        }
        Insert: {
          a1?: number
          a2?: number
          adulticida?: string | null
          amostras_coletadas?: number
          b?: number
          c?: number
          created_at?: string
          created_by?: string | null
          cycle: string
          d1?: number
          d2?: number
          deposits_eliminated: number
          deposits_treated: number
          e?: number
          end_date: string
          epidemiological_week: string
          fechadas?: number
          id?: string
          inspections: number
          larvicida?: string | null
          locality_id: string
          municipality: string
          qt_comercio?: number
          qt_outros?: number
          qt_pe?: number
          qt_residencias?: number
          qt_terreno_baldio?: number
          qt_total?: number
          quantidade_cargas?: number
          quantidade_depositos_tratados?: number
          quantidade_larvicida?: number
          recuperadas?: number
          recusa?: number
          start_date: string
          supervisor?: string | null
          total_dias_trabalhados?: number
          total_properties: number
          total_tec_saude?: number
          tratamento_focal?: number
          tratamento_perifocal?: number
          updated_at?: string
          work_modality: string
        }
        Update: {
          a1?: number
          a2?: number
          adulticida?: string | null
          amostras_coletadas?: number
          b?: number
          c?: number
          created_at?: string
          created_by?: string | null
          cycle?: string
          d1?: number
          d2?: number
          deposits_eliminated?: number
          deposits_treated?: number
          e?: number
          end_date?: string
          epidemiological_week?: string
          fechadas?: number
          id?: string
          inspections?: number
          larvicida?: string | null
          locality_id?: string
          municipality?: string
          qt_comercio?: number
          qt_outros?: number
          qt_pe?: number
          qt_residencias?: number
          qt_terreno_baldio?: number
          qt_total?: number
          quantidade_cargas?: number
          quantidade_depositos_tratados?: number
          quantidade_larvicida?: number
          recuperadas?: number
          recusa?: number
          start_date?: string
          supervisor?: string | null
          total_dias_trabalhados?: number
          total_properties?: number
          total_tec_saude?: number
          tratamento_focal?: number
          tratamento_perifocal?: number
          updated_at?: string
          work_modality?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_data_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vector_data_locality_id_fkey"
            columns: ["locality_id"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vector_data_supervisor_fkey"
            columns: ["supervisor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_localities: {
        Args: { p_user_id: string; p_locality_ids: string[] }
        Returns: boolean
      }
      create_demo_user: {
        Args: { user_email: string; user_password: string; user_data?: Json }
        Returns: string
      }
      create_or_update_profile: {
        Args: {
          p_id: string
          p_username: string
          p_role: string
          p_active: boolean
          p_access_level_id: string
        }
        Returns: boolean
      }
      delete_user_and_profile: {
        Args: { user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
