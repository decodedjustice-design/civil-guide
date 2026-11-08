import type { Tables } from "@/integrations/supabase/types";

/** Explicit projections verified against live metadata on 2026-11-08. */
export const CASE_COLUMNS = {
  evidence: "id,user_id,title,description,file_url,file_type,created_at,updated_at,document_date,source,system_involved,people_involved,relevance_notes,case_id,exhibit_number,classification,review_status,received_date,sensitive,include_in_export,tags,source_type,related_issue_id",
  timeline_entries: "id,user_id,title,description,event_date,created_at,updated_at,case_id,classification,category,importance,source_type,source_evidence_id,reviewed,disputed,reason,review_status",
  case_issues: "id,user_id,case_id,title,category,summary,who_made_allegation,allegation_date,classification,status,supporting_notes,contradicting_notes,missing_records,requested_remedy,next_action,source,origin,created_at,updated_at,review_status",
  case_people: "id,user_id,case_id,name,role,organization,contact,involvement,notes,created_at,updated_at,source_type,review_status",
  case_organizations: "id,user_id,case_id,name,org_type,contact,notes,created_at,updated_at,source_type,review_status",
  case_communications: "id,user_id,case_id,occurred_on,occurred_time,method,person,agency,subject,summary,requested,response,promises_made,follow_up_needed,follow_up_date,classification,notes,created_at,updated_at,source_type,review_status,related_issue_id",
  case_records_requests: "id,user_id,case_id,agency,request_title,description,request_method,date_sent,acknowledgement_date,due_date,status,tracking_number,outcome,notes,created_at,updated_at",
  case_record_gaps: "id,user_id,case_id,title,description,record_holder,status,related_issue_id,related_request_id,identified_at,requested_at,due_date,received_date,notes,source_type,review_status,created_at,updated_at",
  case_evidence_mentions: "id,user_id,case_id,evidence_type,description,approximate_date,priority,status,related_issue_id,source_type,review_status,created_at,updated_at",
  case_links: "id,user_id,case_id,from_type,from_id,to_type,to_id,relation,note,created_at",
  case_packets: "id,user_id,case_id,title,packet_type,sections,options,content,status,created_at,updated_at",
  notes: "id,user_id,title,content,created_at,updated_at,case_id",
} as const;
export type CaseTable = keyof typeof CASE_COLUMNS;
export type CaseRecord = Tables<CaseTable>;

export function casePayload(table: CaseTable, values: Record<string, unknown>, caseId: string, userId: string) {
  if (!caseId || !userId) throw new Error("No authenticated active case");
  const allowed = new Set(CASE_COLUMNS[table].split(","));
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (!allowed.has(key)) throw new Error(`Unsupported ${table} field: ${key}`);
    if (!["id", "user_id", "case_id", "created_at", "updated_at", "exhibit_number"].includes(key)) payload[key] = value;
  }
  return { ...payload, case_id: caseId, user_id: userId };
}

/** Undated suggestions stay in the narrative; never invent a required event date. */
export function narrativeEventDate(value?: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : null;
}
export const ANALYZER_CLASSIFICATION = "unknown" as const;
