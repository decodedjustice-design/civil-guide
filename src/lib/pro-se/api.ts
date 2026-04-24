import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export interface ProSeCaseRow {
  id: string;
  user_id: string;
  intake_data: Record<string, any>;
  created_at: string;
}

export interface ProSeAttorneyContact {
  id?: string;
  case_id: string;
  name: string;
  outcome: string;
  date: string;
}

export interface ProSeLegalAidContact {
  id?: string;
  case_id: string;
  org_name: string;
  result: string;
}

export interface ProSeEvidenceFile {
  id?: string;
  case_id: string;
  category: string;
  file_url: string;
  metadata?: Record<string, any>;
}

export const proSeApi = {
  async getOrCreateCase(userId: string): Promise<ProSeCaseRow> {
    const { data: existing } = await db
      .from("pro_se_cases")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) return existing;

    const { data, error } = await db
      .from("pro_se_cases")
      .insert({ user_id: userId, intake_data: {} })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async updateCaseIntake(caseId: string, intakeData: Record<string, any>) {
    const { error } = await db
      .from("pro_se_cases")
      .update({ intake_data: intakeData })
      .eq("id", caseId);

    if (error) throw error;
  },

  async listAttorneyContacts(caseId: string) {
    const { data, error } = await db
      .from("pro_se_attorney_contacts")
      .select("*")
      .eq("case_id", caseId)
      .order("date", { ascending: false });

    if (error) throw error;
    return (data ?? []) as ProSeAttorneyContact[];
  },

  async addAttorneyContact(payload: ProSeAttorneyContact) {
    const { error } = await db.from("pro_se_attorney_contacts").insert(payload);
    if (error) throw error;
  },

  async listLegalAidContacts(caseId: string) {
    const { data, error } = await db
      .from("pro_se_legal_aid_contacts")
      .select("*")
      .eq("case_id", caseId);

    if (error) throw error;
    return (data ?? []) as ProSeLegalAidContact[];
  },

  async addLegalAidContact(payload: ProSeLegalAidContact) {
    const { error } = await db.from("pro_se_legal_aid_contacts").insert(payload);
    if (error) throw error;
  },

  async listEvidenceFiles(caseId: string) {
    const { data, error } = await db
      .from("pro_se_evidence_files")
      .select("*")
      .eq("case_id", caseId)
      .order("id", { ascending: false });

    if (error) throw error;
    return (data ?? []) as ProSeEvidenceFile[];
  },

  async addEvidenceFile(payload: ProSeEvidenceFile) {
    const { error } = await db.from("pro_se_evidence_files").insert(payload);
    if (error) throw error;
  },
};
