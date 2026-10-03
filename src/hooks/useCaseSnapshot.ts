import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CaseSnapshot {
  evidence: any[];
  timeline: any[];
  issues: any[];
  people: any[];
  organizations: any[];
  communications: any[];
  requests: any[];
  record_gaps: any[];
  evidence_mentions: any[];
  notes: any[];
  links: any[];
}

const empty: CaseSnapshot = {
  evidence: [], timeline: [], issues: [], people: [], organizations: [],
  communications: [], requests: [], record_gaps: [], evidence_mentions: [], notes: [], links: [],
};

/** Canonical case snapshot used across workspace screens. */
export function useCaseSnapshot(caseId?: string) {
  const query = useQuery({
    queryKey: ["case-snapshot", caseId],
    enabled: !!caseId,
    queryFn: async (): Promise<CaseSnapshot> => {
      if (!caseId) return empty;
      const load = async (table: string, order: string) => {
        try {
          const { data, error } = await (supabase as any)
            .from(table)
            .select("*")
            .eq("case_id", caseId)
            .order(order, { ascending: true, nullsFirst: false });
          if (error) return [];
          return data ?? [];
        } catch {
          return [];
        }
      };

      const [evidence, timeline, issues, people, organizations, communications, requests, record_gaps, evidence_mentions, notes, links] =
        await Promise.all([
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
        ]);

      return {
        evidence, timeline, issues, people, organizations,
        communications, requests, record_gaps, evidence_mentions, notes, links,
      };
    },
  });

  return { snapshot: query.data ?? empty, isLoading: query.isLoading };
}
