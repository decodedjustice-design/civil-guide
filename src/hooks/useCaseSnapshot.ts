import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CASE_COLUMNS, type CaseTable } from "@/lib/case/schema";
import type { Tables } from "@/integrations/supabase/types";

export interface CaseSnapshot {
  evidence: Tables<"evidence">[];
  timeline: Tables<"timeline_entries">[];
  issues: Tables<"case_issues">[];
  people: Tables<"case_people">[];
  organizations: Tables<"case_organizations">[];
  communications: Tables<"case_communications">[];
  requests: Tables<"case_records_requests">[];
  record_gaps: Tables<"case_record_gaps">[];
  evidence_mentions: Tables<"case_evidence_mentions">[];
  notes: Tables<"notes">[];
  links: Tables<"case_links">[];
  packets: Tables<"case_packets">[];
}
const empty: CaseSnapshot = {
  evidence: [], timeline: [], issues: [], people: [], organizations: [], communications: [],
  requests: [], record_gaps: [], evidence_mentions: [], notes: [], links: [], packets: [],
};
export function useCaseSnapshot(caseId?: string) {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["case-snapshot", caseId, user?.id],
    enabled: !!caseId && !!user,
    queryFn: async (): Promise<CaseSnapshot> => {
      if (!caseId || !user) return empty;
      const load = async <T extends CaseTable>(table: T, order: string): Promise<Tables<T>[]> => {
        const { data, error } = await supabase.from(table).select(CASE_COLUMNS[table])
          .eq("case_id", caseId).eq("user_id", user.id)
          .order(order, { ascending: true, nullsFirst: false });
        if (error) throw error;
        return (data ?? []) as unknown as Tables<T>[];
      };
      const [evidence, timeline, issues, people, organizations, communications, requests, record_gaps, evidence_mentions, notes, links, packets] = await Promise.all([
        load("evidence", "exhibit_number"),
        load("timeline_entries", "event_date"),
        load("case_issues", "created_at"),
        load("case_people", "name"),
        load("case_organizations", "name"),
        load("case_communications", "occurred_on"),
        load("case_records_requests", "due_date"),
        load("case_record_gaps", "due_date"),
        load("case_evidence_mentions", "created_at"),
        load("notes", "created_at"),
        load("case_links", "created_at"),
        load("case_packets", "created_at"),
      ]);
      return { evidence, timeline, issues, people, organizations, communications, requests, record_gaps, evidence_mentions, notes, links, packets };
    },
  });
  return { snapshot: query.data ?? empty, isLoading: query.isLoading, error: query.error };
}
