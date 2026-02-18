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
      analyzer_results: {
        Row: {
          answers: Json
          common_stuck_points: string | null
          created_at: string
          decision_makers: string | null
          entity_name: string | null
          id: string
          linked_guide_id: string | null
          pattern_strength: string
          system: string
          system_controls: string | null
          system_does_not_control: string | null
          system_label: string
          updated_at: string
          user_id: string
          what_people_misinterpret: string[] | null
          what_usually_happens: string[] | null
        }
        Insert: {
          answers?: Json
          common_stuck_points?: string | null
          created_at?: string
          decision_makers?: string | null
          entity_name?: string | null
          id?: string
          linked_guide_id?: string | null
          pattern_strength?: string
          system: string
          system_controls?: string | null
          system_does_not_control?: string | null
          system_label: string
          updated_at?: string
          user_id: string
          what_people_misinterpret?: string[] | null
          what_usually_happens?: string[] | null
        }
        Update: {
          answers?: Json
          common_stuck_points?: string | null
          created_at?: string
          decision_makers?: string | null
          entity_name?: string | null
          id?: string
          linked_guide_id?: string | null
          pattern_strength?: string
          system?: string
          system_controls?: string | null
          system_does_not_control?: string | null
          system_label?: string
          updated_at?: string
          user_id?: string
          what_people_misinterpret?: string[] | null
          what_usually_happens?: string[] | null
        }
        Relationships: []
      }
      attorney_contacts: {
        Row: {
          attorney_firm: string | null
          attorney_id: string
          attorney_name: string
          contact_date: string
          contact_method: string | null
          created_at: string
          id: string
          intake_packet_id: string | null
          notes: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attorney_firm?: string | null
          attorney_id: string
          attorney_name: string
          contact_date?: string
          contact_method?: string | null
          created_at?: string
          id?: string
          intake_packet_id?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attorney_firm?: string | null
          attorney_id?: string
          attorney_name?: string
          contact_date?: string
          contact_method?: string | null
          created_at?: string
          id?: string
          intake_packet_id?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attorney_contacts_intake_packet_id_fkey"
            columns: ["intake_packet_id"]
            isOneToOne: false
            referencedRelation: "intake_packets"
            referencedColumns: ["id"]
          },
        ]
      }
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
      clarion_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
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
      intake_packets: {
        Row: {
          attorney_firm: string | null
          attorney_id: string | null
          attorney_name: string | null
          case_name: string
          case_status: string
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          contact_preferred_method: string | null
          county: string
          created_at: string
          evidence_snapshot: Json | null
          id: string
          incident_date: string | null
          incident_month_year: string
          issue_type: string
          issues_checklist: string[] | null
          narrative: string
          opposing_party: string
          statute_of_limitations_info: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attorney_firm?: string | null
          attorney_id?: string | null
          attorney_name?: string | null
          case_name: string
          case_status: string
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          contact_preferred_method?: string | null
          county: string
          created_at?: string
          evidence_snapshot?: Json | null
          id?: string
          incident_date?: string | null
          incident_month_year: string
          issue_type: string
          issues_checklist?: string[] | null
          narrative: string
          opposing_party: string
          statute_of_limitations_info?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attorney_firm?: string | null
          attorney_id?: string | null
          attorney_name?: string | null
          case_name?: string
          case_status?: string
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          contact_preferred_method?: string | null
          county?: string
          created_at?: string
          evidence_snapshot?: Json | null
          id?: string
          incident_date?: string | null
          incident_month_year?: string
          issue_type?: string
          issues_checklist?: string[] | null
          narrative?: string
          opposing_party?: string
          statute_of_limitations_info?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      justice_place_bookmarks: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          resource_id: string
          resource_title: string
          resource_type: string
          resource_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          resource_id: string
          resource_title: string
          resource_type: string
          resource_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          resource_id?: string
          resource_title?: string
          resource_type?: string
          resource_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      justice_place_cases: {
        Row: {
          case_name: string
          case_status: Database["public"]["Enums"]["case_status"]
          county: string
          created_at: string
          id: string
          incident_month_year: string | null
          issue_type: string
          state: string
          unlock_flags: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          case_name?: string
          case_status?: Database["public"]["Enums"]["case_status"]
          county: string
          created_at?: string
          id?: string
          incident_month_year?: string | null
          issue_type: string
          state?: string
          unlock_flags?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          case_name?: string
          case_status?: Database["public"]["Enums"]["case_status"]
          county?: string
          created_at?: string
          id?: string
          incident_month_year?: string | null
          issue_type?: string
          state?: string
          unlock_flags?: Json | null
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
      case_status:
        | "getting_oriented"
        | "gathering_information"
        | "preparing_outreach"
        | "awaiting_responses"
        | "reviewing_options"
        | "taking_next_steps"
        | "on_hold"
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
      case_status: [
        "getting_oriented",
        "gathering_information",
        "preparing_outreach",
        "awaiting_responses",
        "reviewing_options",
        "taking_next_steps",
        "on_hold",
      ],
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
