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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_extractions: {
        Row: {
          ai_run_id: string
          case_id: string
          created_at: string
          id: string
          payload: Json
          validation_status: string
        }
        Insert: {
          ai_run_id: string
          case_id: string
          created_at?: string
          id?: string
          payload: Json
          validation_status: string
        }
        Update: {
          ai_run_id?: string
          case_id?: string
          created_at?: string
          id?: string
          payload?: Json
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_extractions_ai_run_id_fkey"
            columns: ["ai_run_id"]
            isOneToOne: false
            referencedRelation: "ai_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_extractions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_runs: {
        Row: {
          case_id: string
          completed_at: string | null
          consented_at: string | null
          created_at: string
          created_by: string
          document_version_id: string | null
          failure_code: string | null
          id: string
          input_fingerprint: string | null
          model: string | null
          operation: string
          prompt_version: string | null
          provider: string | null
          schema_version: string | null
          status: Database["public"]["Enums"]["ai_run_status"]
        }
        Insert: {
          case_id: string
          completed_at?: string | null
          consented_at?: string | null
          created_at?: string
          created_by: string
          document_version_id?: string | null
          failure_code?: string | null
          id?: string
          input_fingerprint?: string | null
          model?: string | null
          operation: string
          prompt_version?: string | null
          provider?: string | null
          schema_version?: string | null
          status?: Database["public"]["Enums"]["ai_run_status"]
        }
        Update: {
          case_id?: string
          completed_at?: string | null
          consented_at?: string | null
          created_at?: string
          created_by?: string
          document_version_id?: string | null
          failure_code?: string | null
          id?: string
          input_fingerprint?: string | null
          model?: string | null
          operation?: string
          prompt_version?: string | null
          provider?: string | null
          schema_version?: string | null
          status?: Database["public"]["Enums"]["ai_run_status"]
        }
        Relationships: [
          {
            foreignKeyName: "ai_runs_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_runs_document_version_id_fkey"
            columns: ["document_version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          case_id: string | null
          id: string
          metadata: Json
          occurred_at: string
          request_id: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          case_id?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          request_id?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          case_id?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          request_id?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_memberships: {
        Row: {
          active: boolean
          case_id: string
          created_at: string
          granted_by: string
          id: string
          revoked_at: string | null
          role: Database["public"]["Enums"]["membership_role"]
          user_id: string
        }
        Insert: {
          active?: boolean
          case_id: string
          created_at?: string
          granted_by: string
          id?: string
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["membership_role"]
          user_id: string
        }
        Update: {
          active?: boolean
          case_id?: string
          created_at?: string
          granted_by?: string
          id?: string
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["membership_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_memberships_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_numbers: {
        Row: {
          case_id: string
          created_at: string
          id: string
          label: string | null
          number: string
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          label?: string | null
          number: string
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          label?: string | null
          number?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_numbers_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          created_at: string
          id: string
          jurisdiction: string
          matter_type: string
          owner_user_id: string
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jurisdiction?: string
          matter_type?: string
          owner_user_id: string
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jurisdiction?: string
          matter_type?: string
          owner_user_id?: string
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      claims: {
        Row: {
          case_id: string
          classification: string
          confidence: number | null
          created_at: string
          id: string
          statement: string
          updated_at: string
        }
        Insert: {
          case_id: string
          classification?: string
          confidence?: number | null
          created_at?: string
          id?: string
          statement: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          classification?: string
          confidence?: number | null
          created_at?: string
          id?: string
          statement?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      document_derivatives: {
        Row: {
          case_id: string
          created_at: string
          derivative_type: string
          document_version_id: string
          id: string
          producer: string
          producer_version: string
          sha256: string | null
          storage_bucket: string | null
          storage_object_key: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          derivative_type: string
          document_version_id: string
          id?: string
          producer: string
          producer_version: string
          sha256?: string | null
          storage_bucket?: string | null
          storage_object_key?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          derivative_type?: string
          document_version_id?: string
          id?: string
          producer?: string
          producer_version?: string
          sha256?: string | null
          storage_bucket?: string | null
          storage_object_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_derivatives_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_derivatives_document_version_id_fkey"
            columns: ["document_version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          byte_size: number
          captured_at: string
          case_id: string
          created_at: string
          document_id: string
          id: string
          ingest_status: Database["public"]["Enums"]["ingest_status"]
          mime_type: string
          original_filename: string
          sha256: string
          storage_bucket: string
          storage_object_key: string
          uploader: string
          version_no: number
        }
        Insert: {
          byte_size: number
          captured_at?: string
          case_id: string
          created_at?: string
          document_id: string
          id?: string
          ingest_status?: Database["public"]["Enums"]["ingest_status"]
          mime_type: string
          original_filename: string
          sha256: string
          storage_bucket?: string
          storage_object_key: string
          uploader: string
          version_no: number
        }
        Update: {
          byte_size?: number
          captured_at?: string
          case_id?: string
          created_at?: string
          document_id?: string
          id?: string
          ingest_status?: Database["public"]["Enums"]["ingest_status"]
          mime_type?: string
          original_filename?: string
          sha256?: string
          storage_bucket?: string
          storage_object_key?: string
          uploader?: string
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          case_id: string
          created_at: string
          created_by: string
          display_filename: string
          document_type: string
          id: string
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          created_by: string
          display_filename: string
          document_type: string
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          created_by?: string
          display_filename?: string
          document_type?: string
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          case_id: string
          classification: string
          created_at: string
          description: string | null
          id: string
          occurred_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          case_id: string
          classification?: string
          created_at?: string
          description?: string | null
          id?: string
          occurred_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          classification?: string
          created_at?: string
          description?: string | null
          id?: string
          occurred_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_locators: {
        Row: {
          case_id: string
          created_at: string
          document_version_id: string
          extracted_text_id: string | null
          id: string
          locator_hash: string
          page_number: number | null
          quoted_text: string | null
          text_end: number | null
          text_start: number | null
        }
        Insert: {
          case_id: string
          created_at?: string
          document_version_id: string
          extracted_text_id?: string | null
          id?: string
          locator_hash: string
          page_number?: number | null
          quoted_text?: string | null
          text_end?: number | null
          text_start?: number | null
        }
        Update: {
          case_id?: string
          created_at?: string
          document_version_id?: string
          extracted_text_id?: string | null
          id?: string
          locator_hash?: string
          page_number?: number | null
          quoted_text?: string | null
          text_end?: number | null
          text_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_locators_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_locators_document_version_id_fkey"
            columns: ["document_version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_locators_extracted_text_id_fkey"
            columns: ["extracted_text_id"]
            isOneToOne: false
            referencedRelation: "extracted_text"
            referencedColumns: ["id"]
          },
        ]
      }
      extracted_text: {
        Row: {
          case_id: string
          created_at: string
          derivative_id: string | null
          document_version_id: string
          extraction_method: string
          extraction_status: Database["public"]["Enums"]["processing_status"]
          extractor_version: string
          id: string
          language_code: string | null
          normalized_text: string
          page_mapping: Json | null
          text_sha256: string
        }
        Insert: {
          case_id: string
          created_at?: string
          derivative_id?: string | null
          document_version_id: string
          extraction_method: string
          extraction_status?: Database["public"]["Enums"]["processing_status"]
          extractor_version: string
          id?: string
          language_code?: string | null
          normalized_text: string
          page_mapping?: Json | null
          text_sha256: string
        }
        Update: {
          case_id?: string
          created_at?: string
          derivative_id?: string | null
          document_version_id?: string
          extraction_method?: string
          extraction_status?: Database["public"]["Enums"]["processing_status"]
          extractor_version?: string
          id?: string
          language_code?: string | null
          normalized_text?: string
          page_mapping?: Json | null
          text_sha256?: string
        }
        Relationships: [
          {
            foreignKeyName: "extracted_text_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extracted_text_derivative_id_fkey"
            columns: ["derivative_id"]
            isOneToOne: false
            referencedRelation: "document_derivatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extracted_text_document_version_id_fkey"
            columns: ["document_version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          case_id: string
          created_at: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          case_id: string
          created_at: string
          display_name: string
          id: string
          role_label: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          display_name: string
          id?: string
          role_label?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          display_name?: string
          id?: string
          role_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_runs: {
        Row: {
          case_id: string
          created_at: string
          created_by: string
          document_version_id: string
          extractor_version: string | null
          failure_code: string | null
          finished_at: string | null
          id: string
          input_fingerprint: string
          operation: string
          started_at: string | null
          status: Database["public"]["Enums"]["processing_status"]
        }
        Insert: {
          case_id: string
          created_at?: string
          created_by: string
          document_version_id: string
          extractor_version?: string | null
          failure_code?: string | null
          finished_at?: string | null
          id?: string
          input_fingerprint: string
          operation: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["processing_status"]
        }
        Update: {
          case_id?: string
          created_at?: string
          created_by?: string
          document_version_id?: string
          extractor_version?: string | null
          failure_code?: string | null
          finished_at?: string | null
          id?: string
          input_fingerprint?: string
          operation?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["processing_status"]
        }
        Relationships: [
          {
            foreignKeyName: "processing_runs_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processing_runs_document_version_id_fkey"
            columns: ["document_version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      record_versions: {
        Row: {
          case_id: string
          change_reason: string | null
          changed_by: string
          created_at: string
          id: string
          snapshot: Json
          subject_id: string
          subject_type: string
          version_no: number
        }
        Insert: {
          case_id: string
          change_reason?: string | null
          changed_by: string
          created_at?: string
          id?: string
          snapshot: Json
          subject_id: string
          subject_type: string
          version_no: number
        }
        Update: {
          case_id?: string
          change_reason?: string | null
          changed_by?: string
          created_at?: string
          id?: string
          snapshot?: Json
          subject_id?: string
          subject_type?: string
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "record_versions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      review_decisions: {
        Row: {
          case_id: string
          decided_at: string
          decided_by: string
          decision: Database["public"]["Enums"]["review_decision_type"]
          id: string
          new_value: Json | null
          previous_value: Json | null
          rationale: string | null
          source_locator_id: string | null
          subject_id: string
          subject_type: string
        }
        Insert: {
          case_id: string
          decided_at?: string
          decided_by: string
          decision: Database["public"]["Enums"]["review_decision_type"]
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
          rationale?: string | null
          source_locator_id?: string | null
          subject_id: string
          subject_type: string
        }
        Update: {
          case_id?: string
          decided_at?: string
          decided_by?: string
          decision?: Database["public"]["Enums"]["review_decision_type"]
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
          rationale?: string | null
          source_locator_id?: string | null
          subject_id?: string
          subject_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_decisions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_decisions_source_locator_id_fkey"
            columns: ["source_locator_id"]
            isOneToOne: false
            referencedRelation: "evidence_locators"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          case_id: string
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ai_run_status:
        | "not_requested"
        | "requested"
        | "completed"
        | "unavailable"
        | "failed"
      case_status: "active" | "archived"
      document_status:
        | "uploaded"
        | "extracted"
        | "ai_analyzed"
        | "user_reviewed"
        | "failed"
        | "unsupported"
      ingest_status:
        | "pending"
        | "uploaded"
        | "extracting"
        | "extracted"
        | "failed"
        | "unsupported"
      membership_role: "owner"
      processing_status:
        | "requested"
        | "running"
        | "completed"
        | "failed"
        | "unsupported"
      review_decision_type:
        | "accept"
        | "correct"
        | "reject"
        | "defer"
        | "mark_disputed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      ai_run_status: [
        "not_requested",
        "requested",
        "completed",
        "unavailable",
        "failed",
      ],
      case_status: ["active", "archived"],
      document_status: [
        "uploaded",
        "extracted",
        "ai_analyzed",
        "user_reviewed",
        "failed",
        "unsupported",
      ],
      ingest_status: [
        "pending",
        "uploaded",
        "extracting",
        "extracted",
        "failed",
        "unsupported",
      ],
      membership_role: ["owner"],
      processing_status: [
        "requested",
        "running",
        "completed",
        "failed",
        "unsupported",
      ],
      review_decision_type: [
        "accept",
        "correct",
        "reject",
        "defer",
        "mark_disputed",
      ],
    },
  },
} as const
