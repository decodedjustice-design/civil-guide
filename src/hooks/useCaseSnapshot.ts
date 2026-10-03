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
  notes: any[];
  links: any[];
}

const empty: CaseSnapshot = {
  evidence: [], timeline: [], issues: [], people: [], organizations: [],
  communications: [], requests: [], record_gaps: [], notes: [], links: [],
};

/** Canonical case snapshot used across workspace screens. */
export function useCaseSnapshot(caseId?: string) {
  const query = useQuery({
    queryKey: ["case-snapshot", caseId],
    enabled: !!caseId,
    queryFn: async (): Promise<CaseSnapshot> => {
      if (!caseId) return empty;
      const load = async (table: string, order: string, extra?: (q: any) => any) => {
        try {
          let q = (supabase as any).from(table).select("*").eq("case_id", caseId);
          if (extra) q = extra(q);
          const { data, error } = await q.order(order, { ascending: true, nullsFirst: false });
          if (error) return [];
          return data ?? [];
        } catch {
          return [];
        }
      };

      const [evidence, timeline, issues, people, organizations, communications, requests, links, notes] =
        await Promise.all([
          load("evidence", "exhibit_number"),
          load("timeline_entries", "event_date"),
          load("case_issues", "created_at"),
          load("case_people", "name"),
          load("case_organizations", "name"),
          load("case_communications", "occurred_on"),
          load("case_records_requests", "due_date"),
          load("case_links", "created_at"),
          load("notes", "created_at"),
        ]);

      // Record gaps are derived from what each issue still needs, so nothing is
      // tracked twice and no gap can silently become a fact.
      const record_gaps = (issues as any[])
        .filter((issue) => typeof issue.missing_records === "string" && issue.missing_records.trim().length > 0)
        .map((issue) => ({
          id: `gap-${issue.id}`,
          issue_id: issue.id,
          related_issue_id: issue.id,
          title: issue.title,
          description: issue.missing_records,
          status: issue.status === "closed" ? "resolved" : "identified",
          created_at: issue.created_at,
        }));

      return {
        evidence, timeline, issues, people, organizations,
        communications, requests, record_gaps, notes, links,
      };
    },
  });

  return { snapshot: query.data ?? empty, isLoading: query.isLoading };
}
