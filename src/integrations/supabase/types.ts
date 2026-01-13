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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      case_profiles: {
        Row: {
          claim_tags: string[]
          created_at: string
          date_end: string | null
          date_start: string | null
          description: string | null
          entity: string
          entity_type: string | null
          id: string
          is_seed_data: boolean | null
          location_city: string | null
          location_county: string | null
          location_state: string | null
          pattern_notes: string | null
          pattern_strength:
            | Database["public"]["Enums"]["pattern_strength"]
            | null
          system: Database["public"]["Enums"]["civil_rights_system"]
          updated_at: string
          user_id: string
        }
        Insert: {
          claim_tags?: string[]
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          entity: string
          entity_type?: string | null
          id?: string
          is_seed_data?: boolean | null
          location_city?: string | null
          location_county?: string | null
          location_state?: string | null
          pattern_notes?: string | null
          pattern_strength?:
            | Database["public"]["Enums"]["pattern_strength"]
            | null
          system: Database["public"]["Enums"]["civil_rights_system"]
          updated_at?: string
          user_id: string
        }
        Update: {
          claim_tags?: string[]
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          entity?: string
          entity_type?: string | null
          id?: string
          is_seed_data?: boolean | null
          location_city?: string | null
          location_county?: string | null
          location_state?: string | null
          pattern_notes?: string | null
          pattern_strength?:
            | Database["public"]["Enums"]["pattern_strength"]
            | null
          system?: Database["public"]["Enums"]["civil_rights_system"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          created_at: string
          description: string | null
          document_date: string | null
          file_type: string | null
          file_url: string | null
          id: string
          people_involved: string | null
          relevance_notes: string | null
          source: string | null
          system_involved: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_date?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          people_involved?: string | null
          relevance_notes?: string | null
          source?: string | null
          system_involved?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_date?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          people_involved?: string | null
          relevance_notes?: string | null
          source?: string | null
          system_involved?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      known_patterns: {
        Row: {
          case_count: number | null
          claim_tags: string[]
          created_at: string
          description: string | null
          entity: string
          entity_type: string | null
          id: string
          is_verified: boolean | null
          pattern_type: string
          source: string | null
          source_url: string | null
          system: Database["public"]["Enums"]["civil_rights_system"]
          updated_at: string
        }
        Insert: {
          case_count?: number | null
          claim_tags?: string[]
          created_at?: string
          description?: string | null
          entity: string
          entity_type?: string | null
          id?: string
          is_verified?: boolean | null
          pattern_type: string
          source?: string | null
          source_url?: string | null
          system: Database["public"]["Enums"]["civil_rights_system"]
          updated_at?: string
        }
        Update: {
          case_count?: number | null
          claim_tags?: string[]
          created_at?: string
          description?: string | null
          entity?: string
          entity_type?: string | null
          id?: string
          is_verified?: boolean | null
          pattern_type?: string
          source?: string | null
          source_url?: string | null
          system?: Database["public"]["Enums"]["civil_rights_system"]
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      timeline_entries: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
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
      civil_rights_system:
        | "police"
        | "housing"
        | "cps_dcyf"
        | "schools"
        | "healthcare"
        | "benefits"
        | "courts"
        | "other"
      pattern_strength: "none" | "possible" | "strong" | "very_strong"
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
      civil_rights_system: [
        "police",
        "housing",
        "cps_dcyf",
        "schools",
        "healthcare",
        "benefits",
        "courts",
        "other",
      ],
      pattern_strength: ["none", "possible", "strong", "very_strong"],
    },
  },
} as const
