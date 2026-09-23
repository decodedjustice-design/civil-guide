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

/** Canonical Milestone 1B case snapshot used across workspace screens. */
export function useCaseSnapshot(caseId?: string) {
  const query = useQuery({
    queryKey: ["case-snapshot", caseId],
    enabled: !!caseId,
    queryFn: async (): Promise<CaseSnapshot> => {
      if (!caseId) return empty;
      const load = async (table: string, order: string, extra?: (q: any) => any) => {
        let q = (supabase as any).from(table).select("*").eq("case_id", caseId);
        if (extra) q = extra(q);
        const { data, error } = await q.order(order, { ascending: true, nullsFirst: false });
        if (error) throw error;
        return data ?? [];
      };

      const [evidence, timeline, issues, people, organizations, communications, requests, record_gaps, links] =
        await Promise.all([
          load("documents", "exhibit_number"),
          load("events", "occurred_at"),
          load("issues", "created_at"),
          load("people", "display_name"),
          load("organizations", "name"),
          load("communications", "occurred_at"),
          load("record_requests", "due_at"),
          load("tasks", "due_at", (q) => q.eq("task_type", "record_gap")),
          load("case_relationships", "created_at"),
        ]);

      return {
        evidence, timeline, issues, people, organizations,
        communications, requests, record_gaps, notes: [], links,
      };
    },
  });

  return { snapshot: query.data ?? empty, isLoading: query.isLoading };
}
