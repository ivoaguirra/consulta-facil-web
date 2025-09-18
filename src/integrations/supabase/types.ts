export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          clinica_id: string | null
          created_at: string | null
          data_agendamento: string
          duracao_minutos: number | null
          id: string
          medico_id: string
          observacoes: string | null
          paciente_id: string
          status: string | null
          tipo_consulta: string
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          clinica_id?: string | null
          created_at?: string | null
          data_agendamento: string
          duracao_minutos?: number | null
          id?: string
          medico_id: string
          observacoes?: string | null
          paciente_id: string
          status?: string | null
          tipo_consulta: string
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          clinica_id?: string | null
          created_at?: string | null
          data_agendamento?: string
          duracao_minutos?: number | null
          id?: string
          medico_id?: string
          observacoes?: string | null
          paciente_id?: string
          status?: string | null
          tipo_consulta?: string
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      clinicas: {
        Row: {
          ativo: boolean | null
          cnpj: string
          created_at: string | null
          email: string
          endereco: Json | null
          id: string
          nome: string
          responsavel_id: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cnpj: string
          created_at?: string | null
          email: string
          endereco?: Json | null
          id?: string
          nome: string
          responsavel_id?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cnpj?: string
          created_at?: string | null
          email?: string
          endereco?: Json | null
          id?: string
          nome?: string
          responsavel_id?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      consultas: {
        Row: {
          agendamento_id: string | null
          clinica_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          duracao_minutos: number | null
          gravacao_url: string | null
          id: string
          medico_id: string
          observacoes_medico: string | null
          observacoes_paciente: string | null
          paciente_id: string
          problemas_tecnicos: string | null
          qualidade_chamada: number | null
          status: string
          tipo_consulta: string
          updated_at: string
          valor: number | null
        }
        Insert: {
          agendamento_id?: string | null
          clinica_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          duracao_minutos?: number | null
          gravacao_url?: string | null
          id?: string
          medico_id: string
          observacoes_medico?: string | null
          observacoes_paciente?: string | null
          paciente_id: string
          problemas_tecnicos?: string | null
          qualidade_chamada?: number | null
          status?: string
          tipo_consulta: string
          updated_at?: string
          valor?: number | null
        }
        Update: {
          agendamento_id?: string | null
          clinica_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          duracao_minutos?: number | null
          gravacao_url?: string | null
          id?: string
          medico_id?: string
          observacoes_medico?: string | null
          observacoes_paciente?: string | null
          paciente_id?: string
          problemas_tecnicos?: string | null
          qualidade_chamada?: number | null
          status?: string
          tipo_consulta?: string
          updated_at?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ativo: boolean | null
          avatar_url: string | null
          clinica_id: string | null
          cpf: string | null
          created_at: string | null
          crm: string | null
          data_nascimento: string | null
          email: string
          endereco: Json | null
          especialidade: string | null
          id: string
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          avatar_url?: string | null
          clinica_id?: string | null
          cpf?: string | null
          created_at?: string | null
          crm?: string | null
          data_nascimento?: string | null
          email: string
          endereco?: Json | null
          especialidade?: string | null
          id: string
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          avatar_url?: string | null
          clinica_id?: string | null
          cpf?: string | null
          created_at?: string | null
          crm?: string | null
          data_nascimento?: string | null
          email?: string
          endereco?: Json | null
          especialidade?: string | null
          id?: string
          nome?: string
          role?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "paciente" | "medico" | "clinica"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["paciente", "medico", "clinica"],
    },
  },
} as const
